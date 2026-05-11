from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.features.users.models import User
from app.features.users.schemas import UserResponse

users_router = APIRouter()

@users_router.get("/me", response_model=UserResponse)
def get_users(user: Annotated[User, Depends(get_current_user)]):
    return UserResponse(id=user.id, email=user.email)