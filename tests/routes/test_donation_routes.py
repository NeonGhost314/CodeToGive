def test_get_donations(client):
    response = client.get("/donations")
    assert response.status_code in (200, 404)
