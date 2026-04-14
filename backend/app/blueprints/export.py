from flask import Blueprint, jsonify

from app.utils.request_context import require_auth, tenant_id

export_bp = Blueprint("export", __name__, url_prefix="/api/v1/export")


@export_bp.get("/leads")
@require_auth
def export_leads():
    return jsonify({"export": "stub", "business_id": tenant_id(), "format": "csv"})
