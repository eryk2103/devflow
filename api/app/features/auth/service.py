from datetime import datetime, timezone, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.features.auth.schemas import Token, RegisterUser
from app.features.users.exceptions import UserNotFoundException
from app.features.users.models import User
from app.features.users.schemas import UserCreate
from app.features.users.services import get_user_by_email, create_user

password_hash = PasswordHash.recommended()
DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$yryS3/lbJHs0gH9aajUp6A$/GyQnHGkjE1641UW/F3Xs8UZQjUhSLYNuFJaWXvqPFg'


def verify_password(plain_password, hashed_password) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def hash_password(password) -> str:
    return password_hash.hash(password)


def create_access_token(user: User) -> Token:
    expire = datetime.now(timezone.utc) + timedelta(seconds=settings.access_token_ttl)
    data = ({"exp": expire, "sub": user.email})
    encoded_jwt = jwt.encode(data, settings.secret_key.get_secret_value(), algorithm=settings.algorithm)
    return Token(access_token=encoded_jwt, token_type="bearer")


def login_user(session, email: str, password: str) -> User | None:
    try:
        user = get_user_by_email(session, email)
    except UserNotFoundException:
        verify_password(password, DUMMY_HASH)
        return None

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


def register_user(session, user_register: RegisterUser):
    user = UserCreate(email=user_register.email, password=user_register.password)
    hashed_password = hash_password(user.password)
    create_user(session, UserCreate(email=user.email, password=hashed_password))
