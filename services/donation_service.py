from models import db
from models.donation import Donation

class DonationService:
    @staticmethod
    def create_donation(user_id, pot_id, amount, date, state):
        donation = Donation(
            user_id=user_id,
            donation_pot_id=pot_id,
            amount=amount,
            donation_date=date,
            state=state
        )
        db.session.add(donation)
        db.session.commit()
        return donation

    @staticmethod
    def get_donations_for_user(user_id):
        return Donation.query.filter_by(user_id=user_id).all()
