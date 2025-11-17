def test_story_model(client, app):
    from backend.extensions import db
    from backend.models.user import User
    from backend.models.story import Story

    user = User(mail="a@b.com", first_name="A", last_name="B", password_hash = "1234")
    db.session.add(user)
    db.session.commit()

    story = Story(
        title="Test Story",
        description="Desc",
    )
    db.session.add(story)
    db.session.commit()

    found = Story.query.first()
    assert found.title == "Test Story"
    assert found.description == "Desc"
