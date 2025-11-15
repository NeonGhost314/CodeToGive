# dashboard_service.py

from models import db, Don, UserHistoire, UserDefi

class DashboardService:
    @staticmethod
    def get_dashboard(user_id):
        # Total des dons
        total_dons = db.session.query(db.func.sum(Don.montant)) \
            .filter(Don.user_id == user_id).scalar() or 0

        # Historique des dons
        dons = Don.query.filter_by(user_id=user_id).order_by(Don.date.desc()).all()

        # Histoires suivies
        histoires = UserHistoire.query.filter_by(user_id=user_id).all()

        # Défis et progression
        defis = UserDefi.query.filter_by(user_id=user_id).all()

        return {
            "total_dons": total_dons,
            "dons": [d.to_dict() for d in dons],
            "histoires": [h.to_dict() for h in histoires],
            "defis": [d.to_dict() for d in defis],
        }
