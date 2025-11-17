from backend.extensions import db
from datetime import datetime, timezone

class UserAchievement(db.Model):
    __tablename__ = "user_achievements"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    achievement_id = db.Column(
        db.Integer,
        db.ForeignKey("achievements.id", ondelete="CASCADE"),
        nullable=False
    )
    unlocked_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    unlocked_by_transaction_id = db.Column(
        db.Integer,
        db.ForeignKey("transactions.id", ondelete="SET NULL"),
        nullable=True
    )

    # Unique constraint: un utilisateur ne peut avoir qu'un seul achievement de chaque type
    __table_args__ = (db.UniqueConstraint('user_id', 'achievement_id', name='unique_user_achievement'),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "achievement_id": self.achievement_id,
            "unlocked_at": self.unlocked_at.isoformat() if self.unlocked_at else None,
            "unlocked_by_transaction_id": self.unlocked_by_transaction_id
        }
