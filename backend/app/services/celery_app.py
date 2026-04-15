from __future__ import annotations

import logging
from typing import Any, Callable

try:
    from celery import Celery
except Exception:  # pragma: no cover
    Celery = None


class DummyTask:
    def __init__(self, fn: Callable[..., Any]):
        self.fn = fn

    def delay(self, *args: Any, **kwargs: Any) -> Any:
        return self.fn(*args, **kwargs)


class DummyCelery:
    def task(self, *args: Any, **kwargs: Any):
        def decorator(fn: Callable[..., Any]) -> DummyTask:
            return DummyTask(fn)

        return decorator


def init_celery(redis_url: str):
    if not Celery:
        logging.warning("Celery unavailable, using dummy fallback")
        return DummyCelery()
    try:
        app = Celery("brain2", broker=redis_url, backend=redis_url)
        app.control.ping(timeout=0.5)
        return app
    except Exception as exc:
        logging.warning("Celery/Redis unavailable, using dummy fallback: %s", exc)
        return DummyCelery()
