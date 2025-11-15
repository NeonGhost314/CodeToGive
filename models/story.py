from . import db

class Story(db.Model):
    __tablename__ = "story"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    chapters = db.relationship("Chapter", backref="story", cascade="all, delete")
    donation_pot = db.relationship("DonationPot", backref="story", uselist=False, cascade="all, delete")
