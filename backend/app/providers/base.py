from abc import ABC, abstractmethod
from typing import Optional
from pydantic import BaseModel

class GenerationResult(BaseModel):
    image_bytes: bytes
    width: int
    height: int
    provider: str
    model_name: str
    model_version: str
    duration_ms: int

class BaseImageProvider(ABC):
    @abstractmethod
    def is_configured(self) -> bool:
        pass

    @abstractmethod
    def generate(
        self, 
        prompt: str, 
        negative_prompt: Optional[str] = None,
        width: int = 512, 
        height: int = 512,
        seed: Optional[int] = None
    ) -> GenerationResult:
        pass
