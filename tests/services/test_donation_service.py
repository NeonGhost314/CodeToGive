from app.services.donation_service import DonationService
from app.services.user_service import UserService

def test_create_donation(session):
    user = UserService.create_user(session, {"username": "d", "email": "d@d.com"})

    donation = DonationService.create_donation(session, {
        "user_id": user.id,
        "amount": 50
    })

    assert donation.id is not None
    assert donation.amount == 50

def test_get_donation(session):
    user = UserService.create_user(session, {"username": "x", "email": "x@x.com"})
    donation = DonationService.create_donation(session, {"user_id": user.id, "amount": 10})

    fetched = DonationService.get_donation_by_id(session, donation.id)
    assert fetched.id == donation.id
