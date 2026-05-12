from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.features.users.models import User
from app.core.dependencies import get_current_user
from .schemas import TaskResponse, TaskCreate, TaskUpdate, TaskPatch
from . import services as task_service

tasks_router = APIRouter()


@tasks_router.get("", response_model=list[TaskResponse])
def get_tasks(project: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    return task_service.get_tasks(db, project, user.id)


@tasks_router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    return task_service.get_task_by_id(db, task_id, user.id)


@tasks_router.post("", status_code=201, response_model=TaskResponse)
def create_task(task: TaskCreate, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
   return task_service.create_task(db, task, user.id)


@tasks_router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
    return task_service.update_task(db, task_id, task, user.id)


@tasks_router.patch("/{task_id}", response_model=TaskResponse)
def partial_update_task(task_id: int, task: TaskPatch, user: Annotated[User, Depends(get_current_user)],
                        db: Annotated[Session, Depends(get_db)]):
    return task_service.partial_update_task(db, task_id, task, user.id)


@tasks_router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, user: Annotated[User, Depends(get_current_user)],
                db: Annotated[Session, Depends(get_db)]):
    task_service.delete_task(db, task_id, user.id)
