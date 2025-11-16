from flask import Blueprint, jsonify
from ..services.chapter_service import ChapterService

chapter_bp = Blueprint("chapter", __name__, url_prefix="/chapters")

@chapter_bp.get("/story/<int:story_id>")
def chapters_for_story(story_id):
    chapters = ChapterService.get_chapters_for_story(story_id)
    return jsonify([
        {"id": c.id, "state": c.state} for c in chapters
    ])
