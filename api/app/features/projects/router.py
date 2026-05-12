from typing import Annotated

from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.features.users.models import User
from .schemas import ProjectResponse, ProjectCreate, ProjectUpdate, ProjectPartial
from app.core.dependencies import get_current_user
from . import services as project_service

projects_router = APIRouter()

@projects_router.get("", response_model=list[ProjectResponse])
def get_projects(user: Annotated[User, Depends(get_current_user)]):
    return user.projects

@projects_router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    return project_service.get_user_project(db, user.id, project_id)

@projects_router.post("", status_code=201, response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Annotated[Session, Depends(get_db)], user: Annotated[User, Depends(get_current_user)]):
    return project_service.create_project(session=db, project=project, user_id=user.id)

@projects_router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: ProjectUpdate, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    return project_service.update_project(session=db, project_id=project_id, project=project, user_id=user.id)

@projects_router.patch("/{project_id}", response_model=ProjectResponse)
def partial_update_project(project_id: int, project: ProjectPartial, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    return project_service.partial_update_project(session=db, project_id=project_id, project=project, user_id=user.id)

@projects_router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project_service.delete_project(session=db, project_id=project_id, user_id=user.id)