from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings
from app.supabase_client import supabase
from app.providers.factory import get_provider

app = FastAPI(title="AI Image Factory API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptCreate(BaseModel):
    prompt_text: str
    category: str
    width: int = 512
    height: int = 512

@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.environment}

@app.get("/api/prompts")
def get_prompts():
    try:
        response = supabase.table("prompts").select("*").order("created_at", desc=True).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/prompts")
def create_prompt(prompt: PromptCreate):
    try:
        new_prompt = {
            "prompt_text": prompt.prompt_text,
            "category": prompt.category,
            "width": prompt.width,
            "height": prompt.height,
            "status": "pending"
        }
        response = supabase.table("prompts").insert(new_prompt).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/images")
def get_images():
    try:
        response = supabase.table("generated_images").select("*").order("created_at", desc=True).execute()
        images = response.data
        for img in images:
            try:
                signed_url_response = supabase.storage.from_(img['storage_bucket']).create_signed_url(img['storage_path'], 3600)
                img['url'] = signed_url_response.get('signedURL')
            except Exception as e:
                img['url'] = None
        return {"status": "success", "data": images}
    except Exception as e:
        return {"status": "error", "message": str(e)}
