from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.core.config import settings
from app.core.db import get_db
from app.features.users.models import User
from .schemas import RegisterUser, Token
from .service import verify_password, create_access_token, hash_password

auth_router = APIRouter()


@auth_router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                db: Annotated[Session, Depends(get_db)]) -> Token:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        verify_password(form_data.password, "DUMMY_HASH")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(seconds=settings.access_token_ttl)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@auth_router.post("/register", status_code=204)
def register_user(user: RegisterUser, db: Annotated[Session, Depends(get_db)]):
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
