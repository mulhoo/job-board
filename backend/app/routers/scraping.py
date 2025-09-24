from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional, List
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.database import get_db
from app.models import Job, User
from app.auth import get_current_admin_user
from app.services.scrapers.indeed_scraper import IndeedScraper

router = APIRouter(prefix="/admin/scraping", tags=["admin-scraping"])

SCRAPERS = {
    "indeed": IndeedScraper,
}

@router.get("/sources")
async def get_available_sources(current_admin: User = Depends(get_current_admin_user)):
    """Get list of available job board sources (Admin only)"""
    return {
        "sources": [
            {
                "value": "indeed",
                "label": "Indeed",
                "description": "World's #1 job site",
                "status": "active",
                "rate_limit_seconds": 2,
                "max_recommended_limit": 100
            },
        ]
    }

@router.post("/trigger/{source}")
async def trigger_scraping(
    source: str,
    background_tasks: BackgroundTasks,
    query: str = "software engineer",
    location: str = "San Francisco, CA",
    limit: int = 20,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Trigger job scraping from specified source (Admin only)"""

    if source not in SCRAPERS:
        raise HTTPException(
            status_code=400,
            detail=f"Source '{source}' not supported. Available: {list(SCRAPERS.keys())}"
        )

    background_tasks.add_task(
        scrape_and_save_jobs,
        source, query, location, limit,
        current_admin.id, db
    )

    return {
        "message": f"Scraping started from {source.title()}",
        "source": source,
        "query": query,
        "location": location,
        "limit": limit,
        "status": "in_progress",
        "triggered_by": current_admin.first_name + current_admin.last_name
    }

@router.get("/preview/{source}")
async def preview_scraping(source: str, query: str, location: str, limit: int = 5, current_admin: User = Depends(get_current_admin_user)):
    scraper_class = SCRAPERS[source]
    scraper = scraper_class()

    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        jobs = await loop.run_in_executor(executor, scraper.search_jobs, query, location, limit)

    return {
        "preview": True,
        "source": source,
        "count": len(jobs),
        "jobs": jobs,
        "query": query,
        "location": location,
        "previewed_by": current_admin.first_name
    }

@router.get("/history")
async def get_scraping_history(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get recent scraping history (Admin only)"""
    return {
        "recent_scrapes": [
            {
                "id": 1,
                "source": "indeed",
                "query": "software engineer",
                "location": "San Francisco, CA",
                "jobs_found": 15,
                "jobs_saved": 12,
                "triggered_by": "Admin User",
                "started_at": "2024-01-15T10:30:00Z",
                "completed_at": "2024-01-15T10:32:30Z",
                "status": "completed"
            }
        ]
    }

@router.get("/stats")
async def get_scraping_stats(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get scraping statistics (Admin only)"""
    total_jobs = db.query(Job).count()

    scraped_jobs = db.query(Job).filter(Job.external_url.isnot(None)).count()
    manual_jobs = total_jobs - scraped_jobs

    return {
        "total_jobs": total_jobs,
        "scraped_jobs": scraped_jobs,
        "manual_jobs": manual_jobs,
        "scraping_enabled": True,
        "available_sources": len(SCRAPERS)
    }

def scrape_and_save_jobs(
    source: str,
    query: str,
    location: str,
    limit: int,
    admin_id: int,
    db: Session
):
    """Background task to scrape and save jobs"""
    print(f"Starting scrape: {source} | {query} in {location} | triggered by admin {admin_id}")

    scraper_class = SCRAPERS.get(source)
    if not scraper_class:
        print(f"No scraper found for source: {source}")
        return

    try:
        scraper = scraper_class()
        scraped_jobs = scraper.search_jobs(query, location, limit)

        saved_count = 0
        duplicate_count = 0

        for job_data in scraped_jobs:
            try:
                existing_job = db.query(Job).filter(
                    Job.title == job_data['title'],
                    Job.company == job_data['company']
                ).first()

                if not existing_job:
                    db_job = Job(
                        title=job_data['title'],
                        company=job_data['company'],
                        description=job_data['description'],
                        location=job_data['location'],
                        salary_range=job_data.get('salary_range'),
                        external_url=job_data.get('external_url'),
                        is_scraped=True,
                        source_name=source
                    )
                    db.add(db_job)
                    saved_count += 1
                else:
                    duplicate_count += 1

            except Exception as e:
                print(f"Error saving job {job_data['title']}: {e}")
                continue

        db.commit()

        print(f"Scraping completed: {saved_count} new jobs saved, {duplicate_count} duplicates skipped")

    except Exception as e:
        print(f"Error during scraping: {e}")
        db.rollback()