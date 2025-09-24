from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class ScrapedJob(BaseModel):
    __tablename__ = "scraped_jobs"

    source_id = Column(Integer, ForeignKey("job_sources.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)

    external_id = Column(String(255))
    external_url = Column(String(500))

    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    salary_range = Column(String(100))

    raw_data = Column(JSON)
    is_processed = Column(Boolean, default=False)
    is_duplicate = Column(Boolean, default=False)
    duplicate_of_job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    confidence_score = Column(Integer, default=100)
    has_description = Column(Boolean, default=True)
    has_salary = Column(Boolean, default=False)
    has_location = Column(Boolean, default=True)
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    source = relationship("JobSource", back_populates="scraped_jobs")
    job = relationship("Job", foreign_keys=[job_id])
    duplicate_of = relationship("Job", foreign_keys=[duplicate_of_job_id])

    def __repr__(self):
        return f"<ScrapedJob(id={self.id}, title='{self.title}', source_id={self.source_id})>"