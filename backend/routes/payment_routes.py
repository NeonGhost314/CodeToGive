from flask import Blueprint, request, jsonify
from ..services.payment_service import PaymentService

payment_bp = Blueprint("payments", __name__, url_prefix="/payments")

@payment_bp.post("/")
def create_payment():
    data = request.json
    result = PaymentService.create_payment(data)
    return jsonify(result), 201

@payment_bp.get("/<int:user_id>/<int:donation_id>")
def get_payment(user_id, donation_id):
    result = PaymentService.get_payment(user_id, donation_id)
    if not result:
        return jsonify({"error": "payment not found"}), 404
    return jsonify(result), 200

@payment_bp.delete("/<int:user_id>/<int:donation_id>")
def delete_payment(user_id, donation_id):
    ok = PaymentService.delete_payment(user_id, donation_id)
    if not ok:
        return jsonify({"error": "payment not found"}), 404
    return jsonify({"message": "deleted"}), 200
