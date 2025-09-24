from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from sqlalchemy.sql import func
import enum

class JobStatus(str, enum.Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class Job(BaseModel):
    __tablename__ = "jobs"

    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255))
    salary_range = Column(String(100))
    status = Column(
        SAEnum(
            JobStatus,
            name="job_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
        server_default=JobStatus.ACTIVE.value,
    )
    posted_date = Column(DateTime(timezone=True), server_default=func.now())
    posted_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    posted_by = relationship("User", back_populates="jobs_posted")

    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
        passive_deletes=False,
    )

    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>"
