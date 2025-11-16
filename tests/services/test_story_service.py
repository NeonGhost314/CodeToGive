from backend.services.story_service import StoryService

def test_create_story(client, app):
    story = StoryService.create_story({
        "title": "My Story",
        "description": "Something",
        "author_id": 1
    })

    assert story.id is not None
    assert story.title == "My Story"
    assert story.description == "Something"

def test_get_story(client, app):
    story = StoryService.create_story({
        "title": "X",
        "description": "Y",
        "author_id": 1
    })

    fetched = StoryService.get_story(story.id)

    assert fetched.id == story.id
    assert fetched.title == "X"
