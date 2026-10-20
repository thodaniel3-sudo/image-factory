from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # These are safe placeholders. We will fill them in Phase 3.
    supabase_url: str = "https://placeholder.supabase.co"
    supabase_anon_key: str = "placeholder_anon_key"
    supabase_service_role_key: str = "placeholder_service_role_key"
    environment: str = "development"

    # This tells Pydantic to look for a .env file in the parent directory
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
