from flask import session
from app.models.user import User

def current_user():
    uid = session.get("user_id")
    if not uid:
        return None
    return User.query.get(uid)
