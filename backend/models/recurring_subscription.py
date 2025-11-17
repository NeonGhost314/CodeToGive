from backend.extensions import db
from datetime import datetime, timezone, date

class RecurringSubscription(db.Model):
    __tablename__ = "recurring_subscriptions"

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(
        db.Integer,
        db.ForeignKey("transactions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    frequency = db.Column(db.String(50), nullable=False)  # 'monthly', 'weekly', 'yearly'
    next_payment_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_id": self.transaction_id,
            "frequency": self.frequency,
            "next_payment_date": self.next_payment_date.isoformat() if self.next_payment_date else None,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
