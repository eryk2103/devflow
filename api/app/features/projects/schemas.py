from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    created_at: datetime


class ProjectCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(max_length=250)


class ProjectUpdate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str = Field(max_length=250)

class ProjectPartial(BaseModel):
    name: Optional[str] = Field(default=None, min_length=3, max_length=100)
    description: Optional[str] = Field(default=None, max_length=250)