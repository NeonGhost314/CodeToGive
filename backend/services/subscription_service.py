from ..models import db
from ..models.subscribe import Subscribe

class SubscriptionService:
    @staticmethod
    def create_subscription(donation_id, sub_type, amount_per_period):
        sub = Subscribe(
            donation_id=donation_id,
            type=sub_type,
            amount_per_period=amount_per_period
        )
        db.session.add(sub)
        db.session.commit()
        return sub
