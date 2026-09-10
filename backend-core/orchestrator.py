from schemas import DebateState, AgentTurnResult
from tasks import execute_agent_turn
from failure_handler import FailureHandler
from datetime import datetime, timezone

circuit_manager = FailureHandler(failure_threshold=2)

def run_async_orchestration_cycle(state: DebateState) -> DebateState:
    print(f"\n==========================================")
    print(f"       ASYNC DEBATE ROUND {state.current_round} / {state.max_rounds}")
    print(f"==========================================")

    pending_tasks = {}
    for persona in state.agent_order:
        print(f"[Orchestrator] Queueing task for: {persona}...")
        async_result = execute_agent_turn.delay(
            state.session_id,
            state.current_round,
            persona,
            state.user_query
        )
        pending_tasks[persona] = async_result

    for persona, task_handle in pending_tasks.items():
        try:
            raw_result = task_handle.get(timeout=10.0)
            circuit_manager.record_success(persona)
        except Exception as exc:
            print(f"[Warning] Task failed for {persona}: {exc}")
            circuit_manager.record_failure(persona, exc)
            raw_result = circuit_manager.generate_fallback_turn(persona, state.user_query)
            raw_result["round_number"] = state.current_round
            raw_result["session_id"] = state.session_id
            raw_result["timestamp"] = datetime.now(timezone.utc).isoformat()

        turn_data = AgentTurnResult(
            session_id=raw_result["session_id"],
            round_number=raw_result["round_number"],
            persona=raw_result["persona"],
            argument_text=raw_result["argument_text"],
            timestamp=datetime.fromisoformat(raw_result["timestamp"])
        )
        state.history.append(turn_data)
        print(f" -> Stored turn for {persona}")

    state.current_round += 1
    if state.current_round > state.max_rounds:
        state.is_completed = True
        state.termination_reason = "max_rounds_reached"

    return state

if __name__ == "__main__":
    session = DebateState(
        session_id="session_async_001",
        user_query="Should we migrate our backend to an asynchronous microservice architecture?",
        max_rounds=2
    )
    
    while not session.is_completed:
        session = run_async_orchestration_cycle(session)
        
    print(f"\nDebate Loop Finished! Reason: {session.termination_reason}")
    print(f"Total History Size: {len(session.history)}")