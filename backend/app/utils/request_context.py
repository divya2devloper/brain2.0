from __future__ import annotations

from functools import wraps
from typing import Any, Callable

from flask import jsonify, request

from app.services.auth import verify_token


def require_auth(fn: Callable[..., Any]):
    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
        token = auth_header.split(" ", 1)[1]
        try:
            claims = verify_token(token)
        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        request.user = claims
        return fn(*args, **kwargs)

    return wrapper


def tenant_id() -> str:
    user = getattr(request, "user", {})
    return user.get("business_id", "")
