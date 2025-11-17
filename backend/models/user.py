from backend.extensions import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    mail = db.Column(db.String(255), nullable=False, unique=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    transactions = db.relationship("Transaction", backref="user", lazy=True, cascade="all, delete-orphan")
    video_accesses = db.relationship("UserVideoAccess", backref="user", lazy=True, cascade="all, delete-orphan")
    achievements = db.relationship("UserAchievement", backref="user", lazy=True, cascade="all, delete-orphan")