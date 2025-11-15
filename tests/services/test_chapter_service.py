from app.services.chapter_service import ChapterService
from app.services.story_service import StoryService
from app.services.user_service import UserService

def test_create_chapter(client, app):
    user = UserService.create_user({
        "mail": "u@u.com",
        "first_name": "U",
        "last_name": "L"
    })

    story = StoryService.create_story({
        "title": "S",
        "description": "D",
        "author_id": user.id
    })

    chapter = ChapterService.create_chapter({
        "story_id": story.id,
        "state": True
    })

    assert chapter.id is not None
    assert chapter.story_id == story.id


def test_get_chapter(client, app):
    user = UserService.create_user({
        "mail": "u2@u.com",
        "first_name": "U2",
        "last_name": "L2"
    })

    story = StoryService.create_story({
        "title": "S2",
        "description": "D2",
        "author_id": user.id
    })

    chapter = ChapterService.create_chapter({
        "story_id": story.id,
        "state": True
    })

    fetched = ChapterService.get_chapter_by_id(chapter.id)
    assert fetched.id == chapter.id
