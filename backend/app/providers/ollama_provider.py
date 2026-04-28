from __future__ import annotations

import httpx

from ..config import Settings
from .base import NarrativeProvider


class OllamaNarrativeProvider(NarrativeProvider):
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    @property
    def mode(self) -> str:
        return "ollama"

    async def available(self) -> bool:
        try:
          async with httpx.AsyncClient(timeout=10) as client:
              response = await client.get(
                  f"{self._settings.ollama_base_url.rstrip('/')}/api/tags"
              )
              response.raise_for_status()
              return True
        except httpx.HTTPError:
            return False

    async def list_models(self) -> list[str]:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self._settings.ollama_base_url.rstrip('/')}/api/tags"
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError:
            return []

        return [model.get("name", "") for model in data.get("models", []) if model.get("name")]

    async def generate(
        self,
        *,
        role_name: str,
        system_prompt: str,
        user_prompt: str,
        context_fragments: list[str],
        temperature: float,
    ) -> str:
        context_block = "\n".join(f"- {fragment}" for fragment in context_fragments)
        message = (
            f"Historical fragments:\n{context_block or '- none'}\n\n"
            f"User confession:\n{user_prompt}\n\n"
            f"Speak as {role_name}. Keep the answer under 150 words."
        )

        payload = {
            "model": self._settings.ollama_model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "options": {
                "temperature": temperature,
            },
        }

        async with httpx.AsyncClient(timeout=self._settings.request_timeout_seconds) as client:
            response = await client.post(
                f"{self._settings.ollama_base_url.rstrip('/')}/api/chat",
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

        return data["message"]["content"].strip()
