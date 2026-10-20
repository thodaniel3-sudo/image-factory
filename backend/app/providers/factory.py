from app.providers.base import BaseImageProvider
from app.providers.mock import MockImageProvider
from app.providers.huggingface import HuggingFaceProvider

def get_provider(provider_name: str) -> BaseImageProvider:
    if provider_name == "mock":
        return MockImageProvider()
    elif provider_name == "huggingface":
        return HuggingFaceProvider()
    else:
        raise ValueError(f"Provider '{provider_name}' is not supported yet.")
