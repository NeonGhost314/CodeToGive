from . import db

class Subscribe(db.Model):
    __tablename__ = "subscribe"

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(
        db.Integer,
        db.ForeignKey("donation.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    type = db.Column(db.String(50), nullable=False)
    amount_per_period = db.Column(db.Float, nullable=False)
