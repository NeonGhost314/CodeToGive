import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure CORS to allow requests from Angular app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

@app.route('/api/test')
def test_route():
    """Test route for Angular connection."""
    return jsonify({"message": "Flask to Angular connection successful!"})

if __name__ == '__main__':
    app.run()

