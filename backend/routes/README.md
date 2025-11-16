# Routes Directory

## Purpose

This directory contains all API route definitions organized by domain or feature.

## Structure

- Each file represents a set of related routes
- Example: `auth.py` for authentication routes, `users.py` for user management routes
- All routes are registered in `app.py` using Flask blueprints

## Usage

- Create a new file for each feature domain
- Use Flask blueprints to organize routes
- Import and register blueprints in `app.py`

## Example

```python
from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    return jsonify({"message": "Login endpoint"})
```

