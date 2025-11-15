from app.services.dashboard_service import DashboardService

def test_dashboard_summary(session):
    summary = DashboardService.get_summary(session)
    assert isinstance(summary, dict)
