
from .user_routes import user_bp
from .story_routes import story_bp
from .chapter_routes import chapter_bp
from .donation_routes import donation_bp
from .donation_pot_routes import pot_bp
from .subscription_routes import sub_bp
from .donation_goal_routes import goal_bp
from .auth_routes import auth_bp
from .test_routes import test_bp
from .impact_funds_routes import impact_funds_bp

def register_routes(app):
    app.register_blueprint(user_bp)
    app.register_blueprint(story_bp)
    app.register_blueprint(chapter_bp)
    app.register_blueprint(donation_bp)
    app.register_blueprint(pot_bp)
    app.register_blueprint(sub_bp)
    app.register_blueprint(goal_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_bp)
    app.register_blueprint(impact_funds_bp)