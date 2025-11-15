from . import db

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    mail = db.Column(db.String(255), unique=True, nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)

    donations = db.relationship("Donation", backref="user", cascade="all, delete")
    donation_goal = db.relationship("DonationGoal", backref="user", uselist=False, cascade="all, delete")
