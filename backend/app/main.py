from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.supabase_client import supabase
from app.providers.factory import get_provider

app = FastAPI(title="AI Image Factory API", version="0.1.0")

# --- Add CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}

@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("application_settings").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/test-mock-image")
def test_mock_image():
    provider = get_provider("mock")
    result = provider.generate(prompt="A beautiful sunset over a mountain")
    return Response(content=result.image_bytes, media_type="image/png")
