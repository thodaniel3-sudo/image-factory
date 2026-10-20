from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings
from app.supabase_client import supabase
from app.providers.factory import get_provider
import csv
import io

app = FastAPI(title="AI Image Factory API", version="0.1.0")

# Dynamic CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    settings.frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptCreate(BaseModel):
    prompt_text: str
    category: str
    width: int = 512
    height: int = 512

class ReviewUpdate(BaseModel):
    image_id: str
    review_status: str
    quality_notes: str = ""

class ListingCreate(BaseModel):
    image_id: str
    marketplace_name: str
    listing_title: str
    description: str
    keywords: str
    category: str
    ai_disclosure_completed: bool = False

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

@app.post("/api/images/review")
def review_image(review: ReviewUpdate):
    try:
        update_data = {
            "review_status": review.review_status,
            "quality_notes": review.quality_notes
        }
        response = supabase.table("generated_images").update(update_data).eq("id", review.image_id).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/listings/{image_id}")
def get_listing(image_id: str):
    try:
        response = supabase.table("sales_listings").select("*").eq("image_id", image_id).execute()
        return {"status": "success", "data": response.data[0] if response.data else None}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/listings")
def create_listing(listing: ListingCreate):
    try:
        existing = supabase.table("sales_listings").select("id").eq("image_id", listing.image_id).execute()
        
        listing_data = {
            "marketplace_name": listing.marketplace_name,
            "listing_title": listing.listing_title,
            "description": listing.description,
            "keywords": listing.keywords,
            "category": listing.category,
            "ai_disclosure_completed": listing.ai_disclosure_completed,
            "submission_status": "prepared"
        }

        if existing.data:
            response = supabase.table("sales_listings").update(listing_data).eq("id", existing.data[0]['id']).execute()
        else:
            listing_data["image_id"] = listing.image_id
            response = supabase.table("sales_listings").insert(listing_data).execute()
            
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/export/csv")
def export_csv():
    try:
        response = supabase.table("sales_listings").select("*, generated_images(storage_path)").eq("submission_status", "prepared").execute()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        writer.writerow(["Filename", "Title", "Description", "Keywords", "Category", "Marketplace", "AI Disclosure"])
        
        for row in response.data:
            filename = row['generated_images']['storage_path'].split('/')[-1] if row.get('generated_images') else "unknown.png"
            writer.writerow([
                filename,
                row.get('listing_title', ''),
                row.get('description', ''),
                row.get('keywords', ''),
                row.get('category', ''),
                row.get('marketplace_name', ''),
                "Yes" if row.get('ai_disclosure_completed') else "No"
            ])
            
        return Response(content=output.getvalue(), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=marketplace_export.csv"})
    except Exception as e:
        return {"status": "error", "message": str(e)}
