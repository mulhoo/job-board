# PropelEmployment Job Board

A full-stack job board application built with React and FastAPI, featuring admin job management, search/filtering, and a complete job lifecycle from draft to published to closed.

For photos of the application, see the app_photos folder. 

## 🚀 Live Demo

- **Frontend**: http://localhost:3000 (after setup)
- **API Documentation**: http://localhost:8000/docs
- **Admin Login**: admin@jobboard.com / admin123

## ✨ Features

### For Job Seekers
- Browse and search active job listings with real-time filtering
- Advanced filters: keywords, location, salary range, experience level, company size
- Direct external application links
- Clean, responsive Material-UI interface

### For Administrators
- Complete job lifecycle management (Draft → Active → Closed → Archive)
- Rich job creation and editing interface with draft system
- Status-based filtering and bulk operations
- Role-based access control with JWT authentication

## 🛠 Tech Stack

| **Frontend** | **Backend** |
|--------------|-------------|
| React 18 | FastAPI |
| Material-UI | SQLAlchemy ORM |
| React Hot Toast | PostgreSQL |
| CSS3 | JWT Authentication |
| | Alembic Migrations |

## 📋 Prerequisites

- **Python**: 3.13+
- **Node.js**: 18.18.2+
- **PostgreSQL**: Running instance
- **Package Manager**: Poetry (recommended) or pip

## ⚡ Quick Start

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd propel-takehome
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cat > .env << EOF
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/propel_db
SECRET_KEY=your-secret-key-here-change-for-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
```

### 3. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE propel_db;"

# Run migrations
alembic upgrade head

# Seed sample data
python3 seed_data.py
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Environment configuration
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
EOF
```

### 5. Launch Application
```bash
# Terminal 1 - Backend (make sure virtual environment is activated)
cd backend
source venv/bin/activate  # If not already activated
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔐 Login Credentials

| **Role** | **Email** | **Password** |
|----------|-----------|--------------|
| Admin | admin@jobboard.com | admin123 |
| User | sarah@techcorp.com | password123 |
| User | mike@startupxyz.com | password123 |

## 📡 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/refresh` - Token refresh

### Jobs
- `GET /jobs/` - List jobs (with filtering)
- `POST /jobs/` - Create job
- `GET /jobs/{job_id}` - Get job details
- `PUT /jobs/{job_id}` - Update job (owner only)
- `PATCH /jobs/{job_id}/status?status={status}` - Update job status
- `DELETE /jobs/{job_id}` - Delete job (Admin only)

### Admin Features
- `GET /admin/scraping/sources` - Available job sources
- `POST /admin/scraping/trigger/{source}` - Trigger scraping
- `GET /admin/scraping/preview/{source}` - Preview results
- `GET /admin/scraping/history` - Scraping history
- `GET /admin/scraping/stats` - Scraping statistics

## Development Notes
I want to be honest that I used Claude to help me through the initial backend setup, debugging, writing my base CSS sheets, and creating the basics of this README. I have never used FastAPI before, and other than much simpler projects have only used Python in projects where setup was already done and there were examples I could work off of. I had Claude create the basic models/schemas/routers files for users. I'm really quick at learning new stacks when there's at least one working example, so with limited time and having not used FastAPI before I had Claude create that working example I could then work and learn off of independently for the rest of the backend work that needed done. This is how I've been able to quickly adapt to new stacks in the past.

I also had Claude help me with the scraper functionality for Indeed. This works if you call the `GET /admin/scraping/preview/indeed` endpoint in curl, but to acutally scrape it (`POST /admin/scraping/trigger/{source}`) was blocked by Indeed and returned nothing. Rather than sink time into trying with another job posting board, I decided to leave this functionality and just mention here that it works. My original plan was to have a "Import Jobs" functionality that would show for an admin user, where they could select the source and run the job from the homepage.

I implemented extra frontend features because you mentioned you were more of a backend engineer, so I wanted to highlight my frontend skills for this take-home. Specifically, I wanted to make sure all the jobs endpoints had corresponding frontend functionality so they could be tested as if it was a real app. I'm very slow at CSS, so usually have Claude create a base sheet for me that I then adjust as needed. I went back and forth on whether or not to have the create and edit job modals be different pages instead, but landed on it being a modal for ease of use and immediate feedback. I also added Toasts for success messsages so that users have immediate feedback on whether or not their create/update/delete was successful.

The app was two different views: regular and admin. When in regular mode, a user can filter active jobs and then click buttons to see the job details page or apply immediately. In the search section, there is an arrow that expands the view to show additional filters.
If a user logs in and is an admin user, the page will automatically update to show admin functionality. Admins can create jobs, edit jobs, close jobs, etc. There are also 3 tabs so they can see jobs that are "drafts" or ones that are closed. Closed jobs that are reverted go to the "drafts" section, where they can then be published again from the edit module. Closed jobs can also be permanently deleted.

I chose a pink and orange color pallet since pink is my favorite color, and PropelPeople uses orange. Many of the buttons and accents are the same color orange PropelPeople uses. I didn't catch that the desired folder structure was /api for backend and /web for frontend until the very end, at which point updating them was going to cause changes in 267 files so I left it as is.

I had a lot of trouble with setup initially, so hopefully the setup instructions work for you.

The seed data should be enough to get you started with basic data and has the following login information that you can use in the app:
Login Credentials
`Admin: admin@jobboard.com / admin123
User 1: sarah@techcorp.com / password123
User 2: mike@startupxyz.com / password123`

Happy to talk more about how I approached this project and the trade-offs I made. Thanks for your consideration!

## Development Time Breakdown

**Total Time:** 14 hours
- Frontend implementation: 4 hours
- Backend development: 5 hours (learning FastAPI)
- Python dependencies & database setup: 3 hours
- General debugging: 1 hour
- README: 1 hour

**Note:** The actual development time significantly exceeded the suggested 2-4 hour estimate, primarily due to environment setup complexity and learning curve for FastAPI.

**Scope Expansion:** The requirements evolved during development to include enterprise-level features like draft workflows, status management, and role-based access control, which added substantial complexity beyond a basic CRUD application.

## Architecture Decisions

### Status Updates via Query Parameters
Job status updates use PATCH requests with status passed as query parameters:
```
PATCH /jobs/{id}/status?status=closed
```

This approach was chosen because:
- Simple enum values don't require complex request payloads
- RESTful and follows common API patterns for single-field updates
- Clear and readable in API documentation and logs
- FastAPI handles enum validation automatically in query params

### Authentication & Security
- JWT tokens with configurable expiration
- Admin-only operations properly protected
- Bearer token authentication
- Status values are not sensitive data, making query parameters acceptable

## Troubleshooting

### Dependencies
- Ensure PostgreSQL is running before database operations
- Change SECRET_KEY to a secure value for production

### Database Issues
- Verify PostgreSQL service is running
- Check database connection string in .env file
- Ensure propel_db database exists before running migrations

## Additional Features Explored

### Job Scraping Integration
Developed functionality to import job listings from Indeed, but blocked by:
- Anti-bot detection systems (Cloudflare, rate limiting)
- Terms of Service restrictions on automated access
- CAPTCHA requirements


**Production implementation:** Would use Indeed's official API or partner integrations rather than scraping.