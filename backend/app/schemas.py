from __future__ import annotations

from pydantic import BaseModel, Field


class RitualRequest(BaseModel):
    confession: str = Field(min_length=4, max_length=480)


class AgentMessage(BaseModel):
    agent_id: str
    display_name: str
    stance: str
    message: str
    audio_url: str | None = None


class RitualResponse(BaseModel):
    provider_mode: str
    tts_mode: str
    confession: str
    context_fragments: list[str]
    agents: list[AgentMessage]


class HealthResponse(BaseModel):
    status: str
    requested_provider_mode: str
    provider_mode: str
    ollama_available: bool
    groq_available: bool
    tts_mode: str
    piper_available: bool


class ConfigResponse(BaseModel):
    requested_provider_mode: str
    provider_mode: str
    ollama_model: str
    ollama_available: bool
    ollama_models: list[str]
    groq_model: str
    groq_available: bool
    tts_mode: str
    piper_available: bool
    piper_voice_model: str
    available_agents: list[str]
