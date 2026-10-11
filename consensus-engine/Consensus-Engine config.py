import os
from pathlib import Path
from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_env_path, encoding="utf-8-sig")


def _float(name: str, default: float) -> float:
    val = os.getenv(name)
    return float(val) if val not in (None, "") else default


def _int_or_none(name: str) -> int | None:
    val = os.getenv(name)
    return int(val) if val not in (None, "") else None


def _bool(name: str, default: bool) -> bool:
    val = os.getenv(name)
    if val in (None, ""):
        return default
    return val.strip().lower() in ("1", "true", "yes", "on")


# Sentence-transformer model used to embed argument_text for similarity scoring.
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# Mean pairwise cosine similarity across a round's arguments at/above which
# the round counts as "converged".
CONVERGENCE_THRESHOLD = _float("CONVERGENCE_THRESHOLD", 0.85)

# Mean pairwise cosine similarity at/above which a round counts as "partial"
# agreement (below CONVERGENCE_THRESHOLD, above this).
PARTIAL_THRESHOLD = _float("PARTIAL_THRESHOLD", 0.65)

# A persona whose average similarity to the *other* personas in the round
# falls below this is reported as a holdout/dissenter for that round.
HOLDOUT_THRESHOLD = _float("HOLDOUT_THRESHOLD", 0.55)

# If the round-over-round change in consensus score has an absolute value
# at/below this, the debate is treated as "stalled" (no meaningful movement).
STALL_DELTA = _float("STALL_DELTA", 0.02)

# If the round-over-round consensus score drops by at least this much, the
# debate is treated as "diverging" (personas moving apart, not together).
DIVERGENCE_DELTA = _float("DIVERGENCE_DELTA", 0.05)

# Whether "diverging" should itself trigger should_terminate=True. If False,
# diverging is reported but the debate is allowed to keep running (e.g. to
# see if a later round recovers) until max_rounds/budget/stall catches it.
TERMINATE_ON_DIVERGE = _bool("TERMINATE_ON_DIVERGE", True)

# Optional hard ceiling on total_tokens_used across the whole debate. Left
# unset (None) means no budget check is enforced.
TOKEN_BUDGET = _int_or_none("TOKEN_BUDGET")