# services/dashboard_service.py

from ..models.user import User
from ..models.story import Story
from ..models.donation import Donation
from ..models.donation_pot import DonationPot
from ..models import db

class DashboardService:
    """Service pour rassembler les données du tableau de bord d'un utilisateur."""

    @staticmethod
    def get_user_dashboard(user_id):
        """Retourne toutes les infos du dashboard pour un utilisateur."""

        user = User.query.get(user_id)
        if not user:
            return None

        followed_stories = DashboardService.get_followed_stories(user_id)
        total_donations = DashboardService.get_total_donations(user_id)
        recent_donations = DashboardService.get_recent_donations(user_id)

        return {
            "user": user,
            "followed_stories": followed_stories,
            "total_donations": total_donations,
            "recent_donations": recent_donations
        }

    @staticmethod
    def get_followed_stories(user_id):
        """
        Stories suivies = stories pour lesquelles l'utilisateur a déjà donné.
        """
        return (
            Story.query
            .join(DonationPot, DonationPot.story_id == Story.id)
            .join(Donation, Donation.donation_pot_id == DonationPot.id)
            .filter(Donation.user_id == user_id)
            .distinct()
            .all()
        )

    @staticmethod
    def get_total_donations(user_id):
        """Somme totale des dons de l'utilisateur."""
        total = (
            db.session.query(db.func.sum(Donation.amount))
            .filter(Donation.user_id == user_id)
            .scalar()
        )
        return total or 0

    @staticmethod
    def get_recent_donations(user_id, limit=10):
        """Derniers dons effectués par l'utilisateur."""
        return (
            Donation.query
            .filter(Donation.user_id == user_id)
            .order_by(Donation.created_at.desc())
            .limit(limit)
            .all()
        )
