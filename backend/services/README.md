# Services Directory

## Purpose

This directory contains business logic and service layer code.

## Structure

- Services contain reusable business logic
- Services are called by routes to perform operations
- Services interact with models and external APIs

## Usage

- Keep routes thin, move logic to services
- Services handle data validation, processing, and external API calls
- Services can be reused across multiple routes

## Example

```python
class UserService:
    @staticmethod
    def create_user(username, email):
        # Business logic here
        # Validate data
        # Create user in database
        # Return result
        pass
```

