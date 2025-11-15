from app.services.payment_service import PaymentService
from app.services.user_service import UserService
from app.services.donation_service import DonationService

def test_create_payment(session):
    user = UserService.create_user(session, {"username": "p", "email": "p@p.com"})
    donation = DonationService.create_donation(session, {"user_id": user.id, "amount": 20})

    payment = PaymentService.create_payment(session, {
        "user_id": user.id,
        "donation_id": donation.id,
        "card_type": "Visa",
        "card_number": "4242424242424242",
        "expiration_date": "2030-01-01",
        "cvv": "123"
    })

    assert payment.user_id == user.id
    assert payment.donation_id == donation.id

def test_get_payment(session):
    user = UserService.create_user(session, {"username": "p2", "email": "p2@p.com"})
    donation = DonationService.create_donation(session, {"user_id": user.id, "amount": 33})

    PaymentService.create_payment(session, {
        "user_id": user.id,
        "donation_id": donation.id,
        "card_type": "MC",
        "card_number": "5555555555554444",
        "expiration_date": "2031-02-01",
        "cvv": "999"
    })

    fetched = PaymentService.get_payment(session, user.id, donation.id)
    assert fetched is not None
