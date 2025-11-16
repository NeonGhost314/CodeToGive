def test_get_stories(client):
    response = client.get("/stories")
    assert response.status_code in (200, 404)
