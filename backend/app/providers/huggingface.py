import time
import requests
from io import BytesIO
from typing import Optional
from PIL import Image
from app.config import settings
from app.providers.base import BaseImageProvider, GenerationResult

class HuggingFaceProvider(BaseImageProvider):
    def __init__(self):
        # We will pull the token from the .env file
        self.api_token = getattr(settings, 'huggingface_api_token', None)
        self.api_url = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"

    def is_configured(self) -> bool:
        return bool(self.api_token)

    def generate(
        self, 
        prompt: str, 
        negative_prompt: Optional[str] = None,
        width: int = 512, 
        height: int = 512,
        seed: Optional[int] = None
    ) -> GenerationResult:
        
        if not self.is_configured():
            raise ValueError("Hugging Face API token is missing. Please check your .env file.")

        headers = {"Authorization": f"Bearer {self.api_token}"}
        payload = {
            "inputs": prompt,
            "parameters": {
                "width": width,
                "height": height
            }
        }

        start_time = time.time()
        
        # Make the request to Hugging Face
        response = requests.post(self.api_url, headers=headers, json=payload)
        
        if response.status_code != 200:
            raise Exception(f"Hugging Face API Error: {response.text}")

        img_bytes = response.content
        duration_ms = int((time.time() - start_time) * 1000)

        # Validate the image
        try:
            img = Image.open(BytesIO(img_bytes))
            img.verify()
        except Exception as e:
            raise Exception(f"Failed to decode generated image: {str(e)}")

        return GenerationResult(
            image_bytes=img_bytes,
            width=width,
            height=height,
            provider="huggingface",
            model_name="FLUX.1-schnell",
            model_version="1.0",
            duration_ms=duration_ms
        )
