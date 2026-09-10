#tasks.py
from celery import Celery
import time
import random
from datetime import datetime, timezone

celery_app = Celery(
    'mpdf_tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

celery_app.conf.update(
    task_serializer='jspn',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=2)
def execute_agent_turn(self, session_id: str, round_num: int, persona: str, query: str):
    try:
        print(f"[Celery Worker] Processing turn for {persona} in Round {round_num}...")

        time.sleep(1.2)

        if random.random()<0.10:
            raise Exception("Simulated LLM API Timeout Exception")

        return {
            "session_id": session_id,
            "round_number": round_num,
            "persona" : persona,
            "argument_text": f"[{persona.upper()}](Round {round_num}): Formulated stance regarding '{query}'.",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as exc:
        print(f"[Worker Error] {persona} failed. Retrying task...")
        raise self.retry(exc=exc)