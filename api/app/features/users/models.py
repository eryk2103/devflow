from datetime import UTC, datetime

from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, relationship, mapped_column

from app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(250), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC),
                                                 nullable=False)

    projects: Mapped[list["Project"]] = relationship(back_populates="user")  # type: ignore
