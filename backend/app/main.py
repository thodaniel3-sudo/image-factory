from fastapi import FastAPI
from app.config import settings

app = FastAPI(title="AI Image Factory API", version="0.1.0")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
        "message": "Backend is running securely."
    }
