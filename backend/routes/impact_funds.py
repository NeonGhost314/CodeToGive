from flask import Blueprint, jsonify
from models.impact_funds import ImpactFunds

# Blueprint for Impact Funds related routes
impact_funds_bp = Blueprint('impact_funds', __name__, url_prefix='/api')


@impact_funds_bp.route('/impact-funds', methods=['GET'])
def get_impact_funds():
    """Return a list of available Impact Funds (stubbed for prototype)."""
    # NOTE: This is static data for the hackathon prototype. In a full build,
    # we'd fetch from the database using SQLAlchemy models.
    # TODO: Replace with database query : fundsImpactFunds.query.all()
    funds = [
        {
            "id": 1,
            "name": "Panier Urgence",
            "description": "Fournir une sécurité immédiate (kits d'arrivée, nuits en refuge).",
            "statistics": {
                "total_donors": 247,
                "total_amount_raised": 15680,
                "average_donation": 63.5,
                "recent_donations_count": 12  # Donations dans les 24h
            }
        },
        {
            "id": 2,
            "name": "Panier Réhabilitation",
            "description": "Soutenir la guérison à moyen terme (suivi psychologique, aide juridique).",
            "statistics": {
                "total_donors": 189,
                "total_amount_raised": 23450,
                "average_donation": 124.1,
                "recent_donations_count": 8
            }
        },
        {
            "id": 3,
            "name": "Panier Avenir",
            "description": "Bâtir l'autonomie à long terme (formation professionnelle, aide au logement).",
            "statistics": {
                "total_donors": 156,
                "total_amount_raised": 31200,
                "average_donation": 200.0,
                "recent_donations_count": 5
            }
        },
    ]

    return jsonify(funds)
