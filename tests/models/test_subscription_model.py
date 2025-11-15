from app.extensions import db
from app.models.user import User
from app.models.story import Story
from app.models.donation_pot import DonationPot
from app.models.donation import Donation
from app.models.subscribe import Subscribe
from datetime import date

def test_subscription_model(client, app):

    author = User(mail="auth@x.com", first_name="Auth", last_name="Or")
    user = User(mail="u@x.com", last_name="L", first_name="F")
    db.session.add_all([author, user])
    db.session.commit()

    story = Story(title="S", description="D")
    db.session.add(story)
    db.session.commit()

    pot = DonationPot(story_id=story.id, name="Pot", donation_goal=100, global_amount=0)
    db.session.add(pot)
    db.session.commit()

    donation = Donation(
        user_id=user.id,
        donation_pot_id=pot.id,
        amount=30,
        donation_date=date.today(),
        state="confirmed"
    )
    db.session.add(donation)
    db.session.commit()

    sub = Subscribe(
        donation_id=donation.id,
        type="monthly",
        amount_per_period=10
    )
    db.session.add(sub)
    db.session.commit()

    found = Subscribe.query.first()
    assert found.type == "monthly"
    assert found.amount_per_period == 10
