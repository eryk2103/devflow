from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.features.projects import services as project_service
from .exceptions import TaskNotFoundException
from .models import Task
from .schemas import TaskCreate, TaskUpdate, TaskPatch

tasks_router = APIRouter()


def get_tasks(session: Session, project_id: int, user_id: int):
    project = project_service.get_user_project(session, user_id, project_id)
    tasks = session.query(Task).filter(Task.project_id == project.id).all()
    return tasks


def get_task_by_id(session: Session, task_id: int, user_id: int):
    task = session.query(Task).filter(Task.id == task_id).first()
    if not task or task.project.user_id != user_id:
        raise TaskNotFoundException()
    return task


def create_task(session: Session, task: TaskCreate, user_id: int):
    project = project_service.get_user_project(session, user_id, task.project_id)
    new_task = Task(name=task.name, description=task.description, status=task.status, project_id=project.id,
                    priority=task.priority, type=task.type)
    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return new_task


def update_task(session: Session, task_id: int, task: TaskUpdate, user_id: int):
    task_db = get_task_by_id(session, task_id, user_id)

    task_db.name = task.name
    task_db.description = task.description
    task_db.status = task.status
    task_db.priority = task.priority
    task_db.type = task.type

    session.commit()
    session.refresh(task_db)
    return task_db


def partial_update_task(session: Session, task_id: int, task: TaskPatch, user_id: int):
    task_db = get_task_by_id(session, task_id, user_id)
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(task_db, key, value)

    session.commit()
    session.refresh(task_db)
    return task_db


def delete_task(session: Session, task_id: int, user_id: int):
    task = get_task_by_id(session, task_id, user_id)

    session.delete(task)
    session.commit()
