from __future__ import annotations

import json
import logging
from typing import Any, Optional

try:
    import redis
except Exception:  # pragma: no cover
    redis = None


class CacheClient:
    def __init__(self, redis_url: str):
        self._fallback: dict[str, str] = {}
        self._redis = None
        if redis:
            try:
                self._redis = redis.Redis.from_url(redis_url, decode_responses=True)
                self._redis.ping()
            except Exception as exc:
                logging.warning("Redis unavailable, using in-memory cache: %s", exc)
                self._redis = None

    def get(self, key: str) -> Optional[str]:
        if self._redis:
            return self._redis.get(key)
        return self._fallback.get(key)

    def set_json(self, key: str, value: Any, ex: int = 300) -> None:
        payload = json.dumps(value)
        if self._redis:
            self._redis.set(key, payload, ex=ex)
        else:
            self._fallback[key] = payload

    def get_json(self, key: str) -> Optional[Any]:
        raw = self.get(key)
        if not raw:
            return None
        return json.loads(raw)
