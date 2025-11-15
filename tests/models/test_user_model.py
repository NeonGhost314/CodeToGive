def test_user_model(client, app):
    from app.extensions import db
    from app.models.user import User

    user = User(
        mail="test@example.com",
        last_name="Doe",
        first_name="John", 
        password_hash = "1234"
    )
    db.session.add(user)
    db.session.commit()

    found = User.query.first()
    assert found.mail == "test@example.com"
    assert found.last_name == "Doe"
    assert found.first_name == "John"
    assert found.password_hash == "1234"
