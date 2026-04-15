from flask import Blueprint, jsonify, request

from app.utils.request_context import require_auth

instagram_bp = Blueprint("instagram", __name__, url_prefix="/api/v1/instagram")


@instagram_bp.get("/status")
@require_auth
def status():
    return jsonify({"connected": False, "account": None})


@instagram_bp.post("/auth")
@require_auth
def auth():
    code = request.json.get("code", "")
    return jsonify({"authorized": bool(code), "code_received": bool(code)})
