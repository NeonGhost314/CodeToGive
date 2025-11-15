from app.services.chapter_service import ChapterService
from app.services.story_service import StoryService
from app.services.user_service import UserService

def test_create_chapter(session):
    user = UserService.create_user(session, {"username": "u", "email": "u@u.com"})
    story = StoryService.create_story(session, {"title": "S", "author_id": user.id})

    chapter = ChapterService.create_chapter(session, {
        "story_id": story.id,
        "title": "Chap",
        "content": "Hello"
    })

    assert chapter.id is not None
    assert chapter.story_id == story.id

def test_get_chapter(session):
    user = UserService.create_user(session, {"username": "u2", "email": "u2@u.com"})
    story = StoryService.create_story(session, {"title": "S2", "author_id": user.id})
    chapter = ChapterService.create_chapter(session, {"story_id": story.id, "title": "A", "content": "B"})

    fetched = ChapterService.get_chapter_by_id(session, chapter.id)
    assert fetched.id == chapter.id
