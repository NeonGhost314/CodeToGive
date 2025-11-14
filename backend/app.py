import os
from flask import Flask
from flask_cors import CORS
from routes.test import test_bp

app = Flask(__name__)

# Configure CORS to allow requests from Angular app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

# Register blueprints
app.register_blueprint(test_bp)

if __name__ == '__main__':
    app.run()

