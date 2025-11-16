from backend.services.user_service import UserService

def test_create_user(client, app):
    user = UserService.create_user({
        "mail": "test@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password_hash": "1234"
    })

    assert user.id is not None
    assert user.mail == "test@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"

def test_get_user(client, app):
    user = UserService.create_user({
        "mail": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password_hash": "1234"
    })

    fetched = UserService.get_user(user.id)
    assert fetched.id == user.id
