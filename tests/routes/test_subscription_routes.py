def test_get_subscriptions(client):
    response = client.get("/subscriptions")
    assert response.status_code in (200, 404)
