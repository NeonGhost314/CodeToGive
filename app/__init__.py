from flask import Flask
from .extensions import db

def create_app(test_config=None):
    app = Flask(__name__)

    # Config par défaut (production/dev)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://..."
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # En mode test -> remplace la config avant db.init_app
    if test_config is not None:
        app.config.update(test_config)

    db.init_app(app)

    from .routes import register_routes
    register_routes(app)

    return app
