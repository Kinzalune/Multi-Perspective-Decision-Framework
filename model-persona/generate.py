
from personas import get_prompt
from llm_client import chat


def _build_user_prompt(query: str, round_num: int, debate_history: str = "") -> str:
    if round_num == 1 or not debate_history:
        return f"Decision problem: {query}\n\nGive your initial analysis."

    return (
        f"Decision problem: {query}\n\n"
        f"Here is what all agents argued in the previous round:\n{debate_history}\n\n"
        f"Considering these other viewpoints, refine or defend your position, "
        f"being specific about where you agree or disagree and with whom."
    )


def generate_argument(persona: str, query: str, round_num: int, debate_history: str = "") -> str:
    """Generate one persona's argument text for one round.

    This is the primitive tasks.py's execute_agent_turn should call in
    place of its mock f-string. It returns plain text -- tasks.py stays
    responsible for wrapping session_id/round_number/timestamp around
    it, since those are orchestration concerns, not persona concerns.
    """
    system_prompt = get_prompt(persona)
    user_prompt = _build_user_prompt(query, round_num, debate_history)
    return chat(system_prompt, user_prompt)


def build_turn_payload(session_id: str, round_num: int, persona: str, query: str, debate_history: str = "") -> dict:
    """Convenience wrapper returning a dict that already conforms to
    AgentTurnResult (schemas.py), in case it's simpler for tasks.py to
    call this directly instead of assembling the dict itself. Matches
    the field names/types AgentTurnResult expects exactly.
    """
    from datetime import datetime, timezone

    return {
        "session_id": session_id,
        "round_number": round_num,
        "persona": persona,
        "argument_text": generate_argument(persona, query, round_num, debate_history),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
