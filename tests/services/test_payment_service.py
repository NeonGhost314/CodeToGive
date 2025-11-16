from datetime import date
from backend.services.payment_service import PaymentService
from backend.services.user_service import UserService
from backend.services.donation_service import DonationService
from backend.services.donation_pot_service import DonationPotService
from backend.services.story_service import StoryService

def test_create_payment(client, app):
    user = UserService.create_user({
        "mail": "p@example.com",
        "first_name": "Peter",
        "last_name": "Parker",  
        "password_hash": "1234"
    })

    # Crée une story valide pour story_id
    story = StoryService.create_story({
        "title": "Story1",
        "description": "Desc1",
        "author_id": user.id
    })

    donation_pot = DonationPotService.create_donation_pot({
        "story_id": story.id,
        "name": "Pot1",
        "donation_goal": 100   # ajouté
    })

    donation = DonationService.create_donation({
        "user_id": user.id,
        "donation_pot_id": donation_pot.id,
        "amount": 20,
        "donation_date": date.today(),
        "state": "pending"
    })

    payment = PaymentService.create_payment({
        "user_id": user.id,
        "donation_id": donation.id,
        "card_type": "Visa",
        "card_number": "4242424242424242",
        "expiration_date": "2030-01-01",
        "cvv": "123"
    })

    assert payment.user_id == user.id
    assert payment.donation_id == donation.id


def test_get_payment(client, app):
    user = UserService.create_user({
        "mail": "p2@example.com",
        "first_name": "Mary",
        "last_name": "Jane",
        "password_hash": "1234"
    })

    story = StoryService.create_story({
        "title": "Story2",
        "description": "Desc2",
        "author_id": user.id
    })

    donation_pot = DonationPotService.create_donation_pot({
        "story_id": story.id,
        "name": "Pot2",
        "donation_goal": 200   # ajouté
    })

    donation = DonationService.create_donation({
        "user_id": user.id,
        "donation_pot_id": donation_pot.id,
        "amount": 33,
        "donation_date": date.today(),
        "state": "pending"
    })

    PaymentService.create_payment({
        "user_id": user.id,
        "donation_id": donation.id,
        "card_type": "MC",
        "card_number": "5555555555554444",
        "expiration_date": "2031-02-01",
        "cvv": "999"
    })

    fetched = PaymentService.get_payment(user.id, donation.id)
    assert fetched is not None
