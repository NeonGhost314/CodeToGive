from backend.extensions import db
from datetime import datetime, timezone

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    fund_id = db.Column(
        db.Integer,
        db.ForeignKey("funds.id", ondelete="CASCADE"),
        nullable=False
    )
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    transaction_type = db.Column(db.String(50), nullable=False)  # 'one_time' or 'recurring'
    status = db.Column(db.String(50), nullable=False)  # 'pending', 'completed', 'failed', 'cancelled'
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    recurring_subscription = db.relationship("RecurringSubscription", backref="transaction", lazy=True, uselist=False, cascade="all, delete-orphan")
    payment = db.relationship("Payment", backref="transaction", lazy=True, uselist=False, cascade="all, delete-orphan")
    video_accesses = db.relationship("UserVideoAccess", backref="transaction", lazy=True)
    user_achievements = db.relationship("UserAchievement", backref="transaction", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "fund_id": self.fund_id,
            "amount": self.amount,
            "transaction_date": self.transaction_date.isoformat() if self.transaction_date else None,
            "transaction_type": self.transaction_type,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
