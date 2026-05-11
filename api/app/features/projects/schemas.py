from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    created_at: datetime


class CreateProject(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(max_length=250)


class UpdateProject(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(max_length=250)
