from werkzeug.security import check_password_hash
from backend.models.user import User

class AuthService:
    @staticmethod
    def authenticate(email, password):
        user = User.query.filter_by(mail=email).first()
        if not user:
            return None
        if not check_password_hash(user.password_hash, password):
            return None
        return user
