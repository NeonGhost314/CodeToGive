def test_story_model(client, app):
    from app.extensions import db
    from app.models.user import User
    from app.models.story import Story

    user = User(mail="a@b.com", first_name="A", last_name="B")
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
