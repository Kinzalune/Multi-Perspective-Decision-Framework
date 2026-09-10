import json
import redis
from schemas import DebateState

redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)

def save_debate_state(state: DebateState) -> None:
    """Serializes and saves the active debate state into Redis with a 1-hour TTL."""
    redis_client.setex(f"debate:{state.session_id}", 3600, state.model_dump_json())

def get_debate_state(session_id: str) -> DebateState | None:
    """Retrieves and deserializes state from Redis."""
    raw_data = redis_client.get(f"debate:{session_id}")
    if raw_data:
        return DebateState.model_validate_json(raw_data)
    return None