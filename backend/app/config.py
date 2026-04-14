from __future__ import annotations

import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    CORS_ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5170").split(",") if o.strip()]
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    RATE_LIMIT = os.getenv("RATE_LIMIT", "100/minute")
