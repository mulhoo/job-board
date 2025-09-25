from sqlalchemy import Column, DateTime, Integer, Boolean, String, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from sqlalchemy.sql import func
import enum

class JobStatus(str, enum.Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class CompanySize(str, enum.Enum):
    SIZE_1_10 = "1-10"
    SIZE_11_50 = "11-50"
    SIZE_51_200 = "51-200"
    SIZE_201_1000 = "201-1000"
    SIZE_1000_PLUS = "1000+"

class ExperienceLevel(str, enum.Enum):
    ENTRY_LEVEL = "entry_level"
    ASSOCIATE = "associate"
    MID_LEVEL = "mid_level"
    SENIOR = "senior"
    LEAD = "lead"
    PRINCIPAL = "principal"
    EXECUTIVE = "executive"

class Job(BaseModel):
    __tablename__ = "jobs"

    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(255))
    salary_range = Column(String(100))
    application_url = Column(String(500), nullable=False)

    # New fields
    company_size = Column(
        SAEnum(
            CompanySize,
            name="company_size",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=True
    )

    experience_level = Column(
        SAEnum(
            ExperienceLevel,
            name="experience_level",
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=True
    )

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
    posted_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    posted_by = relationship("User", back_populates="jobs_posted")

    source_id = Column(Integer, ForeignKey("job_sources.id"), nullable=True)
    external_id = Column(String(255), nullable=True)
    external_url = Column(String(500), nullable=True)
    is_scraped = Column(Boolean, default=False)

    source = relationship("JobSource", back_populates="jobs")
    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
        passive_deletes=False,
    )

    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company}')>"

    @property
    def company_size_display(self):
        """Return human-readable company size"""
        return self.company_size.value if self.company_size else None

    @property
    def experience_level_display(self):
        """Return human-readable experience level"""
        level_map = {
            ExperienceLevel.ENTRY_LEVEL: "Entry Level",
            ExperienceLevel.ASSOCIATE: "Associate",
            ExperienceLevel.MID_LEVEL: "Mid-Level",
            ExperienceLevel.SENIOR: "Senior",
            ExperienceLevel.LEAD: "Lead",
            ExperienceLevel.PRINCIPAL: "Principal",
            ExperienceLevel.EXECUTIVE: "Executive"
        }
        return level_map.get(self.experience_level) if self.experience_level else None