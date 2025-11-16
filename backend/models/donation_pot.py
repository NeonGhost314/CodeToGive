from . import db

class DonationPot(db.Model):
    __tablename__ = "donation_pot"

    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(
        db.Integer,
        db.ForeignKey("story.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )
    name = db.Column(db.String(255), nullable=False)
    donation_goal = db.Column(db.Float, nullable=False)
    global_amount = db.Column(db.Float, nullable=False, default=0.0)

    story = db.relationship("Story", backref=db.backref("donation_pot", uselist=False))
