from flask import Flask
from flask_cors import CORS
from .extensions import db

def create_app(test_config=None):
    app = Flask(__name__)

    # Configure CORS to allow requests from Angular app
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

    if test_config:
        app.config.update(test_config)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://..."
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        app.config["SECRET_KEY"] = "dev-secret"

    db.init_app(app)

    # charger les modèles
    from . import models

    # charger les routes
    from .routes import register_routes
    register_routes(app)

    return app
