from flask import Blueprint, request, jsonify
from ..services.user_service import UserService

user_bp = Blueprint("user", __name__, url_prefix="/users")

@user_bp.post("/")
def create_user():
    data = request.json
    user = UserService.create_user(
        mail=data["mail"],
        first_name=data["first_name"],
        last_name=data["last_name"]
    )
    return jsonify({"id": user.id}), 201

@user_bp.get("/<int:user_id>")
def get_user(user_id):
    user = UserService.get_user(user_id)
    if not user:
        return jsonify({"error": "not found"}), 404
    return jsonify({
        "id": user.id,
        "mail": user.mail,
        "first_name": user.first_name,
        "last_name": user.last_name
    })
