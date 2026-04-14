from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS

from app.blueprints.auth import auth_bp
from app.blueprints.billing import billing_bp
from app.blueprints.business import business_bp
from app.blueprints.common import common_bp
from app.blueprints.dashboard import dashboard_bp
from app.blueprints.export import export_bp
from app.blueprints.gym import gym_bp
from app.blueprints.instagram import instagram_bp
from app.blueprints.leads import leads_bp
from app.blueprints.settings import settings_bp
from app.blueprints.training import training_bp
from app.blueprints.whatsapp import whatsapp_bp
from app.config import Config
from app.extensions import limiter, socketio
from app.services.cache import CacheClient
from app.services.celery_app import init_celery
from app.services.supabase import SupabaseClient
from app.utils.logging_setup import setup_logging

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="/")
    app.config.from_object(Config)

    setup_logging()
    CORS(app, supports_credentials=True, origins=app.config["CORS_ALLOWED_ORIGINS"])
    limiter.init_app(app, default_limits=[app.config["RATE_LIMIT"]])
    socketio.init_app(app)

    app.cache = CacheClient(app.config["REDIS_URL"])
    app.supabase = SupabaseClient(
        app.config["SUPABASE_URL"], app.config["SUPABASE_KEY"], app.config["SUPABASE_SERVICE_KEY"]
    )
    app.celery = init_celery(app.config["REDIS_URL"])
    app.socketio = socketio

    for bp in [
        common_bp,
        auth_bp,
        gym_bp,
        dashboard_bp,
        whatsapp_bp,
        instagram_bp,
        business_bp,
        export_bp,
        training_bp,
        leads_bp,
        billing_bp,
        settings_bp,
    ]:
        app.register_blueprint(bp)

    @app.get("/")
    def serve_index():
        index = Path(app.static_folder or "") / "index.html"
        if index.exists():
            return send_from_directory(app.static_folder, "index.html")
        return {"message": "Brain 2.0 API running"}

    @app.get("/<path:path>")
    def spa(path: str):
        static_root = Path(app.static_folder or "")
        file_path = static_root / path
        if file_path.exists() and file_path.is_file():
            return send_from_directory(app.static_folder, path)
        if (static_root / "index.html").exists():
            return send_from_directory(app.static_folder, "index.html")
        return {"error": "Not found"}, 404

    return app


if __name__ == "__main__":
    port = int(os.getenv("PORT", "2021"))
    socketio.run(create_app(), host="0.0.0.0", port=port)
