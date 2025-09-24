from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.application import ApplicationStatus
from .job import JobSummary

class ApplicationBase(BaseModel):
    candidate_name: str
    candidate_email: str
    resume_url: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    job_id: int

class ApplicationUpdate(BaseModel):
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    resume_url: Optional[str] = None
    status: Optional[ApplicationStatus] = None

class ApplicationResponse(ApplicationBase):
    id: int
    job_id: int
    status: ApplicationStatus
    applied_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ApplicationWithJob(ApplicationResponse):
    job: JobSummary

    class Config:
        from_attributes = True