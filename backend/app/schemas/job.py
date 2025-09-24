from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.job import JobStatus

class JobBase(BaseModel):
    title: str
    company: str
    description: str
    location: Optional[str] = None
    salary_range: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    status: Optional[JobStatus] = None

class JobResponse(JobBase):
    id: int
    status: JobStatus
    posted_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobSummary(BaseModel):
    id: int
    title: str
    company: str
    location: Optional[str]
    salary_range: Optional[str]
    posted_date: datetime

    class Config:
        from_attributes = True