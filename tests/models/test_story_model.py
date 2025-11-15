def test_story_model(client, app):
    from app.extensions import db
    from app.models.story import Story

    story = Story(title="Test Story", description="Desc")
    db.session.add(story)
    db.session.commit()

    found = Story.query.first()
    assert found.title == "Test Story"
    assert found.description == "Desc"
