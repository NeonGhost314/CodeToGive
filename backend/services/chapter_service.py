# app/services/chapter_service.py

from ..extensions import db
from ..models.chapter import Chapter

class ChapterService:

    @staticmethod
    def create_chapter(data):
        chapter = Chapter(
            story_id=data["story_id"],
            state=data.get("state", True)
        )
        db.session.add(chapter)
        db.session.commit()
        return chapter

    @staticmethod
    def get_chapter_by_id(chapter_id):
        return db.session.get(Chapter, chapter_id)

    @staticmethod
    def get_chapters_for_story(story_id):
        return Chapter.query.filter_by(story_id=story_id).all()
