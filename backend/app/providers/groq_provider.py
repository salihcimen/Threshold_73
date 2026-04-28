from __future__ import annotations

import httpx

from ..config import Settings
from .base import NarrativeProvider


class GroqNarrativeProvider(NarrativeProvider):
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    @property
    def mode(self) -> str:
        return "groq"

    async def available(self) -> bool:
        if not self._settings.groq_api_key:
            return False

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self._settings.groq_base_url.rstrip('/')}/models",
                    headers=self._headers,
                )
                response.raise_for_status()
                return True
        except httpx.HTTPError:
            return False

    async def list_models(self) -> list[str]:
        if not self._settings.groq_api_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self._settings.groq_base_url.rstrip('/')}/models",
                    headers=self._headers,
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError:
            return []

        return [model.get("id", "") for model in data.get("data", []) if model.get("id")]

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
            f"Speak as {role_name}. Return plain text only. "
            "No bullet points. No stage directions. No markdown. Keep the answer under 60 words and 4 sentences or fewer."
        )

        payload = {
            "model": self._settings.groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            "temperature": max(temperature, 1e-8),
            "max_tokens": 120,
        }

        async with httpx.AsyncClient(timeout=self._settings.request_timeout_seconds) as client:
            response = await client.post(
                f"{self._settings.groq_base_url.rstrip('/')}/chat/completions",
                json=payload,
                headers=self._headers,
            )
            response.raise_for_status()
            data = response.json()

        return data["choices"][0]["message"]["content"].strip()

    @property
    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self._settings.groq_api_key}",
            "Content-Type": "application/json",
        }
