from flask import Flask
from .extensions import db

def create_app(test_config=None):
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://..."
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    if test_config is not None:
        app.config.update(test_config)

    db.init_app(app)

    # IMPORTANT : importer tous les modèles ici
    # Cela force SQLAlchemy à connaître toutes les tables
    from . import models

    from .routes import register_routes
    register_routes(app)

    return app
