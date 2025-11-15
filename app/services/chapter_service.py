from ..models import db
from ..models.chapter import Chapter

class ChapterService:
    @staticmethod
    def get_chapters_for_story(story_id):
        return Chapter.query.filter_by(story_id=story_id).all()

    @staticmethod
    def unlock_chapter(chapter_id):
        chapter = Chapter.query.get(chapter_id)
        if not chapter:
            return None
        chapter.state = True
        db.session.commit()
        return chapter
