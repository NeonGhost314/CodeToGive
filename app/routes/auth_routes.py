from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.post("/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = AuthService.authenticate(email, password)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # le client garde user_id et le renvoie dans chaque requête
    return jsonify({"message": "Login successful", "user_id": user.id})


@auth_bp.post("/logout")
def logout():
    return jsonify({"message": "Logged out"})

