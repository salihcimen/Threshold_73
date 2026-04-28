from __future__ import annotations

from abc import ABC, abstractmethod


class NarrativeProvider(ABC):
    @property
    @abstractmethod
    def mode(self) -> str:
        raise NotImplementedError

    @abstractmethod
    async def available(self) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def list_models(self) -> list[str]:
        raise NotImplementedError

    @abstractmethod
    async def generate(
        self,
        *,
        role_name: str,
        system_prompt: str,
        user_prompt: str,
        context_fragments: list[str],
        temperature: float,
    ) -> str:
        raise NotImplementedError
