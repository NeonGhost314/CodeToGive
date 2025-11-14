# Backend Directory

## Purpose

Flask REST API backend for the application.

## Structure

- `app.py` - Main application entry point
- `routes/` - API route definitions organized by feature
- `models/` - Database models using SQLAlchemy
- `services/` - Business logic layer
- `config/` - Configuration files and settings
- `requirements.txt` - Python dependencies
- `.flaskenv` - Environment variables (not in git)

## Quick Start

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
flask run
```

## Adding New Features

1. Create route file in `routes/` directory
2. Create blueprint and define endpoints
3. Register blueprint in `app.py`
4. Add business logic in `services/` if needed
5. Create models in `models/` if database is needed

## Development Guidelines

- Keep routes thin, move logic to services
- Use blueprints to organize routes
- Follow RESTful API conventions
- Use environment variables for configuration

