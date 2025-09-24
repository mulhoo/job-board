from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.database import get_db
from app.models import Job
from app.services.scrapers.indeed_scraper import IndeedScraper

router = APIRouter(prefix="/scraping", tags=["scraping"])

SCRAPERS = {
    "indeed": IndeedScraper,
    # Future scrapers will be added here
    # "linkedin": LinkedInScraper,
    # "glassdoor": GlassdoorScraper,
}

@router.get("/sources")
async def get_available_sources():
    """Get list of available job board sources"""
    return {
        "sources": [
            {
                "value": "indeed",
                "label": "Indeed",
                "description": "Most popular job board",
                "status": "active"
            },
            {
                "value": "linkedin",
                "label": "LinkedIn Jobs",
                "description": "Professional network jobs",
                "status": "coming_soon"
            },
            {
                "value": "glassdoor",
                "label": "Glassdoor",
                "description": "Jobs with company reviews",
                "status": "coming_soon"
            },
            {
                "value": "remoteok",
                "label": "Remote OK",
                "description": "Remote-first positions",
                "status": "coming_soon"
            }
        ]
    }

@router.post("/{source}")
async def scrape_jobs(
    source: str,
    background_tasks: BackgroundTasks,
    query: str = "software engineer",
    location: str = "San Francisco, CA",
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Trigger job scraping from specified source"""

    if source not in SCRAPERS:
        raise HTTPException(
            status_code=400,
            detail=f"Source '{source}' not supported. Available sources: {list(SCRAPERS.keys())}"
        )

    background_tasks.add_task(scrape_and_save_jobs, source, query, location, limit, db)

    return {
        "message": f"{source.title()} scraping started",
        "source": source,
        "query": query,
        "location": location,
        "limit": limit,
        "status": "in_progress"
    }

@router.get("/{source}/preview")
async def preview_jobs(
    source: str,
    query: str = "software engineer",
    location: str = "San Francisco, CA",
    limit: int = 5
):
    """Preview scraped jobs without saving them"""

    if source not in SCRAPERS:
        raise HTTPException(
            status_code=400,
            detail=f"Source '{source}' not supported. Available sources: {list(SCRAPERS.keys())}"
        )

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
        "location": location
    }

def scrape_and_save_jobs(source: str, query: str, location: str, limit: int, db: Session):
    """Background task to scrape and save jobs from any source"""
    scraper_class = SCRAPERS.get(source)
    if not scraper_class:
        print(f"No scraper found for source: {source}")
        return

    scraper = scraper_class()
    scraped_jobs = scraper.search_jobs(query, location, limit)

    saved_count = 0
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
                )
                db.add(db_job)
                saved_count += 1

        except Exception as e:
            print(f"Error saving job {job_data['title']}: {e}")
            continue

    try:
        db.commit()
        print(f"Successfully saved {saved_count} new jobs from {source.title()}")
    except Exception as e:
        db.rollback()
        print(f"Error committing jobs: {e}")

@router.get("/status")
async def get_scraping_status():
    """Get scraping status"""
    return {
        "status": "ready",
        "available_sources": list(SCRAPERS.keys()),
        "supported_sources": len(SCRAPERS),
        "message": "Scraping service is operational"
    }