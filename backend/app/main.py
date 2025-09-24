from fastapi import FastAPI
from app.routers import jobs, auth

app = FastAPI(title="Job Board API")

@app.get("/")

def root():
    return {"message": "Job Board API"}

app.include_router(auth.router)