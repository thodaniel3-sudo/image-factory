from app.providers.base import BaseImageProvider
from app.providers.mock import MockImageProvider

def get_provider(provider_name: str) -> BaseImageProvider:
    if provider_name == "mock":
        return MockImageProvider()
    else:
        raise ValueError(f"Provider '{provider_name}' is not supported yet.")
