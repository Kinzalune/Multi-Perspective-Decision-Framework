# backend-core/failure_handler.py
import logging
from typing import Optional, Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FailureHandler")

class CircuitBreakerOpenException(Exception):
    pass

class FailureHandler:
    def __init__(self, failure_threshold: int = 3, recovery_time_secs: int = 30):
        self.failure_threshold = failure_threshold
        self.recovery_time_secs = recovery_time_secs
        self.failure_counts: Dict[str, int] = {}
        self.circuit_open: Dict[str, bool] = {}

    def record_failure(self, persona: str, error: Exception) -> None:
        count = self.failure_counts.get(persona, 0) + 1
        self.failure_counts[persona] = count
        logger.warning(f"Failure registered for agent '{persona}'. Consecutive count: {count}. Error: {error}")

        if count >= self.failure_threshold:
            self.circuit_open[persona] = True
            logger.error(f"Circuit tripped OPEN for agent '{persona}'. Disabling further requests.")

    def record_success(self, persona: str) -> None:
        self.failure_counts[persona] = 0
        self.circuit_open[persona] = False

    def can_execute(self, persona: str) -> bool:
        return not self.circuit_open.get(persona, False)

    def generate_fallback_turn(self, persona: str, session_id: str, round_num: int) -> Dict[str, Any]:
        """Provides a graceful default stance so the debate pipeline doesn't halt."""
        logger.info(f"Generating deterministic fallback turn for agent '{persona}'.")
        return {
            "session_id": session_id,
            "round_number": round_num,
            "persona": persona,
            "argument_text": f"[{persona.upper()}] Default concession: Temporary service degradation prevented generation. Maintaining prior round position.",
        }