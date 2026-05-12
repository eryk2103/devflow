from sqlalchemy.exc import IntegrityError

from app.features.users.exceptions import UserNotFoundException, UserEmailConflictException
from app.features.users.models import User
from app.features.users.schemas import UserCreate


def get_user_by_email(session, email: str) -> User:
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise UserNotFoundException()
    return user

def create_user(session, user: UserCreate):
    new_user = User(email=user.email, hashed_password=user.password)
    session.add(new_user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise UserEmailConflictException()
    session.refresh(new_user)
    return new_user