from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
import enum

class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    INTERVIEWED = "interviewed"
    REJECTED = "rejected"
    ACCEPTED = "accepted"

class Application(BaseModel):
    __tablename__ = "applications"

    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    candidate_name = Column(String(255), nullable=False)
    candidate_email = Column(String(255), nullable=False)
    resume_url = Column(String(500))
    status = Column(
        SAEnum(
            ApplicationStatus,
            name="application_status",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
        server_default=ApplicationStatus.SUBMITTED.value,
    )
    applied_date = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("Job", back_populates="applications")
