from . import db

class Donation(db.Model):
    __tablename__ = "donation"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    donation_pot_id = db.Column(
        db.Integer,
        db.ForeignKey("donation_pot.id", ondelete="CASCADE"),
        nullable=False
    )
    amount = db.Column(db.Float, nullable=False)
    donation_date = db.Column(db.Date, nullable=False)
    state = db.Column(db.String(50), nullable=False)
