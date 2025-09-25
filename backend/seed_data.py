from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Job, BaseModel
from app.models.user import User
from app.models.job_source import JobSource
from app.models.job import CompanySize, ExperienceLevel
from app.auth import get_password_hash

BaseModel.metadata.create_all(bind=engine)

def create_users():
    """Create admin and regular users"""
    db = SessionLocal()

    users_data = [
        {
            "first_name": "Admin",
            "last_name": "User",
            "email": "admin@jobboard.com",
            "password": "admin123",
            "is_admin": True
        },
        {
            "first_name": "Sarah",
            "last_name": "Johnson",
            "email": "sarah@techcorp.com",
            "password": "password123",
            "is_admin": False
        },
        {
            "first_name": "Mike",
            "last_name": "Chen",
            "email": "mike@startupxyz.com",
            "password": "password123",
            "is_admin": False
        }
    ]

    created_users = {}

    for user_data in users_data:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            user = User(
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                is_admin=user_data["is_admin"]
            )
            db.add(user)
            db.flush()  # Get the ID without committing
            created_users[user_data["email"]] = user.id
            print(f"Created user: {user_data['email']} / {user_data['password']}")
        else:
            created_users[user_data["email"]] = existing_user.id
            print(f"User already exists: {user_data['email']}")

    db.commit()
    db.close()
    return created_users

def create_sample_jobs(user_ids):
    """Create sample jobs with proper user assignments"""
    db = SessionLocal()

    sample_jobs = [
        {
            "title": "Senior Software Engineer",
            "company": "TechCorp Inc",
            "description": "We're looking for a senior software engineer to join our growing team. You'll work on scalable web applications using Python and React. Must have 5+ years of experience with modern web technologies.",
            "location": "San Francisco, CA",
            "salary_range": "$120,000 - $160,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["sarah@techcorp.com"],
            "company_size": CompanySize.SIZE_51_200,
            "experience_level": ExperienceLevel.SENIOR
        },
        {
            "title": "Product Marketing Manager",
            "company": "StartupXYZ",
            "description": "Lead our product marketing efforts and help bring innovative products to market. Experience with SaaS products preferred. You'll work cross-functionally with product, sales, and engineering teams.",
            "location": "New York, NY",
            "salary_range": "$90,000 - $120,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["mike@startupxyz.com"],
            "company_size": CompanySize.SIZE_11_50,
            "experience_level": ExperienceLevel.MID_LEVEL
        },
        {
            "title": "Data Scientist",
            "company": "DataFlow Analytics",
            "description": "Join our data science team to build predictive models and analyze complex datasets. Python, SQL, and machine learning experience required. PhD preferred but not required.",
            "location": "Seattle, WA",
            "salary_range": "$110,000 - $140,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["admin@jobboard.com"],
            "company_size": CompanySize.SIZE_201_1000,
            "experience_level": ExperienceLevel.MID_LEVEL
        },
        {
            "title": "UX Designer",
            "company": "Design Studio Pro",
            "description": "Create beautiful and intuitive user experiences for our clients. Figma, Sketch, and user research experience preferred. Portfolio review required.",
            "location": "Austin, TX",
            "salary_range": "$75,000 - $95,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["sarah@techcorp.com"],
            "company_size": CompanySize.SIZE_11_50,
            "experience_level": ExperienceLevel.MID_LEVEL
        },
        {
            "title": "DevOps Engineer",
            "company": "CloudFirst Solutions",
            "description": "Manage our cloud infrastructure and CI/CD pipelines. AWS, Docker, and Kubernetes experience required. On-call rotation required.",
            "location": "Remote",
            "salary_range": "$100,000 - $130,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["mike@startupxyz.com"],
            "company_size": CompanySize.SIZE_1000_PLUS,
            "experience_level": ExperienceLevel.SENIOR
        },
        {
            "title": "Sales Development Representative",
            "company": "SalesForce Pro",
            "description": "Generate leads and qualify prospects for our B2B software solutions. Great opportunity for career growth in sales. No prior experience required - we provide training.",
            "location": "Chicago, IL",
            "salary_range": "$50,000 - $70,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["admin@jobboard.com"],
            "company_size": CompanySize.SIZE_201_1000,
            "experience_level": ExperienceLevel.ENTRY_LEVEL
        },
        {
            "title": "Frontend Developer",
            "company": "WebTech Solutions",
            "description": "Build responsive web applications using React, TypeScript, and modern CSS. 2+ years of frontend development experience required.",
            "location": "Portland, OR",
            "salary_range": "$80,000 - $110,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["sarah@techcorp.com"],
            "company_size": CompanySize.SIZE_51_200,
            "experience_level": ExperienceLevel.ASSOCIATE
        },
        {
            "title": "Engineering Manager",
            "company": "TechGiant Corp",
            "description": "Lead a team of 8-12 engineers building scalable distributed systems. Strong technical background and people management experience required.",
            "location": "Palo Alto, CA",
            "salary_range": "$180,000 - $220,000",
            "application_url": "https://propelpeople.ai",
            "posted_by_id": user_ids["mike@startupxyz.com"],
            "company_size": CompanySize.SIZE_1000_PLUS,
            "experience_level": ExperienceLevel.LEAD
        }
    ]

    for job_data in sample_jobs:
        existing_job = db.query(Job).filter(
            Job.title == job_data["title"],
            Job.company == job_data["company"]
        ).first()

        if not existing_job:
            job = Job(**job_data)
            db.add(job)
            print(f"Created job: {job_data['title']} at {job_data['company']}")

    db.commit()
    db.close()
    print("Sample jobs created successfully!")

def create_job_sources():
    """Create job sources for scraping"""
    db = SessionLocal()

    sources = [
        {
            "name": "indeed",
            "display_name": "Indeed",
            "base_url": "https://www.indeed.com",
            "description": "World's #1 job site",
            "is_active": True,
            "rate_limit_seconds": 2,
            "max_jobs_per_scrape": 25
        },
        {
            "name": "linkedin",
            "display_name": "LinkedIn Jobs",
            "base_url": "https://www.linkedin.com/jobs",
            "description": "Professional networking job board",
            "is_active": True,
            "rate_limit_seconds": 3,
            "max_jobs_per_scrape": 20
        }
    ]

    for source_data in sources:
        existing = db.query(JobSource).filter(JobSource.name == source_data["name"]).first()
        if not existing:
            source = JobSource(**source_data)
            db.add(source)
            print(f"Created job source: {source_data['display_name']}")

    db.commit()
    db.close()
    print("Job sources created successfully!")

def clear_database():
    """Clear all existing data"""
    db = SessionLocal()

    # Delete in order to avoid foreign key constraints
    db.query(Job).delete()
    db.query(JobSource).delete()
    db.query(User).delete()

    db.commit()
    db.close()
    print("Database cleared!")

if __name__ == "__main__":
    print("Starting database setup...")

    # Clear existing data
    clear_database()

    # Create users first
    user_ids = create_users()

    # Create job sources
    create_job_sources()

    # Create jobs with proper user assignments
    create_sample_jobs(user_ids)

    print("\nDatabase setup complete!")
    print("\nLogin credentials:")
    print("Admin: admin@jobboard.com / admin123")
    print("User 1: sarah@techcorp.com / password123")
    print("User 2: mike@startupxyz.com / password123")