from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.routers.jobs as jobs
import app.routers.users as users
# import app.routers.applications as applications

app = FastAPI(
    title="Job Board API",
    version="1.0.0",
    description="A job board API built with FastAPI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔗 Routers
app.include_router(jobs.router, prefix="")
app.include_router(users.router, prefix="")
# app.include_router(applications.router, prefix="")

@app.get("/")
def root():
    return {"message": "Job Board API", "version": "1.0.0", "docs_url": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
