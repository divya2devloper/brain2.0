from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request

from app.services.auth import issue_token
from app.utils.request_context import require_auth, require_role

public_bp = Blueprint("public", __name__, url_prefix="/api/v1/public")
owner_bp = Blueprint("owner", __name__, url_prefix="/api/v1/owner")
admin_bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


USERS: dict[str, dict] = {}
GYMS: dict[str, dict] = {}
OWNER_APPLICATIONS: dict[str, dict] = {}
ROLE_ASSIGNMENTS: dict[str, set[str]] = {}
# Demo in-memory stores for local/testing use; replace with persistent DB in production.

DEMO_PLANS = [
    {"id": "starter", "price_monthly": 49, "currency": "USD"},
    {"id": "growth", "price_monthly": 99, "currency": "USD"},
    {"id": "pro", "price_monthly": 199, "currency": "USD"},
]


def _can_access_gym(gym: dict, claims: dict) -> bool:
    role = str(claims.get("role", "")).upper()
    if role == "ADMIN":
        return True
    return gym.get("owner_user_id") == claims.get("user_id") or gym.get("business_id") == claims.get("business_id")


@public_bp.get("/landing")
def landing():
    return jsonify(
        {
            "brand": "Brain 2.0",
            "sections": ["Landing", "Search Gyms", "Gym Detail", "Signup/Login", "Pricing", "Help/FAQ"],
        }
    )


@public_bp.get("/gyms/search")
def search_gyms():
    q = request.args.get("q", "").strip().lower()
    approved = [gym for gym in GYMS.values() if gym.get("status") == "APPROVED" and gym.get("is_public")]
    if not q:
        return jsonify({"gyms": approved})
    gyms = [gym for gym in approved if q in gym.get("name", "").lower() or q in gym.get("address", "").lower()]
    return jsonify({"gyms": gyms})


@public_bp.get("/gyms/<gym_id>")
def gym_detail(gym_id: str):
    gym = GYMS.get(gym_id)
    if not gym or gym.get("status") != "APPROVED" or not gym.get("is_public"):
        return jsonify({"error": "gym_not_found"}), 404
    return jsonify(gym)


