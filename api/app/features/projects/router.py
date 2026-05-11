from typing import Annotated

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.features.users.models import User
from .models import Project
from .schemas import ProjectResponse, CreateProject, UpdateProject
from app.core.dependencies import get_current_user

projects_router = APIRouter()

@projects_router.get("", response_model=list[ProjectResponse])
def get_projects(user: Annotated[User, Depends(get_current_user)]):
    return user.projects

@projects_router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@projects_router.post("", status_code=201, response_model=ProjectResponse)
def create_project(project: CreateProject, db: Annotated[Session, Depends(get_db)], user: Annotated[User, Depends(get_current_user)]):
    new_project = Project(name=project.name, description=project.description, user_id=user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return ProjectResponse(id=new_project.id, name=new_project.name, description=new_project.description, created_at=new_project.created_at)

@projects_router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project: UpdateProject, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project_db = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project_db:
        raise HTTPException(status_code=404, detail="Project not found")

    project_db.name = project.name
    project_db.description = project.description
    db.commit()
    db.refresh(project_db)
    return project_db

@projects_router.patch("/{project_id}", response_model=ProjectResponse)
def partial_update_project(project_id: int, project: UpdateProject, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project_db = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project_db:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project_db, key, value)

    db.commit()
    db.refresh(project_db)

    return project_db

@projects_router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)