import time
import uuid
from datetime import datetime
from app.config import settings
from app.supabase_client import supabase
from app.providers.factory import get_provider

def process_image(prompt_record):
    print(f"Processing prompt: {prompt_record['prompt_text'][:50]}...")
    
    provider = get_provider("mock")
    result = provider.generate(
        prompt=prompt_record['prompt_text'],
        width=prompt_record.get('width', 512),
        height=prompt_record.get('height', 512)
    )
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    category = prompt_record.get('category', 'uncategorized')
    filename = f"{category}/{date_str}/{uuid.uuid4()}.png"
    
    print(f"Uploading to storage: {filename}")
    supabase.storage.from_("generated-images").upload(
        path=filename,
        file=result.image_bytes,
        file_options={"content-type": "image/png"}
    )
    
    print("Saving metadata to database...")
    image_record = {
        "prompt_id": prompt_record['id'],
        "storage_bucket": "generated-images",
        "storage_path": filename,
        "original_filename": f"{uuid.uuid4()}.png",
        "file_extension": "png",
        "mime_type": "image/png",
        "width": result.width,
        "height": result.height,
        "provider": result.provider,
        "model_name": result.model_name,
        "generation_duration_ms": result.duration_ms,
        "review_status": "pending_review"
    }
    supabase.table("generated_images").insert(image_record).execute()
    supabase.table("prompts").update({"status": "completed"}).eq("id", prompt_record['id']).execute()
    print("Successfully completed prompt!\n")

def run_worker():
    worker_id = f"worker-{uuid.uuid4().hex[:6]}"
    print(f"Worker {worker_id} started. Polling for jobs...")
    
    while True:
        try:
            response = supabase.rpc("claim_next_prompt", {"worker_name": worker_id}).execute()
            
            # Print exactly what we get back (debugging)
            data = response.data
            print(f"DEBUG: Data type is {type(data)}")
            
            # The strongest check: it must be a dictionary, AND it must have a non-empty 'prompt_text'
            if isinstance(data, dict) and data.get('prompt_text'):
                try:
                    process_image(data)
                except Exception as e:
                    print(f"Error processing prompt: {e}")
                    supabase.table("prompts").update({
                        "status": "failed", 
                        "last_error": str(e)
                    }).eq("id", data['id']).execute()
            else:
                print("No pending jobs. Waiting 10 seconds...")
                time.sleep(10)
                
        except KeyboardInterrupt:
            print("\nWorker shutting down gracefully.")
            break
        except Exception as e:
            print(f"Worker connection error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    run_worker()
