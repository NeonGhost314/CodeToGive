from datetime import date
from app.services.donation_service import DonationService
from app.models.user import User
from app.models.story import Story
from app.models.donation_pot import DonationPot

def test_create_donation(session):
    # Create minimal user + story + pot
    user = User(mail="x@x.com", first_name="John", last_name="Doe")
    story = Story(title="Story", description="Desc")
    session.add_all([user, story])
    session.commit()

    pot = DonationPot(
        story_id=story.id,
        name="Pot",
        donation_goal=100,
        global_amount=0
    )
    session.add(pot)
    session.commit()

    donation = DonationService.create_donation(session, {
        "user_id": user.id,
        "donation_pot_id": pot.id,
        "amount": 50,
        "donation_date": date.today(),
        "state": "done"
    })

    assert donation.id is not None
    assert donation.amount == 50


def test_get_donation(session):
    from datetime import date
    from app.models.donation import Donation

    user = User(mail="a@a.com", first_name="A", last_name="A")
    story = Story(title="Test", description="D")
    session.add_all([user, story])
    session.commit()

    pot = DonationPot(
        story_id=story.id,
        name="P",
        donation_goal=10,
        global_amount=0
    )
    session.add(pot)
    session.commit()

    donation = Donation(
        user_id=user.id,
        donation_pot_id=pot.id,
        amount=10,
        donation_date=date.today(),
        state="done"
    )
    session.add(donation)
    session.commit()

    from app.services.donation_service import DonationService
    fetched = DonationService.get_donation_by_id(session, donation.id)

    assert fetched.id == donation.id
