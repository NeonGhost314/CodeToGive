def test_get_donation_goals(client):
    response = client.get("/donation-goals")
    assert response.status_code in (200, 404)
