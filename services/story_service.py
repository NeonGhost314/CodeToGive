from models import db
from models.story import Story

class StoryService:
    @staticmethod
    def get_all():
        return Story.query.all()

    @staticmethod
    def get_story(story_id):
        return Story.query.get(story_id)
