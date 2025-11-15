from flask import Blueprint, jsonify
from models.donation_options import DonationOptions

donation_options_bp = Blueprint('donation_options', __name__, url_prefix='/api')

@donation_options_bp.route('/donation-options/<int:fund_id>', methods=['GET'])
def get_donation_options(fund_id):
    # TODO: Replace with database query : options = DonationOptions.query.filter_by(fund_id=fund_id).all()
    options = [
        {
            "id": 1,
            "fund_id": 1,
            "description": "Option 1",
            "suggested_amount": 100,
            "option_type": "Option",
        },
        {
            "id": 2,
            "fund_id": 1,
            "description": "Option 2",
            "suggested_amount": 200,
            "option_type": "Option",
        },
        {
            "id": 3,
            "fund_id": 2,
            "description": "Option 3",
            "suggested_amount": 300,
            "option_type": "Option",
        },
    ]
    return jsonify(options)