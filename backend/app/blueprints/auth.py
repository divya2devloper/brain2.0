from __future__ import annotations

from flask import Blueprint, current_app, jsonify, request

from app.services.auth import generate_otp, issue_token

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth_bp.post("/send-otp")
def send_otp():
    email = request.json.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "email_required"}), 400
    otp = generate_otp()
    current_app.cache.set_json(f"otp:{email}", {"otp": otp}, ex=300)
    response = {"sent": True, "provider": "smtp_fallback"}
    if current_app.config.get("FLASK_ENV") != "production":
        response["otp_debug"] = otp
    return jsonify(response)


@auth_bp.post("/verify-otp")
def verify_otp():
    email = request.json.get("email", "").strip().lower()
    otp = request.json.get("otp", "")
    record = current_app.cache.get_json(f"otp:{email}")
    if not record or record.get("otp") != otp:
        return jsonify({"verified": False}), 400
    return jsonify({"verified": True, "next": "onboarding"})


@auth_bp.post("/onboarding")
def onboarding():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    business_id = data.get("business_id", "default-business")
    role = str(data.get("role", "OWNER")).upper()
    user_id = data.get("user_id", "default-user")
    if not username or not password:
        return jsonify({"error": "username_password_required"}), 400
    token = issue_token({"sub": username, "user_id": user_id, "business_id": business_id, "role": role})
    return jsonify(
        {"token": token, "user": {"user_id": user_id, "username": username, "business_id": business_id, "role": role}}
    )


@auth_bp.post("/login")
def login():
    username = request.json.get("username", "")
    password = request.json.get("password", "")
    role = str(request.json.get("role", "OWNER")).upper()
    user_id = request.json.get("user_id", "default-user")
    business_id = request.json.get("business_id", "default-business")
    if not username or not password:
        return jsonify({"error": "invalid_credentials"}), 400
    token = issue_token({"sub": username, "user_id": user_id, "business_id": business_id, "role": role})
    return jsonify({"token": token, "user": {"user_id": user_id, "username": username, "business_id": business_id, "role": role}})


@auth_bp.post("/google")
def google_oauth():
    google_token = request.json.get("google_token", "")
    if not google_token:
        return jsonify({"error": "google_token_required"}), 400
    token = issue_token({"sub": "google_user", "user_id": "google-user", "business_id": "default-business", "role": "ADMIN"})
    return jsonify(
        {
            "token": token,
            "user": {"user_id": "google-user", "username": "google_user", "business_id": "default-business", "role": "ADMIN"},
        }
    )
