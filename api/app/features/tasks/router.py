from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.features.users.models import User
from app.core.dependencies import get_current_user
from .models import Task
from .schemas import TaskResponse, TaskCreate, TaskUpdate, TaskPatch
from app.features.projects.models import Project

tasks_router = APIRouter()


@tasks_router.get("", response_model=list[TaskResponse])
def get_tasks(project: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    project = db.query(Project).filter(Project.id == project, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project.tasks


@tasks_router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task or task.project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@tasks_router.post("", status_code=201, response_model=TaskResponse)
def create_task(task: TaskCreate, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
    project = db.query(Project).filter(Project.id == task.project_id, Project.user_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    new_task = Task(name=task.name, description=task.description, status=task.status, project_id=task.project_id,
                    priority=task.priority, type=task.type)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@tasks_router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
    task_db = db.query(Task).filter(Task.id == task_id).first()
    if not task_db or task_db.project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    task_db.name = task.name
    task_db.description = task.description
    task_db.status = task.status
    task_db.priority = task.priority
    task_db.type = task.type
    db.commit()
    db.refresh(task_db)
    return task_db


@tasks_router.patch("/{task_id}", response_model=TaskResponse)
def partial_update_task(task_id: int, task: TaskPatch, user: Annotated[User, Depends(get_current_user)],
                        db: Annotated[Session, Depends(get_db)]):
    task_db = db.query(Task).filter(Task.id == task_id).first()
    if not task_db or task_db.project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(task_db, key, value)

    db.commit()
    db.refresh(task_db)
    return task_db


@tasks_router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task or task.project.user_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
