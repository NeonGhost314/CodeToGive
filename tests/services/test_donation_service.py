from datetime import date
from app.services.donation_service import DonationService
from app.services.user_service import UserService
from app.models.donation_pot import DonationPot
from app.models.story import Story
from app.extensions import db

def test_create_donation(client, app):
    with app.app_context():
        user = UserService.create_user({
            "mail": "d@d.com",
            "first_name": "D",
            "last_name": "X"
        })

        story = Story(title="S", description="D")
        db.session.add(story)
        db.session.commit()

        pot = DonationPot(story_id=story.id, name="Pot", donation_goal=100, global_amount=0)
        db.session.add(pot)
        db.session.commit()

        donation = DonationService.create_donation({
            "user_id": user.id,
            "donation_pot_id": pot.id,
            "amount": 50,
            "donation_date": date.today(),  # objet date
            "state": "confirmed"
        })

        assert donation.id is not None
        assert donation.amount == 50


def test_get_donation(client, app):
    with app.app_context():
        user = UserService.create_user({
            "mail": "x@x.com",
            "first_name": "X",
            "last_name": "Y"
        })

        story = Story(title="S2", description="D2")
        db.session.add(story)
        db.session.commit()

        pot = DonationPot(story_id=story.id, name="Pot2", donation_goal=100, global_amount=0)
        db.session.add(pot)
        db.session.commit()

        donation = DonationService.create_donation({
            "user_id": user.id,
            "donation_pot_id": pot.id,
            "amount": 10,
            "donation_date": date.today(),  # objet date
            "state": "confirmed"
        })

        fetched = DonationService.get_donation_by_id(donation.id)
        assert fetched.id == donation.id
