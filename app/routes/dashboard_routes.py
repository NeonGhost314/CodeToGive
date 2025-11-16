# routes/dashboard_routes.py

from flask import Blueprint, jsonify
from ..services.dashboard_service import DashboardService

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

@dashboard_bp.route("/<int:user_id>", methods=["GET"])
def get_dashboard(user_id):
    """Retourne les infos du tableau de bord pour un utilisateur."""
    data = DashboardService.get_user_dashboard(user_id)
    if data is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "id": data["user"].id,
            "mail": data["user"].mail,
            "first_name": data["user"].first_name,
            "last_name": data["user"].last_name
        },
        "followed_stories": [
            {
                "id": s.id,
                "title": s.title,
                "description": s.description
            }
            for s in data["followed_stories"]
        ],
        "total_donations": data["total_donations"],
        "recent_donations": [
            {
                "id": d.id,
                "amount": d.amount,
                "date": str(d.donation_date),
                "donation_pot_id": d.donation_pot_id,
                "state": d.state
            }
            for d in data["recent_donations"]
        ]
    })
