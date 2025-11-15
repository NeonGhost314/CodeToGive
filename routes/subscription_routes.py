from flask import Blueprint, request, jsonify
from services.subscription_service import SubscriptionService

sub_bp = Blueprint("subscription", __name__, url_prefix="/subscriptions")

@sub_bp.post("/")
def create_subscription():
    data = request.json
    sub = SubscriptionService.create_subscription(
        donation_id=data["donation_id"],
        sub_type=data["type"],
        amount_per_period=data["amount_per_period"]
    )
    return jsonify({"id": sub.id}), 201
