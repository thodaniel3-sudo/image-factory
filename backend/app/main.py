from fastapi import FastAPI
from fastapi.responses import Response
from app.config import settings
from app.supabase_client import supabase
from app.providers.factory import get_provider

app = FastAPI(title="AI Image Factory API", version="0.1.0")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
        "message": "Backend is running securely."
    }

@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("application_settings").select("*").execute()
        return {
            "status": "success",
            "message": "Successfully connected to Supabase Postgres!",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/test-mock-image")
def test_mock_image():
    provider = get_provider("mock")
    if not provider.is_configured():
        return {"status": "error", "message": "Provider not configured"}
    
    result = provider.generate(
        prompt="A beautiful sunset over a mountain",
        width=512,
        height=512
    )
    
    return Response(content=result.image_bytes, media_type="image/png")
