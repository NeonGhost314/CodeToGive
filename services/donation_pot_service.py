from models import db
from models.donation_pot import DonationPot

class DonationPotService:
    @staticmethod
    def get_pot(pot_id):
        return DonationPot.query.get(pot_id)

    @staticmethod
    def list_pots():
        return DonationPot.query.all()

    @staticmethod
    def update_global_amount(pot_id, amount):
        pot = DonationPot.query.get(pot_id)
        if not pot:
            return None
        pot.global_amount += amount
        db.session.commit()
        return pot
