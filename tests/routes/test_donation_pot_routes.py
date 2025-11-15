def test_get_donation_pots(client):
    response = client.get("/donation-pots")
    assert response.status_code in (200, 404)
