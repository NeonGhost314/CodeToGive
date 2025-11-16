# app/services/chapter_service.py

from app.extensions import db
from app.models.chapter import Chapter

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
