import os
import json
import redis
from pydantic import BaseModel
from typing import List, Dict, Any

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

class ConversationMemory:
    @staticmethod
    def get_history(session_id: str, limit: int = 10) -> List[Dict[str, str]]:
        key = f"session:{session_id}:history"
        history_json = redis_client.lrange(key, -limit, -1)
        if not history_json:
            return []
        return [json.loads(msg) for msg in history_json]

    @staticmethod
    def add_message(session_id: str, role: str, content: str):
        key = f"session:{session_id}:history"
        msg = json.dumps({"role": role, "content": content})
        redis_client.rpush(key, msg)
        # Keep only the last 50 messages to prevent infinite growth
        redis_client.ltrim(key, -50, -1)
        # Set expiry to 24 hours
        redis_client.expire(key, 86400)
