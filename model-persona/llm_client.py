
import time
from groq import Groq, RateLimitError
from config import GROQ_API_KEY, GROQ_MODEL

_client = Groq(api_key=GROQ_API_KEY)

MAX_RETRIES = 4
BASE_BACKOFF_SECONDS = 3


def chat(system_prompt: str, user_prompt: str, temperature: float = 0.6, max_tokens: int = 500) -> str:
    
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            response = _client.chat.completions.create(
                model=GROQ_MODEL,
                temperature=temperature,
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )
            content = response.choices[0].message.content
            return (content or "").strip()
        except RateLimitError as e:
            last_error = e
            wait = BASE_BACKOFF_SECONDS * (2 ** attempt)
            print(f"[llm_client] rate limited, waiting {wait}s before retry {attempt + 1}/{MAX_RETRIES}")
            time.sleep(wait)
    raise last_error
