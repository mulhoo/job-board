from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Job, BaseModel
from app.models.user import User
from app.auth import get_password_hash

BaseModel.metadata.create_all(bind=engine)

def create_sample_jobs():
    db = SessionLocal()

    sample_jobs = [
        {
            "title": "Senior Software Engineer",
            "company": "TechCorp Inc",
            "description": "We're looking for a senior software engineer to join our growing team. You'll work on scalable web applications using Python and React.",
            "location": "San Francisco, CA",
            "salary_range": "$120,000 - $160,000"
        },
        {
            "title": "Product Marketing Manager",
            "company": "StartupXYZ",
            "description": "Lead our product marketing efforts and help bring innovative products to market. Experience with SaaS products preferred.",
            "location": "New York, NY",
            "salary_range": "$90,000 - $120,000"
        },
        {
            "title": "Data Scientist",
            "company": "DataFlow Analytics",
            "description": "Join our data science team to build predictive models and analyze complex datasets. Python, SQL, and machine learning experience required.",
            "location": "Seattle, WA",
            "salary_range": "$110,000 - $140,000"
        },
        {
            "title": "UX Designer",
            "company": "Design Studio Pro",
            "description": "Create beautiful and intuitive user experiences for our clients. Figma, Sketch, and user research experience preferred.",
            "location": "Austin, TX",
            "salary_range": "$75,000 - $95,000"
        },
        {
            "title": "DevOps Engineer",
            "company": "CloudFirst Solutions",
            "description": "Manage our cloud infrastructure and CI/CD pipelines. AWS, Docker, and Kubernetes experience required.",
            "location": "Remote",
            "salary_range": "$100,000 - $130,000"
        },
        {
            "title": "Sales Development Representative",
            "company": "SalesForce Pro",
            "description": "Generate leads and qualify prospects for our B2B software solutions. Great opportunity for career growth in sales.",
            "location": "Chicago, IL",
            "salary_range": "$50,000 - $70,000"
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

    db.commit()
    db.close()
    print("Sample jobs created successfully!")

def create_admin_user():
    db = SessionLocal()

    admin = db.query(User).filter(User.email == "admin@jobboard.com").first()
    if not admin:
        admin_user = User(
            first_name="Admin",
            last_name="User",
            email="admin@jobboard.com",
            password_hash=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created: admin@jobboard.com / admin123")

    db.close()

if __name__ == "__main__":
    create_sample_jobs()
    create_admin_user()