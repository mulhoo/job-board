# Full-Stack Job Board Application

A modern job board platform built with React and FastAPI, featuring role-based access control, advanced search capabilities, and a complete job lifecycle management system.

## 🎯 Project Overview

This application demonstrates full-stack development skills with a focus on clean architecture, responsive design, and user experience. It includes both public job browsing and admin management functionality.

**Live Demo Screenshots:** See the `app_photos/` folder for UI examples

## ✨ Key Features

### For Job Seekers
- **Smart Search & Filtering**: Real-time search with keyword, location, salary, experience level, and company size filters
- **Detailed Job Views**: Comprehensive job descriptions with one-click applications
- **Responsive Design**: Optimized experience across desktop, tablet, and mobile devices
- **Clean Material-UI Interface**: Modern, accessible component library

### For Administrators
- **Complete Job Lifecycle**: Draft → Active → Closed → Archive workflow
- **Rich Job Management**: Create, edit, and delete job postings with validation
- **Status-Based Organization**: Separate views for active, draft, and closed positions
- **Bulk Operations**: Efficient management of multiple job listings
- **JWT Authentication**: Secure role-based access control

## 🛠 Tech Stack

### Frontend
- **React 18** with Hooks
- **Material-UI** for components
- **React Hot Toast** for notifications
- **React Router** for navigation
- **Custom CSS** for styling

### Backend
- **FastAPI** for high-performance API
- **SQLAlchemy ORM** with PostgreSQL
- **JWT Authentication** with role-based access
- **Alembic** for database migrations
- **Pydantic** for data validation

## 📋 Prerequisites

- Node.js 18.18.2+
- Python 3.13+
- PostgreSQL (running instance)
- pip or Poetry

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd job-board-app
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cat > .env << EOF
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/job_board_db
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=120
EOF
```

### 3. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE job_board_db;"

# Run migrations
alembic upgrade head

# Seed sample data
python3 seed_data.py
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Configure environment
cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
EOF
```

### 5. Launch Application
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

**Access the app:** http://localhost:3000

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@jobboard.com | admin123 |
| User | sarah@techcorp.com | password123 |
| User | mike@startupxyz.com | password123 |

## 📡 API Documentation

Once running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

**Authentication**
- `POST /users/login` - User authentication
- `POST /users/register` - New user registration
- `POST /users/refresh` - Token refresh

**Jobs**
- `GET /jobs/` - List jobs with filtering
- `POST /jobs/` - Create job (authenticated)
- `GET /jobs/{id}` - Job details
- `PUT /jobs/{id}` - Update job (owner/admin)
- `PATCH /jobs/{id}/status` - Update status
- `DELETE /jobs/{id}` - Delete job (admin only)

## 🎨 Architecture Decisions

### Component Organization
- Reusable modals for create/edit operations
- Centralized authentication context
- Separation of concerns (components, pages, styles)

### State Management
- React Context API for authentication
- Local component state for forms
- URL parameters for shareable job details

### API Design
- RESTful conventions with proper HTTP methods
- Query parameters for filtering (clean, readable URLs)
- JWT tokens with automatic refresh
- Role-based authorization at route level

## 💡 Development Approach

This project was completed as a take-home assessment with the following approach:

**AI-Assisted Development**: Used Claude AI for:
- Initial FastAPI project structure (new framework for me)
- Base CSS scaffolding (I'm slower at CSS)
- Debugging complex issues
- README structure

**Independent Work**:
- All business logic and feature implementation
- Component architecture and React patterns
- Database schema design
- UX/UI decisions and styling refinements

**Time Investment**: ~14 hours total
- Frontend: 4 hours
- Backend: 5 hours
- Setup/Dependencies: 3 hours
- Debugging: 1 hour
- Documentation: 1 hour

## 🚀 Features I'm Proud Of

1. **Draft System**: Jobs can be saved as drafts and published when ready
2. **Smart Filtering**: Location autocomplete with 200+ US cities
3. **Salary Preview**: Real-time formatting as users type
4. **Toast Notifications**: Immediate feedback for all actions
5. **Responsive Design**: Works seamlessly on all screen sizes
6. **Tab Management**: Admins can easily switch between active/draft/closed jobs

## 🔧 Future Enhancements

- Email notifications for new job postings
- Applicant tracking system
- Advanced analytics dashboard
- Job search saved filters
- Company profiles with branding
- Integration with job board APIs

## 📝 Notes

- Color scheme uses orange and pink for a modern, friendly aesthetic
- Admin functionality automatically appears upon login
- All forms include proper validation and error handling
- Database migrations use Alembic for version control

## 📫 Questions?

Happy to discuss any architectural decisions, trade-offs, or implementation details!

---