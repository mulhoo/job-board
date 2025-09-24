from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class JobSource(BaseModel):
    __tablename__ = "job_sources"

    name = Column(String(100), nullable=False, unique=True)
    display_name = Column(String(100), nullable=False)
    base_url = Column(String(255), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    rate_limit_seconds = Column(Integer, default=1)
    max_jobs_per_scrape = Column(Integer, default=50)
    last_scraped_at = Column(DateTime(timezone=True))
    total_jobs_scraped = Column(Integer, default=0)
    last_error = Column(Text)

    scraped_jobs = relationship("ScrapedJob", back_populates="source")
    jobs = relationship("Job", back_populates="source")

    def __repr__(self):
        return f"<JobSource(id={self.id}, name='{self.name}')>"