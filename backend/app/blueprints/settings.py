from flask import Blueprint, jsonify

from app.utils.request_context import require_auth, tenant_id

settings_bp = Blueprint("settings", __name__, url_prefix="/api/v1/settings")


@settings_bp.get("")
@require_auth
def get_settings():
    return jsonify({"business_id": tenant_id(), "legal_required": False, "timezone": "Asia/Kolkata"})
