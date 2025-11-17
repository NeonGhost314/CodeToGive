from backend.extensions import db
from datetime import datetime, timezone, date

class GlobalGoal(db.Model):
    __tablename__ = "global_goal"

    id = db.Column(db.Integer, primary_key=True)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, nullable=False, default=0.0)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "progress_percentage": (self.current_amount / self.target_amount * 100) if self.target_amount > 0 else 0
        }
