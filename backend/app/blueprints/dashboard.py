from flask import Blueprint, jsonify

from app.utils.request_context import require_auth

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/v1/dashboard")


@dashboard_bp.get("/metrics")
@require_auth
def metrics():
    return jsonify(
        {
            "leads": 42,
            "active_members": 128,
            "monthly_revenue": 185000,
            "expenses": 54000,
            "roi": 2.4,
        }
    )
