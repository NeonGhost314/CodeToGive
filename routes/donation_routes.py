from flask import Blueprint, request, jsonify
from datetime import date
from services.donation_service import DonationService

donation_bp = Blueprint("donation", __name__, url_prefix="/donations")

@donation_bp.post("/")
def create_donation():
    data = request.json
    d = DonationService.create_donation(
        user_id=data["user_id"],
        pot_id=data["pot_id"],
        amount=data["amount"],
        date=date.today(),
        state=data["state"]
    )
    return jsonify({"id": d.id}), 201

@donation_bp.get("/user/<int:user_id>")
def list_user_donations(user_id):
    donations = DonationService.get_donations_for_user(user_id)
    return jsonify([
        {"id": d.id, "amount": d.amount, "state": d.state}
        for d in donations
    ])
