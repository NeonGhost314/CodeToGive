from werkzeug.security import generate_password_hash
from app.models import db
from app.models.user import User
from app.services.auth_service import AuthService

def test_authenticate_success(client, app):
    # User valide
    user = User(
        mail="valid@example.com",
        first_name="A",
        last_name="B",
        password_hash=generate_password_hash("secret")
    )
    db.session.add(user)
    db.session.commit()

    auth_user = AuthService.authenticate("valid@example.com", "secret")

    assert auth_user is not None
    assert auth_user.id == user.id


def test_authenticate_invalid_password(client, app):
    user = User(
        mail="pwd@example.com",
        first_name="A",
        last_name="B",
        password_hash=generate_password_hash("good")
    )
    db.session.add(user)
    db.session.commit()

    auth_user = AuthService.authenticate("pwd@example.com", "wrong")

    assert auth_user is None


def test_authenticate_unknown_user(client, app):
    auth_user = AuthService.authenticate("nope@example.com", "anything")
    assert auth_user is None


# --- Tests des routes /auth/login et /auth/logout ---

def test_login_success(client, app):
    user = User(
        mail="login@example.com",
        first_name="A",
        last_name="B",
        password_hash=generate_password_hash("pass123")
    )
    db.session.add(user)
    db.session.commit()

    payload = {
        "email": "login@example.com",
        "password": "pass123"
    }

    response = client.post("/auth/login", json=payload)
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "Login successful"
    assert data["user_id"] == user.id


def test_login_invalid_credentials(client):
    payload = {
        "email": "invalid@example.com",
        "password": "wrong"
    }

    response = client.post("/auth/login", json=payload)

    assert response.status_code == 401
    data = response.get_json()
    assert "error" in data


def test_logout(client):
    response = client.post("/auth/logout")
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "Logged out"
