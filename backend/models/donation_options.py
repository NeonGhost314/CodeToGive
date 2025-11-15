from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class DonationOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fund_id = db.Column(db.Integer, db.ForeignKey('impact_funds.id'), nullable=False)
    description = db.Column(db.String(120), unique=True, nullable=False)
    suggested_amount = db.Column(db.Float, nullable=True)
    option_type = db.Column(db.String(50), nullable=False) 