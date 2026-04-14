from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import random
from typing import Any

import jwt
from flask import current_app


@dataclass
class AuthResult:
    token: str
    user: dict[str, Any]


def generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def issue_token(payload: dict[str, Any]) -> str:
    exp = datetime.now(timezone.utc) + timedelta(hours=12)
    body = {**payload, "exp": exp}
    return jwt.encode(body, current_app.config["SECRET_KEY"], algorithm="HS256")


def verify_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
