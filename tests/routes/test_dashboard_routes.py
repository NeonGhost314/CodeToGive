def test_dashboard(client):
    response = client.get("/dashboard")
    assert response.status_code in (200, 404)
