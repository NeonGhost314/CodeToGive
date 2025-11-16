from flask import Blueprint, jsonify
from models.donation_items import DonationItems

donation_items_bp = Blueprint('donation_items', __name__, url_prefix='/api')

@donation_items_bp.route('/donation-items/<int:fund_id>', methods=['GET'])
def get_donation_items(fund_id):
    # TODO: Replace with database query : items = DonationItems.query.filter_by(fund_id=fund_id).all()
    # Mock data representing individual items with prices for each fund
    items = []
    
    # Emergency Package items (fund_id = 1)
    if fund_id == 1:
        items = [
            {
                "id": 1,
                "fund_id": 1,
                "description": "Hot meals for 2 full days",
                "suggested_amount": 15.0,
                "option_type": "Item",
            },
            {
                "id": 2,
                "fund_id": 1,
                "description": "Essential hygiene kits",
                "suggested_amount": 10.0,
                "option_type": "Item",
            },
            {
                "id": 3,
                "fund_id": 1,
                "description": "Emergency clothing",
                "suggested_amount": 20.0,
                "option_type": "Item",
            },
            {
                "id": 4,
                "fund_id": 1,
                "description": "24/7 crisis hotline access",
                "suggested_amount": 5.0,
                "option_type": "Item",
            },
            {
                "id": 5,
                "fund_id": 1,
                "description": "First aid kits",
                "suggested_amount": 12.0,
                "option_type": "Item",
            },
            {
                "id": 6,
                "fund_id": 1,
                "description": "2 hours of legal consultation",
                "suggested_amount": 30.0,
                "option_type": "Item",
            },
            {
                "id": 7,
                "fund_id": 1,
                "description": "Transport to safe shelter",
                "suggested_amount": 25.0,
                "option_type": "Item",
            },
            {
                "id": 8,
                "fund_id": 1,
                "description": "Information resources and rights",
                "suggested_amount": 3.0,
                "option_type": "Item",
            },
        ]
    # Support Package items (fund_id = 2)
    elif fund_id == 2:
        items = [
            {
                "id": 9,
                "fund_id": 2,
                "description": "5 hours of professional psychological support",
                "suggested_amount": 25.0,
                "option_type": "Item",
            },
            {
                "id": 10,
                "fund_id": 2,
                "description": "3 individual therapy sessions",
                "suggested_amount": 20.0,
                "option_type": "Item",
            },
            {
                "id": 11,
                "fund_id": 2,
                "description": "Peer support groups (2 months)",
                "suggested_amount": 15.0,
                "option_type": "Item",
            },
            {
                "id": 12,
                "fund_id": 2,
                "description": "Administrative process assistance",
                "suggested_amount": 10.0,
                "option_type": "Item",
            },
            {
                "id": 13,
                "fund_id": 2,
                "description": "Personalized follow-up (6 weeks)",
                "suggested_amount": 18.0,
                "option_type": "Item",
            },
            {
                "id": 14,
                "fund_id": 2,
                "description": "Skills development workshops",
                "suggested_amount": 12.0,
                "option_type": "Item",
            },
            {
                "id": 15,
                "fund_id": 2,
                "description": "Professional training",
                "suggested_amount": 30.0,
                "option_type": "Item",
            },
            {
                "id": 16,
                "fund_id": 2,
                "description": "Job search assistance",
                "suggested_amount": 8.0,
                "option_type": "Item",
            },
        ]
    # Accommodation Package items (fund_id = 3)
    elif fund_id == 3:
        items = [
            {
                "id": 17,
                "fund_id": 3,
                "description": "Full night in secure shelter (24/7)",
                "suggested_amount": 50.0,
                "option_type": "Item",
            },
            {
                "id": 18,
                "fund_id": 3,
                "description": "3 nutritious meals per day",
                "suggested_amount": 25.0,
                "option_type": "Item",
            },
            {
                "id": 19,
                "fund_id": 3,
                "description": "Hygiene products and complete clothing",
                "suggested_amount": 30.0,
                "option_type": "Item",
            },
            {
                "id": 20,
                "fund_id": 3,
                "description": "Private space for rest and recovery",
                "suggested_amount": 40.0,
                "option_type": "Item",
            },
            {
                "id": 21,
                "fund_id": 3,
                "description": "Safety planning",
                "suggested_amount": 15.0,
                "option_type": "Item",
            },
            {
                "id": 22,
                "fund_id": 3,
                "description": "Support finding permanent housing",
                "suggested_amount": 35.0,
                "option_type": "Item",
            },
            {
                "id": 23,
                "fund_id": 3,
                "description": "Specialist consultations (psychologist, lawyer)",
                "suggested_amount": 45.0,
                "option_type": "Item",
            },
            {
                "id": 24,
                "fund_id": 3,
                "description": "Workshops preparing for independent living",
                "suggested_amount": 20.0,
                "option_type": "Item",
            },
            {
                "id": 25,
                "fund_id": 3,
                "description": "Children's resources (activities, school, daycare)",
                "suggested_amount": 30.0,
                "option_type": "Item",
            },
            {
                "id": 26,
                "fund_id": 3,
                "description": "Post-shelter follow-up (3 months)",
                "suggested_amount": 60.0,
                "option_type": "Item",
            },
        ]
    
    return jsonify(items)

