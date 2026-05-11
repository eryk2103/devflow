from datetime import UTC, datetime

from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from app.core.db import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(250), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    user: Mapped["User"] = relationship(back_populates="projects")
    tasks: Mapped[list["Task"]] = relationship(back_populates="project")