
from fastapi import FastAPI

from app.core.db import engine, Base
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

