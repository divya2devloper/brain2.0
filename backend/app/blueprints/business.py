from flask import Blueprint, jsonify, request

from app.utils.request_context import require_auth, tenant_id

business_bp = Blueprint("business", __name__, url_prefix="/api/v1/business")


@business_bp.get("/finance")
@require_auth
def finance_summary():
    return jsonify({"business_id": tenant_id(), "income": 185000, "expense": 54000, "net": 131000})


@business_bp.post("/staff/invite")
@require_auth
def invite_staff():
    email = request.json.get("email", "")
    role = request.json.get("role", "TRAINER")
    return jsonify({"invited": bool(email), "email": email, "role": role, "delivery": "smtp_fallback"})
