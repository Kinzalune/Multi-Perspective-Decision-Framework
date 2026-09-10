import pytest
from schemas import DebateState, AgentTurnResult
from state_manager import save_debate_state, get_debate_state

def test_pydantic_schema_validation():
    payload = {
        "session_id": "test_101",
        "round_number": 1,
        "persona": "optimist",
        "argument_text": "Feasible plan."
    }
    turn = AgentTurnResult(**payload)
    assert turn.persona == "optimist"
    assert turn.round_number == 1

def test_state_round_increment():
    state = DebateState(session_id="test_102", user_query="Evaluate architecture")
    assert state.current_round == 1
    state.current_round += 1
    assert state.current_round == 2