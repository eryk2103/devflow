
from fastapi import FastAPI

from app.core.db import engine, Base
from app.core.exception_handlers import not_found_exception_handler, conflict_exception_handler
from app.core.exceptions import NotFoundException, ConflictException
from app.features.auth.router import auth_router
from app.features.projects.router import projects_router
from app.features.tasks.router import tasks_router
from app.features.users.router import users_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(users_router, prefix="/api/users", tags=["users"])

app.add_exception_handler(NotFoundException, not_found_exception_handler)
app.add_exception_handler(ConflictException, conflict_exception_handler)