from fastapi import FastAPI

app = FastAPI(title="Job Board API")

@app.get("/")
def root():
    return {"message": "Job Board API"}