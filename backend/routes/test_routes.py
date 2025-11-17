from flask import Blueprint, jsonify
__test__ = False

# Create a blueprint for test routes
test_bp = Blueprint("test", __name__, url_prefix="/api")

@test_bp.get("/test")
def health_check():
    """Test route for Angular connection."""
    return jsonify({"message": "Flask to Angular connection successful!"})

