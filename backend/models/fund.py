from backend.extensions import db
from datetime import datetime, timezone

class Fund(db.Model):
    __tablename__ = "funds"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    transactions = db.relationship("Transaction", backref="fund", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "total_amount": self.total_amount,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
