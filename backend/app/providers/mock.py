import time
import hashlib
from io import BytesIO
from PIL import Image, ImageDraw
from typing import Optional
from app.providers.base import BaseImageProvider, GenerationResult

class MockImageProvider(BaseImageProvider):
    def is_configured(self) -> bool:
        # The mock provider is always ready
        return True

    def generate(
        self, 
        prompt: str, 
        negative_prompt: Optional[str] = None,
        width: int = 512, 
        height: int = 512,
        seed: Optional[int] = None
    ) -> GenerationResult:
        
        start_time = time.time()
        
        # Create a blank image with a color based on the prompt text
        prompt_hash = int(hashlib.md5(prompt.encode()).hexdigest(), 16)
        color = (prompt_hash % 256, (prompt_hash // 256) % 256, (prompt_hash // 65536) % 256)
        
        img = Image.new('RGB', (width, height), color=color)
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), f"MOCK IMAGE\n{prompt[:30]}...", fill="white")
        
        # Save to bytes
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_bytes = img_byte_arr.getvalue()
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        return GenerationResult(
            image_bytes=img_bytes,
            width=width,
            height=height,
            provider="mock",
            model_name="mock-v1",
            model_version="1.0.0",
            duration_ms=duration_ms
        )