@owner_bp.post("/onboarding/register")
def owner_register():
    data = request.json or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", "")).strip()
    full_name = str(data.get("full_name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    auth_provider = str(data.get("auth_provider", "email")).strip().lower()
    if auth_provider not in {"email", "google", "apple"}:
        return jsonify({"error": "unsupported_auth_provider"}), 400

    if not email or (auth_provider == "email" and not password) or not full_name or not phone:
        return jsonify({"error": "required_fields_missing"}), 400
    if auth_provider == "email":
        otp_verified = current_app.cache.get_json(f"otp_verified:{email}") or {}
        if not otp_verified.get("verified"):
            return jsonify({"error": "email_verification_required"}), 400
    elif not str(data.get("oauth_token", "")).strip():
        return jsonify({"error": "oauth_token_required"}), 400

    user_id = str(uuid4())
    business_id = str(uuid4())
    # One owner registration gets an isolated business_id to enforce tenant separation by default.
    user = {
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "phone": phone,
        "account_type": "GYM_OWNER",
        "business_id": business_id,
        "created_at": _now_iso(),
    }
    USERS[user_id] = user
    ROLE_ASSIGNMENTS[user_id] = {"OWNER"}
    token = issue_token({"sub": email, "user_id": user_id, "business_id": business_id, "role": "OWNER"})
    return jsonify({"token": token, "user": user})


@owner_bp.post("/onboarding/basic-profile")
@require_auth
@require_role("OWNER", "ADMIN")
def owner_basic_profile():
    data = request.json or {}
    full_name = str(data.get("full_name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    if not full_name or not phone or not email:
        return jsonify({"error": "required_fields_missing"}), 400
    return jsonify({"saved": True, "profile": {"full_name": full_name, "phone": phone, "email": email}})


@owner_bp.post("/onboarding/create-gym")
@require_auth
@require_role("OWNER", "ADMIN")
def owner_create_gym():
    data = request.json or {}
    required = ["name", "address", "latitude", "longitude", "description", "timezone", "hours", "amenities"]
    missing = [f for f in required if data.get(f) in (None, "")]
    if missing:
        return jsonify({"error": "required_fields_missing", "fields": missing}), 400

    claims = getattr(request, "user", {})
    gym_id = str(uuid4())
    application_id = str(uuid4())
    gym = {
        "id": gym_id,
        "owner_user_id": claims.get("user_id"),
        "business_id": claims.get("business_id"),
        "name": data["name"],
        "address": data["address"],
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "description": data["description"],
        "timezone": data["timezone"],
        "hours": data["hours"],
        "amenities": data["amenities"],
        "website": data.get("website"),
        "phone": data.get("phone"),
        "photos": data.get("photos", []),
        "logo_url": data.get("logo_url"),
        "status": "PENDING",
        "is_public": False,
        "created_at": _now_iso(),
    }
    application = {
        "id": application_id,
        "gym_id": gym_id,
        "owner_user_id": claims.get("user_id"),
        "status": "PENDING",
        "requested_at": _now_iso(),
    }
    GYMS[gym_id] = gym
    OWNER_APPLICATIONS[application_id] = application
    return jsonify({"gym": gym, "application": application}), 201


@owner_bp.post("/onboarding/verification")
@require_auth
@require_role("OWNER", "ADMIN")
def owner_verification():
    data = request.json or {}
    required = ["gym_id", "business_tax_id", "license_doc_url", "id_doc_url", "proof_of_address_url"]
    missing = [f for f in required if not str(data.get(f, "")).strip()]
    if missing:
        return jsonify({"error": "required_fields_missing", "fields": missing}), 400
    gym = GYMS.get(str(data["gym_id"]))
    if not gym:
        return jsonify({"error": "gym_not_found"}), 404
    claims = getattr(request, "user", {})
    if not _can_access_gym(gym, claims):
        return jsonify({"error": "forbidden_gym_access"}), 403
    gym["verification"] = {
        "business_tax_id": data["business_tax_id"],
        "license_doc_url": data["license_doc_url"],
        "id_doc_url": data["id_doc_url"],
        "proof_of_address_url": data["proof_of_address_url"],
        "vat_number": data.get("vat_number"),
        "submitted_at": _now_iso(),
    }
    return jsonify({"submitted": True, "gym_id": data["gym_id"]})


@owner_bp.post("/onboarding/payment-setup")
@require_auth
@require_role("OWNER", "ADMIN")
def owner_payment_setup():
    data = request.json or {}
    gym_id = str(data.get("gym_id", "")).strip()
    provider_account_id = str(data.get("payment_provider_account_id", "")).strip()
    if not gym_id or not provider_account_id:
        return jsonify({"error": "required_fields_missing", "fields": ["gym_id", "payment_provider_account_id"]}), 400
    gym = GYMS.get(gym_id)
    if not gym:
        return jsonify({"error": "gym_not_found"}), 404
    claims = getattr(request, "user", {})
    if not _can_access_gym(gym, claims):
        return jsonify({"error": "forbidden_gym_access"}), 403
    gym["payout_setup"] = {"payment_provider_account_id": provider_account_id, "connected_at": _now_iso()}
    return jsonify({"connected": True, "gym_id": gym_id})


@owner_bp.get("/dashboard")
@require_auth
@require_role("OWNER", "ADMIN")
def owner_dashboard():
    claims = getattr(request, "user", {})
    business_id = claims.get("business_id")
    owner_gyms = [gym for gym in GYMS.values() if gym.get("business_id") == business_id]
    return jsonify(
        {
            "kpis": {"bookings": 0, "revenue": 0, "gyms_managed": len(owner_gyms)},
            "gym_ids": [gym["id"] for gym in owner_gyms],
        }
    )


@admin_bp.get("/dashboard")
@require_auth
@require_role("ADMIN")
def admin_dashboard():
    return jsonify(
        {
            "site_metrics": {
                "total_users": len(USERS),
                "total_gyms": len(GYMS),
                "pending_approvals": len([x for x in OWNER_APPLICATIONS.values() if x["status"] == "PENDING"]),
            }
        }
    )


@admin_bp.get("/approvals/pending")
@require_auth
@require_role("ADMIN")
def admin_pending_approvals():
    pending = [x for x in OWNER_APPLICATIONS.values() if x["status"] == "PENDING"]
    return jsonify({"items": pending})


@admin_bp.post("/approvals/<application_id>/decision")
@require_auth
@require_role("ADMIN")
def admin_approval_decision(application_id: str):
    data = request.json or {}
    decision = str(data.get("decision", "")).upper()
    if decision not in {"APPROVED", "REJECTED", "MORE_INFO_REQUIRED"}:
        return jsonify({"error": "invalid_decision"}), 400
    app_record = OWNER_APPLICATIONS.get(application_id)
    if not app_record:
        return jsonify({"error": "application_not_found"}), 404
    app_record["status"] = decision
    app_record["reviewed_at"] = _now_iso()
    app_record["review_note"] = str(data.get("note", "")).strip()
    gym = GYMS.get(app_record["gym_id"])
    if gym and decision == "APPROVED":
        gym["status"] = "APPROVED"
        gym["is_public"] = True
    if gym and decision in {"REJECTED", "MORE_INFO_REQUIRED"}:
        gym["status"] = decision
    return jsonify({"updated": True, "application": app_record, "gym": gym})


@admin_bp.post("/roles/assign")
@require_auth
@require_role("ADMIN")
def admin_assign_roles():
    data = request.json or {}
    user_id = str(data.get("user_id", "")).strip()
    role = str(data.get("role", "")).strip().upper()
    if not user_id or role not in {"ADMIN", "OWNER", "TRAINER", "MEMBER"}:
        return jsonify({"error": "invalid_payload"}), 400
    ROLE_ASSIGNMENTS.setdefault(user_id, set()).add(role)
    return jsonify({"assigned": True, "user_id": user_id, "roles": sorted(ROLE_ASSIGNMENTS[user_id])})


@admin_bp.get("/users")
@require_auth
@require_role("ADMIN")
def admin_users():
    return jsonify(
        {
            "items": [
                {**u, "roles": sorted(ROLE_ASSIGNMENTS.get(user_id, set()))}
                for user_id, u in USERS.items()
            ]
        }
    )


@admin_bp.get("/gyms")
@require_auth
@require_role("ADMIN")
def admin_gyms():
    return jsonify({"items": list(GYMS.values())})


@admin_bp.get("/financial-reports")
@require_auth
@require_role("ADMIN")
def admin_financial_reports():
    return jsonify({"summary": {"gross_revenue": 0, "payouts_completed": 0, "active_subscriptions": 0}})


@admin_bp.get("/subscriptions/plans")
@require_auth
@require_role("ADMIN")
def admin_subscription_plans():
    return jsonify({"plans": DEMO_PLANS})
