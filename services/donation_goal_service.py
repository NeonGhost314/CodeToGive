from models import db
from models.donation_goal import DonationGoal

class DonationGoalService:
    @staticmethod
    def set_goal(user_id, deadline, amount):
        goal = DonationGoal(
            user_id=user_id,
            deadline=deadline,
            amount=amount
        )
        db.session.add(goal)
        db.session.commit()
        return goal

    @staticmethod
    def get_goal(user_id):
        return DonationGoal.query.filter_by(user_id=user_id).first()
