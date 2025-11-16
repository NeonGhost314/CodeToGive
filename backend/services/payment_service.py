from ..extensions import db
from ..models.payment import Payment

from datetime import datetime

class PaymentService:
    
    @staticmethod
    def create_payment(data):
        # convertit string -> date
        if isinstance(data["expiration_date"], str):
            data["expiration_date"] = datetime.strptime(
                data["expiration_date"], "%Y-%m-%d"
            ).date()

        payment = Payment(
            user_id=data["user_id"],
            donation_id=data["donation_id"],
            card_type=data["card_type"],
            card_number=data["card_number"],
            expiration_date=data["expiration_date"],
            cvv=data["cvv"]
        )

        db.session.add(payment)
        db.session.commit()
        return payment


    @staticmethod
    def get_payment(user_id, donation_id):
        payment = Payment.query.filter_by(
            user_id=user_id,
            donation_id=donation_id
        ).first()

        if not payment:
            return None

        return payment.to_dict()

    @staticmethod
    def delete_payment(user_id, donation_id):
        payment = Payment.query.filter_by(
            user_id=user_id,
            donation_id=donation_id
        ).first()

        if not payment:
            return False

        db.session.delete(payment)
        db.session.commit()
        return True
