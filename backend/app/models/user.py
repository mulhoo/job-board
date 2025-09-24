from sqlalchemy import Column,String, Boolean
from app.models.base import BaseModel
from sqlalchemy.orm import relationship

class User(BaseModel):
    __tablename__ = "users"

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    jobs_posted = relationship(
        "Job",
        back_populates="posted_by",
        cascade="all, delete-orphan",
        passive_deletes=False,
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
