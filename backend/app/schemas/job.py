from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models.job import JobStatus, CompanySize, ExperienceLevel

class JobBase(BaseModel):
    title: str
    company: str
    description: str
    application_url: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    company_size: Optional[CompanySize] = None
    experience_level: Optional[ExperienceLevel] = None

class JobCreate(JobBase):
    status: Optional[JobStatus] = Field(default=JobStatus.ACTIVE, description="Job status - defaults to active")

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    application_url: Optional[str] = None
    company_size: Optional[CompanySize] = None
    experience_level: Optional[ExperienceLevel] = None
    status: Optional[JobStatus] = None

class JobResponse(JobBase):
    id: int
    status: JobStatus
    posted_date: datetime
    created_at: datetime
    updated_at: datetime
    posted_by_id: int

    class Config:
        from_attributes = True

class JobSummary(BaseModel):
    id: int
    title: str
    company: str
    application_url: str
    description: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    company_size: Optional[CompanySize] = None
    experience_level: Optional[ExperienceLevel] = None
    status: JobStatus
    posted_date: datetime

    class Config:
        from_attributes = True