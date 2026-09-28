"""Consensus scoring and termination logic.

This is the integration point orchestrator.py should import -- see
README.md for the exact hook location and contract.

Deliberately has no import-time dependency on backend-core/schemas.py's
AgentTurnResult class (this repo doesn't share a package across the
sibling top-level modules; each ships its own requirements.txt/config.py
and is deployable on its own). Instead, every item in `history` just
needs to expose `round_number`, `persona`, and `argument_text` -- either
as attributes (a real AgentTurnResult instance works as-is) or as dict
keys. That match is what lets orchestrator.py hand this function
state.history directly with zero conversion.
"""

from collections import defaultdict
from typing import Any, Sequence

import numpy as np
from pydantic import BaseModel

import config

_model = None


def _get_model():
    """Lazily load and cache the sentence-transformer model.

    Loaded once per process on first use, not per call -- embedding
    model load time dwarfs a single encode() call, and this function
    may be invoked once per round.
    """
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(config.EMBEDDING_MODEL)
    return _model


def _field(turn: Any, name: str):
    """Read `name` off an AgentTurnResult instance or an equivalent dict."""
    if isinstance(turn, dict):
        return turn[name]
    return getattr(turn, name)


def _group_by_round(history: Sequence[Any]) -> dict[int, list]:
    grouped: dict[int, list] = defaultdict(list)
    for turn in history:
        grouped[_field(turn, "round_number")].append(turn)
    return grouped


def _pairwise_similarities(turns: list) -> tuple[list[str], "np.ndarray"] | None:
    """Return (personas, embeddings) for a round, or None if <2 turns."""
    if len(turns) < 2:
        return None
    personas = [_field(t, "persona") for t in turns]
    texts = [_field(t, "argument_text") for t in turns]
    embeddings = _get_model().encode(texts, normalize_embeddings=True)
    return personas, embeddings


def _round_consensus_score(turns: list) -> float | None:
    """Mean pairwise cosine similarity across all arguments in a round.

    None if the round has fewer than 2 turns (nothing to compare).
    """
    result = _pairwise_similarities(turns)
    if result is None:
        return None
    _, embeddings = result
    n = len(embeddings)
    sims = [
        float(np.dot(embeddings[i], embeddings[j]))
        for i in range(n)
        for j in range(i + 1, n)
    ]
    return float(np.mean(sims))


def _round_holdouts(turns: list, threshold: float) -> list[str]:
    """Personas whose average similarity to the rest of the round's
    arguments falls below `threshold` -- i.e. the dissenting agent(s),
    reported by persona label so ordering never matters.
    """
    result = _pairwise_similarities(turns)
    if result is None:
        return []
    personas, embeddings = result
    n = len(embeddings)
    holdouts = []
    for i in range(n):
        others = [float(np.dot(embeddings[i], embeddings[j])) for j in range(n) if j != i]
        if float(np.mean(others)) < threshold:
            holdouts.append(personas[i])
    return holdouts


class TerminationDecision(BaseModel):
    should_terminate: bool
    state: str  # one of the STATES below
    consensus_score: float
    holdouts: list[str]
    message: str


STATES = (
    "converged",
    "partial",
    "stalled",
    "diverging",
    "max_rounds",
    "budget_exceeded",
    "in_progress",  # not one of the six named states; the "keep going" default
)


def evaluate_termination(
    history: Sequence[Any],
    current_round: int,
    max_rounds: int,
    total_tokens_used: int,
    token_budget: int | None = None,
) -> TerminationDecision:
    """Decide whether a debate should stop, based on state.history so far.

    Call this once per completed round, after that round's turns have
    been appended to state.history but *before* state.current_round is
    incremented -- see README.md's Hook Location / Contract section for
    the exact call site in orchestrator.py.

    `token_budget` defaults to config.TOKEN_BUDGET (None = unset = no
    budget check) if not passed explicitly.
    """
    if token_budget is None:
        token_budget = config.TOKEN_BUDGET

    # Budget is a hard stop and is checked first, independent of how
    # good consensus looks -- there's no point scoring a round the
    # caller can't afford to have run.
    if token_budget is not None and total_tokens_used >= token_budget:
        grouped = _group_by_round(history)
        score = _round_consensus_score(grouped[max(grouped)]) if grouped else None
        return TerminationDecision(
            should_terminate=True,
            state="budget_exceeded",
            consensus_score=score or 0.0,
            holdouts=[],
            message=f"total_tokens_used ({total_tokens_used}) reached token_budget ({token_budget}).",
        )

    grouped = _group_by_round(history)
    if not grouped:
        return TerminationDecision(
            should_terminate=False,
            state="in_progress",
            consensus_score=0.0,
            holdouts=[],
            message="No turns recorded yet.",
        )

    latest_round_num = max(grouped)
    latest_turns = grouped[latest_round_num]
    score = _round_consensus_score(latest_turns)
    holdouts = _round_holdouts(latest_turns, config.HOLDOUT_THRESHOLD)

    if score is None:
        # Fewer than 2 personas responded this round -- nothing to compare
        # yet, so there's no basis for a similarity-driven state.
        score = 0.0

    # max_rounds is the other hard stop: this was the last allowed round.
    if current_round >= max_rounds:
        return TerminationDecision(
            should_terminate=True,
            state="max_rounds",
            consensus_score=score,
            holdouts=holdouts,
            message=f"Reached max_rounds ({max_rounds}).",
        )

    if score >= config.CONVERGENCE_THRESHOLD:
        return TerminationDecision(
            should_terminate=True,
            state="converged",
            consensus_score=score,
            holdouts=holdouts,
            message=f"Consensus score {score:.3f} >= convergence threshold {config.CONVERGENCE_THRESHOLD}.",
        )

    prev_turns = grouped.get(latest_round_num - 1)
    if prev_turns is not None:
        prev_score = _round_consensus_score(prev_turns)
        if prev_score is not None:
            delta = score - prev_score
            if abs(delta) <= config.STALL_DELTA:
                return TerminationDecision(
                    should_terminate=True,
                    state="stalled",
                    consensus_score=score,
                    holdouts=holdouts,
                    message=f"Score moved only {delta:+.3f} round-over-round (<= stall delta {config.STALL_DELTA}).",
                )
            if delta <= -config.DIVERGENCE_DELTA:
                return TerminationDecision(
                    should_terminate=config.TERMINATE_ON_DIVERGE,
                    state="diverging",
                    consensus_score=score,
                    holdouts=holdouts,
                    message=f"Score dropped {delta:+.3f} round-over-round (<= -{config.DIVERGENCE_DELTA}).",
                )

    if score >= config.PARTIAL_THRESHOLD:
        return TerminationDecision(
            should_terminate=False,
            state="partial",
            consensus_score=score,
            holdouts=holdouts,
            message=f"Consensus score {score:.3f} is partial agreement; continuing.",
        )

    return TerminationDecision(
        should_terminate=False,
        state="in_progress",
        consensus_score=score,
        holdouts=holdouts,
        message=f"Consensus score {score:.3f}; below partial threshold, continuing.",
    )
