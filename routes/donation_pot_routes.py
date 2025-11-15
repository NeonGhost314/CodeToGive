from flask import Blueprint, jsonify
from services.donation_pot_service import DonationPotService

pot_bp = Blueprint("pots", __name__, url_prefix="/pots")

@pot_bp.get("/")
def list_pots():
    pots = DonationPotService.list_pots()
    return jsonify([
        {"id": p.id, "name": p.name, "goal": p.donation_goal, "global_amount": p.global_amount}
        for p in pots
    ])
