def test_chapter_model(client, app):
    from backend.extensions import db
    from backend.models.story import Story
    from backend.models.chapter import Chapter
    from backend.models.user import User

    # Create required author
    user = User(mail="u@u.com", first_name="A", last_name="B", password_hash = "1234")
    db.session.add(user)
    db.session.commit()

    story = Story(title="Test", description="X")
    db.session.add(story)
    db.session.commit()

    chap = Chapter(story_id=story.id, state=True)
    db.session.add(chap)
    db.session.commit()

    found = Chapter.query.first()
    assert found.story_id == story.id
    assert found.state is True
