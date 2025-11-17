from ..extensions import db
from datetime import datetime, timezone

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(
        db.Integer,
        db.ForeignKey("transactions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    card_type = db.Column(db.String(30), nullable=False)
    card_number = db.Column(db.String(20), nullable=False)  # TODO: Should be hashed for security
    expiration_date = db.Column(db.Date, nullable=False)
    cvv = db.Column(db.String(4), nullable=False)  # TODO: Should be hashed for security
    payment_date = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_id": self.transaction_id,
            "card_type": self.card_type,
            "card_number": self.card_number,  # In production, this should not be exposed
            "expiration_date": self.expiration_date.isoformat() if self.expiration_date else None,
            "cvv": self.cvv,  # In production, this should not be exposed
            "payment_date": self.payment_date.isoformat() if self.payment_date else None
        }
