from supabase import create_client, Client
from app.config import settings

# We use the service role key here because the backend worker needs admin access
supabase: Client = create_client(settings.supabase_url, settings.supabase_service_role_key)
