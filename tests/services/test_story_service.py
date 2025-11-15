from app.services.story_service import StoryService

def test_create_story(session):
    story = StoryService.create_story(session, {
        "title": "My Story",
        "description": "Something"
    })

    assert story.id is not None
    assert story.title == "My Story"
    assert story.description == "Something"

def test_get_story(session):
    story = StoryService.create_story(session, {
        "title": "X",
        "description": "Y"
    })

    fetched = StoryService.get_story_by_id(session, story.id)

    assert fetched.id == story.id
    assert fetched.title == "X"
