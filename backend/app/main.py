from __future__ import annotations

from contextlib import asynccontextmanager
from dataclasses import dataclass
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import Settings, get_settings
from .graph import build_ritual_graph
from .providers.groq_provider import GroqNarrativeProvider
from .providers.mock_provider import MockNarrativeProvider
from .providers.ollama_provider import OllamaNarrativeProvider
from .services.tts import PiperTtsService
from .schemas import (
    AgentMessage,
    ConfigResponse,
    HealthResponse,
    RitualRequest,
    RitualResponse,
)


@dataclass(slots=True)
class ProviderRuntime:
    provider_mode: str
    requested_provider_mode: str
    ollama_available: bool
    ollama_models: list[str]
    groq_available: bool
    groq_models: list[str]
    tts_mode: str
    piper_available: bool


async def create_provider_runtime(settings: Settings):
    requested_mode = settings.model_provider
    ollama_provider = OllamaNarrativeProvider(settings)
    groq_provider = GroqNarrativeProvider(settings)
    ollama_available = await ollama_provider.available()
    ollama_models = await ollama_provider.list_models() if ollama_available else []
    groq_available = await groq_provider.available()
    groq_models = await groq_provider.list_models() if groq_available else []

    if requested_mode == "ollama":
        if not ollama_available:
            raise RuntimeError(
                "KNOCK_MODEL_PROVIDER is set to 'ollama' but Ollama is not reachable "
                f"at {settings.ollama_base_url}."
            )
        return ollama_provider, ProviderRuntime(
            provider_mode="ollama",
            requested_provider_mode=requested_mode,
            ollama_available=True,
            ollama_models=ollama_models,
            groq_available=groq_available,
            groq_models=groq_models,
            tts_mode="browser",
            piper_available=False,
        )

    if requested_mode == "groq":
        if not groq_available:
            raise RuntimeError(
                "KNOCK_MODEL_PROVIDER is set to 'groq' but Groq is not reachable "
                "or GROQ_API_KEY is missing."
            )
        return groq_provider, ProviderRuntime(
            provider_mode="groq",
            requested_provider_mode=requested_mode,
            ollama_available=ollama_available,
            ollama_models=ollama_models,
            groq_available=True,
            groq_models=groq_models,
            tts_mode="browser",
            piper_available=False,
        )

    if requested_mode == "auto" and ollama_available:
        return ollama_provider, ProviderRuntime(
            provider_mode="ollama",
            requested_provider_mode=requested_mode,
            ollama_available=True,
            ollama_models=ollama_models,
            groq_available=groq_available,
            groq_models=groq_models,
            tts_mode="browser",
            piper_available=False,
        )

    if requested_mode == "auto" and groq_available:
        return groq_provider, ProviderRuntime(
            provider_mode="groq",
            requested_provider_mode=requested_mode,
            ollama_available=ollama_available,
            ollama_models=ollama_models,
            groq_available=True,
            groq_models=groq_models,
            tts_mode="browser",
            piper_available=False,
        )

    return MockNarrativeProvider(), ProviderRuntime(
        provider_mode="mock",
        requested_provider_mode=requested_mode,
        ollama_available=ollama_available,
        ollama_models=ollama_models,
        groq_available=groq_available,
        groq_models=groq_models,
        tts_mode="browser",
        piper_available=False,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    provider, provider_runtime = await create_provider_runtime(settings)
    tts_service = PiperTtsService(settings)
    piper_available = await tts_service.available()
    provider_runtime.tts_mode = "piper" if piper_available else "browser"
    provider_runtime.piper_available = piper_available
    graph = build_ritual_graph(provider)

    app.state.settings = settings
    app.state.provider = provider
    app.state.provider_runtime = provider_runtime
    app.state.graph = graph
    app.state.tts_service = tts_service

    yield


app = FastAPI(title="KNOCK Backend", lifespan=lifespan)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

audio_dir = Path(settings.piper_output_dir).expanduser().resolve()
audio_dir.mkdir(parents=True, exist_ok=True)
app.mount(
    settings.tts_public_path,
    StaticFiles(directory=audio_dir),
    name="generated-audio",
)


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    runtime: ProviderRuntime = app.state.provider_runtime
    return HealthResponse(
        status="ok",
        requested_provider_mode=runtime.requested_provider_mode,
        provider_mode=runtime.provider_mode,
        ollama_available=runtime.ollama_available,
        groq_available=runtime.groq_available,
        tts_mode=runtime.tts_mode,
        piper_available=runtime.piper_available,
    )


@app.get("/api/config", response_model=ConfigResponse)
async def config() -> ConfigResponse:
    current_settings: Settings = app.state.settings
    runtime: ProviderRuntime = app.state.provider_runtime
    return ConfigResponse(
        requested_provider_mode=runtime.requested_provider_mode,
        provider_mode=runtime.provider_mode,
        ollama_model=current_settings.ollama_model,
        ollama_available=runtime.ollama_available,
        ollama_models=runtime.ollama_models,
        groq_model=current_settings.groq_model,
        groq_available=runtime.groq_available,
        tts_mode=runtime.tts_mode,
        piper_available=runtime.piper_available,
        piper_voice_model=current_settings.piper_voice_model,
        available_agents=["The Sheriff", "The Activist", "The Balladeer", "The Coda"],
    )


@app.post("/api/ritual/respond", response_model=RitualResponse)
async def ritual_respond(payload: RitualRequest) -> RitualResponse:
    result = await app.state.graph.ainvoke({"confession": payload.confession})
    runtime: ProviderRuntime = app.state.provider_runtime
    tts_service: PiperTtsService = app.state.tts_service

    sheriff_audio = await tts_service.synthesize(
        text=result["sheriff_response"],
        clip_id="sheriff",
    )
    activist_audio = await tts_service.synthesize(
        text=result["activist_response"],
        clip_id="activist",
    )
    archivist_audio = await tts_service.synthesize(
        text=result["archivist_response"],
        clip_id="archivist",
    )
    epilogue_audio = await tts_service.synthesize(
        text=result["epilogue_response"],
        clip_id="epilogue",
    )

    return RitualResponse(
        provider_mode=result["provider_mode"],
        tts_mode=runtime.tts_mode,
        confession=payload.confession,
        context_fragments=result["context_fragments"],
        agents=[
            AgentMessage(
                agent_id="sheriff",
                display_name="The Sheriff",
                stance="acceptance",
                message=result["sheriff_response"],
                audio_url=sheriff_audio.url if sheriff_audio else None,
            ),
            AgentMessage(
                agent_id="activist",
                display_name="The Activist",
                stance="refusal",
                message=result["activist_response"],
                audio_url=activist_audio.url if activist_audio else None,
            ),
            AgentMessage(
                agent_id="archivist",
                display_name="The Balladeer",
                stance="afterlight",
                message=result["archivist_response"],
                audio_url=archivist_audio.url if archivist_audio else None,
            ),
            AgentMessage(
                agent_id="epilogue",
                display_name="The Coda",
                stance="last light",
                message=result["epilogue_response"],
                audio_url=epilogue_audio.url if epilogue_audio else None,
            ),
        ],
    )
