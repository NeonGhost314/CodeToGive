from ..models import db
from ..models.donation import Donation

class DonationService:

    @staticmethod
    def create_donation(data):
        donation = Donation(
            user_id=data["user_id"],
            donation_pot_id=data["donation_pot_id"],
            amount=data["amount"],
            donation_date=data["donation_date"],
            state=data["state"]
        )
        db.session.add(donation)
        db.session.commit()
        return donation

    @staticmethod
    def get_donations_for_user(user_id):
        return Donation.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_donation_by_id(donation_id):
        return db.session.get(Donation, donation_id)
