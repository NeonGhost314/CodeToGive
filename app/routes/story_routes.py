from flask import Blueprint, jsonify
from ..services.story_service import StoryService

story_bp = Blueprint("story", __name__, url_prefix="/stories")

@story_bp.get("/")
def list_stories():
    stories = StoryService.get_all()
    return jsonify([
        {"id": s.id, "title": s.title, "description": s.description}
        for s in stories
    ])

@story_bp.get("/<int:story_id>")
def get_story(story_id):
    s = StoryService.get_story(story_id)
    if not s:
        return jsonify({"error": "not found"}), 404
    return jsonify({
        "id": s.id,
        "title": s.title,
        "description": s.description
    })
