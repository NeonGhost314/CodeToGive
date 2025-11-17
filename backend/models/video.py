from backend.extensions import db
from datetime import datetime, timezone

class Video(db.Model):
    __tablename__ = "videos"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    order = db.Column(db.Integer, nullable=False)  # Ordre de visionnement
    required_donation_amount = db.Column(db.Float, nullable=False)  # Montant minimum pour débloquer
    is_unlocked_by_default = db.Column(db.Boolean, nullable=False, default=False)  # Première vidéo gratuite
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user_accesses = db.relationship("UserVideoAccess", backref="video", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "video_url": self.video_url,
            "thumbnail_url": self.thumbnail_url,
            "order": self.order,
            "required_donation_amount": self.required_donation_amount,
            "is_unlocked_by_default": self.is_unlocked_by_default,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
