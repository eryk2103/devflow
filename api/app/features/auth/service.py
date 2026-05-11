from datetime import datetime, timezone, timedelta

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

password_hash = PasswordHash.recommended()


def verify_password(plain_password, hashed_password) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def hash_password(password) -> str:
    return password_hash.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key.get_secret_value(), algorithm=settings.algorithm)
    return encoded_jwt
