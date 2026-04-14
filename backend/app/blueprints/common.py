from flask import Blueprint, jsonify

common_bp = Blueprint("common", __name__)


@common_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


@common_bp.get("/status")
def status():
    return jsonify({"service": "brain2.0", "ready": True})
