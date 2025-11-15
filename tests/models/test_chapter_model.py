def test_chapter_model(client, app):
    from app.extensions import db
    from app.models.story import Story
    from app.models.chapter import Chapter

    story = Story(title="Test", description="X")
    db.session.add(story)
    db.session.commit()

    chap = Chapter(story_id=story.id, state=True)
    db.session.add(chap)
    db.session.commit()

    found = Chapter.query.first()
    assert found.story_id == story.id
    assert found.state is True
