from flask import Blueprint, jsonify, request

from app.utils.request_context import require_auth, tenant_id

billing_bp = Blueprint("billing", __name__, url_prefix="/api/v1/billing")


@billing_bp.post("/upgrade")
@require_auth
def upgrade():
    plan = request.json.get("plan", "pro")
    return jsonify({"business_id": tenant_id(), "upgraded": True, "plan": plan})


@billing_bp.post("/addon")
@require_auth
def addon():
    addon_name = request.json.get("addon", "ai-pack")
    return jsonify({"business_id": tenant_id(), "added": True, "addon": addon_name})


@billing_bp.get("/invoice/<invoice_id>.pdf")
@require_auth
def invoice(invoice_id: str):
    return jsonify({"invoice_id": invoice_id, "stub": True, "business_id": tenant_id()})
