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
            "description": "Financer 3 heures d'écoute (45$)",
            "suggested_amount": 100,
            "option_type": "Option",
            "statistics": {
                "donors_count": 89,
                "total_raised_for_this_option": 48900,
                "popularity_rank": 1
            }
        },
        {
            "id": 2,
            "fund_id": 1,
            "description": "Offrir 1 nuit de sécurité (75$)",
            "suggested_amount": 200,
            "option_type": "Option",
            "statistics": {
                "donors_count": 67,
                "total_raised_for_this_option": 13400,
                "popularity_rank": 3
            }
        },
        {
            "id": 3,
            "fund_id": 2,
            "description": "Payer 1 kit d'urgence (25$)",
            "suggested_amount": 300,
            "option_type": "Option",
            "statistics": {
                "donors_count": 145,
                "total_raised_for_this_option": 43500,
                "popularity_rank": 2
            }
        },
    ]
    return jsonify(options)