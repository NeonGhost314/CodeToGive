# Config Directory

## Purpose

This directory contains configuration files and settings for the application.

## Structure

- Configuration classes for different environments (development, production, testing)
- Database connection settings
- API keys and secrets (use environment variables)

## Usage

- Define configuration classes
- Load configuration based on environment
- Keep sensitive data in environment variables, not in code

## Example

```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
```

