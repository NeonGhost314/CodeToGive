# Models Directory

## Purpose

This directory contains all database models using SQLAlchemy ORM.

## Structure

- Each file represents a database table or related tables
- Models define the structure and relationships of your data
- Use Flask-SQLAlchemy for database operations

## Usage

- Create one model class per database table
- Define relationships between models
- Import models in routes or services when needed

## Example

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
```

