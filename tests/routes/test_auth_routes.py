from werkzeug.security import generate_password_hash
from backend.extensions import db
from backend.models.user import User

def test_login_success(client, app):
    # User existant
    user = User(
        mail="route@test.com",
        first_name="John",
        last_name="Doe",
        password_hash=generate_password_hash("secret")
    )
    db.session.add(user)
    db.session.commit()

    payload = {
        "email": "route@test.com",
        "password": "secret"
    }

    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "Login successful"
    assert data["user_id"] == user.id


def test_login_invalid_credentials(client):
    payload = {
        "email": "doesnotexist@example.com",
        "password": "wrong"
    }

    response = client.post("/auth/login", json=payload)
    assert response.status_code == 401

    data = response.get_json()
    assert data["error"] == "Invalid credentials"


def test_logout(client):
    response = client.post("/auth/logout")
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "Logged out"
