#orchestartor.py

from schemas import DebateState, AgentTurnResult
import time 
from datetime import datetime

def mock_agent_execution(persona: str, round_num: int, query: str) -> str:
    """Simulates background worker execution without requiring external connections."""
    time.sleep(0.5) #to simulate network latency we use sleep here
    return f"[{persona.upper()}] (Round {round_num}): Analyzed query '{query}'. Identified key opportunities and risks."

def run_orchestration_cycle(state: DebateState) -> DebateState:
    print(f"\n==========")
    print(f"   RUNNING DEBATE ROUND {state.current_round} / {state.max_rounds}")
    print(f"========")

    for persona in state.agent_order:
        print(f"[Orchestrator] Requesting argument from: {persona}...")

        #Simulate worker processing
        argument_output = mock_agent_execution(persona, state.current_round, state.user_query)

        # Validate output through Pydantic
        turn_data = AgentTurnResult(
            session_id= state.session_id,
            round_number= state.current_round,
            persona=persona,
            argument_text=argument_output,
            timestamp=datetime.utcnow()
        )

        state.history.append(turn_data)
        print(f" -> Successfully parsed and stored turn for {persona}")

    # Progress round counter
    state.current_round +=1

    if state.current_round > state.max_rounds:
        state.is_completed = True
        state.termination_reason = "max_rounds_reached"

    return state

if __name__ == "__main__":
    # initialize state
    session = DebateState(
        session_id="session_demo_001",
        user_query="Should we move our core application to AWS severless",
        max_round=2
    )

    print(f"Initial Session ID: {session.session_id}")
    print(f"Target Query: {session.user_query}")

    while not session.is_completed:
        session = run_orchestration_cycle(session)

    print(f"\nDebate Loop Ended! Reason: {session.termination_reason}")
    print(f"Total History Items Generated: {len(session.history)}")