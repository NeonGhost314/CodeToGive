from ..models import db
from ..models.user import User

class UserService:
    @staticmethod
    def create_user(data):
        user = User(
            mail=data.get("mail"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            password_hash=data.get("password_hash")
        )
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_user(user_id):
        return db.session.get(User, user_id)

    @staticmethod
    def get_user_by_email(mail):
        return db.session.query(User).filter_by(mail=mail).first()

    @staticmethod
    def update_user(user_id, **fields):
        user = db.session.get(User, user_id)
        if not user:
            return None
        for key, value in fields.items():
            setattr(user, key, value)
        db.session.commit()
        return user

    @staticmethod
    def delete_user(user_id):
        user = db.session.get(User, user_id)
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
