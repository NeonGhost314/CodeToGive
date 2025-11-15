from app.services.user_service import UserService

def test_create_user(session):
    user = UserService.create_user(session, {
        "mail": "test@example.com",
        "first_name": "John",
        "last_name": "Doe"
    })

    assert user.id is not None
    assert user.mail == "test@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"

def test_get_user(session):
    user = UserService.create_user(session, {
        "mail": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    })

    fetched = UserService.get_user_by_id(session, user.id)
    assert fetched.id == user.id
