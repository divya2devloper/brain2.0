from flask import Blueprint, current_app, jsonify, request

from app.utils.request_context import require_auth, tenant_id

leads_bp = Blueprint("leads", __name__, url_prefix="/api/v1/leads")


@leads_bp.get("")
@require_auth
def list_leads():
    tid = tenant_id()
    if not current_app.config.get("SUPABASE_URL"):
        return jsonify([{"id": "demo-1", "name": "Demo Lead", "status": "NEW", "source": "instagram"}])
    rows = current_app.supabase.select("lead", "business_id", tid)
    return jsonify(rows)


@leads_bp.patch("/<lead_id>")
@require_auth
def update_lead(lead_id: str):
    tid = tenant_id()
    payload = request.json or {}
    if not current_app.config.get("SUPABASE_URL"):
        return jsonify({"updated": True, "id": lead_id, "business_id": tid, "payload": payload})
    rows = current_app.supabase.update("lead", "id", lead_id, "business_id", tid, payload)
    return jsonify(rows)
