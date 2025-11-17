from backend.extensions import db
from datetime import datetime, timezone

class UserVideoAccess(db.Model):
    __tablename__ = "user_video_access"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    video_id = db.Column(
        db.Integer,
        db.ForeignKey("videos.id", ondelete="CASCADE"),
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

    # Unique constraint: un utilisateur ne peut avoir qu'un seul accès par vidéo
    __table_args__ = (db.UniqueConstraint('user_id', 'video_id', name='unique_user_video_access'),)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "video_id": self.video_id,
            "unlocked_at": self.unlocked_at.isoformat() if self.unlocked_at else None,
            "unlocked_by_transaction_id": self.unlocked_by_transaction_id
        }
