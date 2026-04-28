from __future__ import annotations

from textwrap import shorten

from .base import NarrativeProvider


class MockNarrativeProvider(NarrativeProvider):
    @property
    def mode(self) -> str:
        return "mock"

    async def available(self) -> bool:
        return True

    async def list_models(self) -> list[str]:
        return ["mock-council"]

    async def generate(
        self,
        *,
        role_name: str,
        system_prompt: str,
        user_prompt: str,
        context_fragments: list[str],
        temperature: float,
    ) -> str:
        confession = shorten(user_prompt.replace("\n", " "), width=180, placeholder="...")
        context_hint = context_fragments[0] if context_fragments else "The room is speaking without reference notes."
        primary_confession = self._extract_primary_confession(user_prompt)

        if role_name == "The Sheriff":
            return (
                "You do not have to carry every title to the grave. "
                f"What you named sounds like a weight that once kept you upright and now only keeps you armed. "
                f"Set it down. Let dusk do its work. Historical echo: {context_hint}"
            )

        if role_name == "The Activist":
            return (
                "Not every goodbye is surrender. Some departures are refusals at the exact moment refusal becomes moral. "
                f"What you named in '{primary_confession}' may be the old order asking for one more performance. "
                f"Walk out anyway. Historical echo: {context_hint}"
            )

        return (
            "The archive hears both mercy and revolt in what you offered. "
            f"In '{primary_confession}', there is both exhaustion and beginning. "
            "The sheriff teaches release; the activist teaches refusal. "
            "Between them, your threshold becomes a chosen passage instead of an accident. "
            f"Historical echo: {context_hint}"
        )

    @staticmethod
    def _extract_primary_confession(user_prompt: str) -> str:
        marker = "User confession:"
        if marker in user_prompt:
            after_marker = user_prompt.split(marker, 1)[1].strip()
            primary_line = after_marker.split("\n", 1)[0].strip()
            if primary_line:
                return shorten(primary_line, width=140, placeholder="...")

        return shorten(user_prompt.replace("\n", " "), width=140, placeholder="...")
