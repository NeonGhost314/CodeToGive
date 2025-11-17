from backend.extensions import db
from datetime import datetime, timezone

class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(100), nullable=False)  # Nom de l'icône
    requirement_type = db.Column(db.String(100), nullable=False)  # 'first_donation', 'donation_count', 'donation_amount', etc.
    requirement_value = db.Column(db.Float, nullable=False)  # Valeur requise (peut être un montant ou un nombre)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user_achievements = db.relationship("UserAchievement", backref="achievement", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon,
            "requirement_type": self.requirement_type,
            "requirement_value": self.requirement_value,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
