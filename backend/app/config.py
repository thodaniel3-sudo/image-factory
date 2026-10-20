import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    environment: str = "development"
    huggingface_api_token: Optional[str] = None
    frontend_url: str = "http://localhost:5173"

    # We use a custom source to clean the strings and ignore formatting errors
    @classmethod
    def settings_customise_sources(cls, settings_cls, init_settings, env_settings, dotenv_settings, file_secret_settings):
        return (dotenv_settings, env_settings, init_settings)

    model_config = SettingsConfigDict(
        env_file="../.env", 
        env_file_encoding="utf-8-sig", # handles hidden BOM characters
        extra="ignore"
    )

settings = Settings()
