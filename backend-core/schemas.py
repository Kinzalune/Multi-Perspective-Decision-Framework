#schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AgentTurnResult(BaseModel):
    session_id: str
    round_number: int
    persona: str
    argument_text:str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DebateState(BaseModel):
    session_id: str
    user_query: str
    current_round: int = 1
    max_rounds: int = 3
    agent_order: list[str] = ["optimist", "skeptic", "cost_cutter"]
    history: List[AgentTurnResult]=[]
    is_completed: bool = False
    termination_reason: Optional[str] = None

