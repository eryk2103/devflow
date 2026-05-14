import hashlib
import secrets
from datetime import datetime, timezone, timedelta

import jwt
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.features.auth.exceptions import InvalidRefreshTokenException, RefreshTokenExpiredException
from app.features.auth.models import RefreshToken
from app.features.auth.schemas import Token, RegisterUser, TokenList
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


def hash_refresh_token(refresh_token: str) -> str:
    return hashlib.sha256(refresh_token.encode()).hexdigest()


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


def get_refresh_token(session: Session, refresh_token: str) -> RefreshToken:
    hashed_refresh_token = hash_refresh_token(refresh_token)
    stmt = select(RefreshToken).where(
        RefreshToken.hashed_token == hashed_refresh_token,
        RefreshToken.revoked.is_(False),
    )
    token_db = session.scalar(stmt)

    if not token_db:
        raise InvalidRefreshTokenException()

    if token_db.expires_at < datetime.now(timezone.utc):
        token_db.revoked = True
        session.commit()
        raise RefreshTokenExpiredException()

    return token_db


def create_refresh_token(session: Session, user: User) -> str:
    token_str = secrets.token_urlsafe(64)

    hashed_token_str = hash_refresh_token(token_str)
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.refresh_token_ttl)

    refresh_token = RefreshToken(hashed_token=hashed_token_str, user_id=user.id, expires_at=expires_at)
    session.add(refresh_token)
    session.commit()

    return token_str


def refresh_access_token(session: Session, refresh_token: str) -> TokenList:
    refresh_token_db = get_refresh_token(session, refresh_token)
    user = refresh_token_db.user

    refresh_token_db.revoked = True
    session.flush()
    new_refresh_token = create_refresh_token(session, refresh_token_db.user)

    access_token = create_access_token(user)
    return TokenList(access_token=access_token, refresh_token=new_refresh_token)
