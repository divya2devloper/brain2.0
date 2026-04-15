from flask import Blueprint, jsonify

from app.utils.request_context import require_auth, tenant_id

gym_bp = Blueprint("gym", __name__, url_prefix="/api/v1/gym")


@gym_bp.get("/overview")
@require_auth
def overview():
    return jsonify({"business_id": tenant_id(), "name": "Brain Gym", "members": 128})
