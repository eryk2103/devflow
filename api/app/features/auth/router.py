from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.core.db import get_db
from .exceptions import InvalidRefreshTokenException, RefreshTokenExpiredException
from .schemas import RegisterUser, Token, RefreshTokenCookies
from .service import create_access_token, login_user, register_user, refresh_access_token, create_refresh_token

auth_router = APIRouter()


@auth_router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                db: Annotated[Session, Depends(get_db)], response: Response) -> Token:
    user = login_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    refresh_token = create_refresh_token(db, user)
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, samesite="lax", secure=False)
    return create_access_token(user)


@auth_router.post("/register", status_code=204)
def register(user_register: RegisterUser, db: Annotated[Session, Depends(get_db)]):
    register_user(session=db, user_register=user_register)


@auth_router.post("/refresh", status_code=200)
def refresh(response: Response, cookies: Annotated[RefreshTokenCookies, Cookie()],
            db: Annotated[Session, Depends(get_db)]) -> Token:
    try:
        new_tokens = refresh_access_token(db, refresh_token=cookies.refresh_token)
    except InvalidRefreshTokenException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    except RefreshTokenExpiredException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    response.set_cookie(key="refresh_token", value=new_tokens.refresh_token, httponly=True, samesite="lax", secure=False)
    return new_tokens.access_token


@auth_router.post("/logout", status_code=204)
def logout(response: Response):
    response.delete_cookie(key="refresh_token")
