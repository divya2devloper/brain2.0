from flask import Blueprint, jsonify, request

from app.utils.request_context import require_auth, tenant_id

training_bp = Blueprint("training", __name__, url_prefix="/api/v1/training")


@training_bp.post("/upload")
@require_auth
def upload_training_file():
    return jsonify({"uploaded": True, "business_id": tenant_id(), "status": "queued"})


@training_bp.post("/rules")
@require_auth
def save_rules():
    return jsonify({"saved": True, "business_id": tenant_id(), "rules": request.json or {}})


@training_bp.get("/status")
@require_auth
def status():
    return jsonify({"business_id": tenant_id(), "status": "ready"})
