from ..models import db
from ..models.story import Story

class StoryService:
    @staticmethod
    def create_story(data):
        story = Story(
            title=data["title"],
            description=data.get("description")
        )
        db.session.add(story)
        db.session.commit()
        return story

    @staticmethod
    def get_story(story_id):
        return db.session.get(Story, story_id)

    @staticmethod
    def get_all():
        return db.session.query(Story).all()
