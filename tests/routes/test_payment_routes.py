def test_get_payments(client):
    response = client.get("/payments")
    assert response.status_code in (200, 404)
