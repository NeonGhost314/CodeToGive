from models import db
from models.user import User

class UserService:
    @staticmethod
    def create_user(mail, first_name, last_name):
        user = User(mail=mail, first_name=first_name, last_name=last_name)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_user(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_email(mail):
        return User.query.filter_by(mail=mail).first()

    @staticmethod
    def update_user(user_id, **fields):
        user = User.query.get(user_id)
        if not user:
            return None
        for key, value in fields.items():
            setattr(user, key, value)
        db.session.commit()
        return user

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
