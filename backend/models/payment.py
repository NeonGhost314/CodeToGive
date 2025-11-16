from ..extensions import db

class Payment(db.Model):
    __tablename__ = "payments"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey("donation.id", ondelete="CASCADE"), primary_key=True)

    card_type = db.Column(db.String(30), nullable=False)
    card_number = db.Column(db.String(20), nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    cvv = db.Column(db.String(4), nullable=False)

    # Optional relationships
    user = db.relationship("User", backref="payments", lazy=True)
    donation = db.relationship("Donation", backref="payment", lazy=True, uselist=False)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "donation_id": self.donation_id,
            "card_type": self.card_type,
            "card_number": self.card_number,
            "expiration_date": self.expiration_date.isoformat(),
            "cvv": self.cvv
        }
