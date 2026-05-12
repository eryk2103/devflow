from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.core.db import get_db
from .schemas import RegisterUser, Token
from .service import create_access_token, login_user, register_user
from ..users.schemas import UserCreate

auth_router = APIRouter()


@auth_router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                db: Annotated[Session, Depends(get_db)]) -> Token:
    user = login_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return create_access_token(user)


@auth_router.post("/register", status_code=204)
def register(user_register: RegisterUser, db: Annotated[Session, Depends(get_db)]):
    register_user(session=db, user_register=user_register)
