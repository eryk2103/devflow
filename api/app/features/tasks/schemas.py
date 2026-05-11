from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.features.tasks.models import TaskStatus, TaskType, TaskPriority


class TaskBase(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=3, max_length=1000)
    status: TaskStatus
    type: TaskType
    priority: TaskPriority


class TaskCreate(TaskBase):
    project_id: int = Field(gt=0)


class TaskUpdate(TaskBase):
    pass


class TaskPatch(TaskBase):
    name: Optional[str] = Field(default=None, min_length=3, max_length=100)
    description: Optional[str] = Field(default=None, min_length=3, max_length=1000)
    status: Optional[TaskStatus] = None
    type: Optional[TaskType] = None
    priority: Optional[TaskPriority] = None


class TaskResponse(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
