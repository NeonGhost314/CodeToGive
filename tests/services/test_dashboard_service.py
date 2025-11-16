from app.services.dashboard_service import DashboardService
from app.services.user_service import UserService

def test_dashboard_summary(client, app):
    with app.app_context():
        user = UserService.create_user({
            "mail": "u@u.com",
            "first_name": "U",
            "last_name": "L",
            "password_hash": "1234"
        })

        summary = DashboardService.get_user_dashboard(user.id)

        assert summary["user"].id == user.id
        assert isinstance(summary["followed_stories"], list)
        assert summary["total_donations"] == 0
        assert isinstance(summary["recent_donations"], list)
