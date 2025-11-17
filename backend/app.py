import os
from flask import Flask
from flask_cors import CORS
from routes.test import test_bp
from routes.impact_funds import impact_funds_bp
from routes.donation_items import donation_items_bp
from routes.translate import translate_bp

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}}, supports_credentials=True)

# Register blueprints
app.register_blueprint(test_bp)
app.register_blueprint(impact_funds_bp)
app.register_blueprint(donation_items_bp)
app.register_blueprint(translate_bp)

print(app.url_map)

if __name__ == '__main__':
    app.run()

