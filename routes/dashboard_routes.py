from flask import Blueprint, jsonify
from services.dashboard_service import DashboardService

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/<int:user_id>", methods=["GET"])
def get_dashboard(user_id):
    data = DashboardService.get_dashboard(user_id)
    return jsonify(data), 200
