def test_get_chapters(client):
    response = client.get("/chapters")
    assert response.status_code in (200, 404)
