
import os
from pathlib import Path
from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_env_path, encoding="utf-8-sig")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not set. Copy .env.example to .env in "
        "model-persona/ and add your real key. Never commit .env "
        "-- only .env.example, which must contain a placeholder, "
        "not a real key."
    )
