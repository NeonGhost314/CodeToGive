import os
from flask import Flask
from flask_cors import CORS
from routes.test import test_bp
from routes.impact_funds import impact_funds_bp
from routes.donation_options import donation_options_bp

app = Flask(__name__)

# Configure CORS to allow requests from Angular app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

# Register blueprints
app.register_blueprint(test_bp)
app.register_blueprint(impact_funds_bp)
app.register_blueprint(donation_options_bp)

if __name__ == '__main__':
    app.run()

