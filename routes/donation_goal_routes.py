from flask import Blueprint, request, jsonify
from services.donation_goal_service import DonationGoalService

goal_bp = Blueprint("goal", __name__, url_prefix="/goals")

@goal_bp.post("/")
def set_goal():
    data = request.json
    g = DonationGoalService.set_goal(
        user_id=data["user_id"],
        deadline=data["deadline"],
        amount=data["amount"]
    )
    return jsonify({"id": g.id}), 201
