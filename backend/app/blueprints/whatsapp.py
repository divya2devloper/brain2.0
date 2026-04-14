from flask import Blueprint, current_app, jsonify, request

from app.services.ai import gemini_reply
from app.utils.request_context import require_auth, tenant_id

whatsapp_bp = Blueprint("whatsapp", __name__, url_prefix="/api/v1/whatsapp")


def _sanitize_message(raw: str) -> str:
    cleaned = "".join(ch for ch in raw if ch.isprintable()).strip()
    return cleaned[:500]


@whatsapp_bp.get("/webhook")
def verify_webhook():
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge", "")
    if token == current_app.config.get("WHATSAPP_VERIFY_TOKEN"):
        return challenge, 200
    return "forbidden", 403


@whatsapp_bp.post("/webhook")
def ingest_webhook():
    body = request.json or {}
    msg = _sanitize_message(str(body.get("message", "Hello")))
    ai = gemini_reply(current_app.cache, f"Reply briefly to gym lead: {msg}")
    current_app.socketio.emit("whatsapp:new_message", {"incoming": msg, "ai": ai["reply"]})
    return jsonify({"received": True, "ai_reply": ai})


@whatsapp_bp.post("/send")
@require_auth
def send_message():
    return jsonify({"sent": True, "tenant": tenant_id()})
