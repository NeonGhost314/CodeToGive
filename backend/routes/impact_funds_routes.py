from flask import Blueprint, jsonify

# Blueprint for Impact Funds related routes
impact_funds_bp = Blueprint("impact_funds", __name__, url_prefix="/api")


@impact_funds_bp.get("/impact-funds")
def get_impact_funds():
    """Return a list of available Impact Funds (stubbed for prototype)."""
    # NOTE: This is static data for the hackathon prototype. In a full build,
    # we'd fetch from the database using SQLAlchemy models.
    funds = [
        {
            "id": 1,
            "name": "Panier Urgence",
            "description": "Fournir une sécurité immédiate (kits d'arrivée, nuits en refuge).",
        },
        {
            "id": 2,
            "name": "Panier Réhabilitation",
            "description": "Soutenir la guérison à moyen terme (suivi psychologique, aide juridique).",
        },
        {
            "id": 3,
            "name": "Panier Avenir",
            "description": "Bâtir l'autonomie à long terme (formation professionnelle, aide au logement).",
        },
    ]

    return jsonify(funds)

