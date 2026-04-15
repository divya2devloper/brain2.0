from __future__ import annotations

from typing import Any

import httpx
from flask import current_app

from .cache import CacheClient


def gemini_reply(cache: CacheClient, prompt: str) -> dict[str, Any]:
    key = f"gemini:{hash(prompt)}"
    cached = cache.get_json(key)
    if cached:
        return {"source": "cache", "reply": cached["reply"]}

    api_key = current_app.config.get("GEMINI_API_KEY", "")
    if not api_key:
        fallback = {"reply": "Thanks for reaching out. Our team will connect shortly."}
        cache.set_json(key, fallback, ex=300)
        return {"source": "fallback", **fallback}

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-1.5-flash:generateContent?key={api_key}"
    )
    try:
        with httpx.Client(timeout=20.0) as client:
            r = client.post(url, json=payload)
            r.raise_for_status()
            data = r.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        body = {"reply": text}
        cache.set_json(key, body, ex=300)
        return {"source": "gemini", **body}
    except Exception:
        fallback = {"reply": "Hi! Please share your goals and we can suggest the best plan."}
        cache.set_json(key, fallback, ex=120)
        return {"source": "fallback", **fallback}
