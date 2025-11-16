from backend.extensions import db
from backend.models.user import User
from backend.models.story import Story
from backend.models.donation_pot import DonationPot
from backend.models.donation import Donation
from backend.models.payment import Payment
from datetime import date

def test_payment_model(client, app):

    user = User(mail="u@x.com", last_name="L", first_name="F", password_hash = "1234")
    db.session.add(user)
    db.session.commit()

    story = Story(title="S", description="D")
    db.session.add(story)
    db.session.commit()

    pot = DonationPot(
        story_id=story.id,
        name="P",
        donation_goal=50,
        global_amount=0
    )
    db.session.add(pot)
    db.session.commit()

    donation = Donation(
        user_id=user.id,
        donation_pot_id=pot.id,
        amount=25,
        donation_date=date.today(),
        state="ok"
    )
    db.session.add(donation)
    db.session.commit()

    pay = Payment(
        user_id=user.id,
        donation_id=donation.id,
        card_type="visa",
        card_number="1234",
        expiration_date=date.today(),
        cvv="123"
    )
    db.session.add(pay)
    db.session.commit()

    found = Payment.query.first()
    assert found.card_type == "visa"
    assert found.user_id == user.id
