from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Job, JobStatus, CompanySize, ExperienceLevel
from app.schemas import JobCreate, JobUpdate, JobResponse, JobSummary
from app.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new job posting"""
    # Create job with the current user as the poster
    job_data = job.dict()
    job_data["posted_by_id"] = current_user.id

    db_job = Job(**job_data)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobSummary])
@router.get("/", response_model=List[JobSummary])
def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    company: Optional[str] = None,
    company_size: Optional[CompanySize] = None,
    experience_level: Optional[ExperienceLevel] = None,
    db: Session = Depends(get_db)
):
    """List ACTIVE jobs only - public endpoint"""
    query = db.query(Job).filter(Job.status == JobStatus.ACTIVE)

    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if company:
        query = query.filter(Job.company.ilike(f"%{company}%"))
    if company_size:
        query = query.filter(Job.company_size == company_size)
    if experience_level:
        query = query.filter(Job.experience_level == experience_level)

    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get a specific job by ID"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_update: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a job posting (only by the user who posted it)"""
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Check if user owns this job or is admin
    if db_job.posted_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")

    # Update only provided fields
    for field, value in job_update.dict(exclude_unset=True).items():
        setattr(db_job, field, value)

    db.commit()
    db.refresh(db_job)
    return db_job

@router.patch("/{job_id}/status", response_model=JobResponse)
def update_job_status(
    job_id: int,
    status: JobStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update job status (publish draft, close job, etc.)"""
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Check if user owns this job or is admin
    if db_job.posted_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")

    db_job.status = status
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Soft delete a job (mark as closed) - Admin only"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Only administrators can close jobs")

    db_job = db.query(Job).filter(Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    db_job.status = JobStatus.CLOSED
    db.commit()
    return {"message": "Job closed successfully"}