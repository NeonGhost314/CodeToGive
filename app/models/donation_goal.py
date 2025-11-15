from . import db

class DonationGoal(db.Model):
    __tablename__ = "donation_goal"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )
    deadline = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
