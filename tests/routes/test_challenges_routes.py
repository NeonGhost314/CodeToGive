def test_get_challenges(client):
    response = client.get("/challenges")
    assert response.status_code in (200, 404)
