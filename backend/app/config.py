from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")


@dataclass(slots=True)
class Settings:
    app_name: str = "KNOCK Backend"
    api_prefix: str = "/api"
    cors_origin: str = os.getenv("KNOCK_CORS_ORIGIN", "http://localhost:5173")
    model_provider: str = os.getenv("KNOCK_MODEL_PROVIDER", "auto").strip().lower()
    ollama_base_url: str = os.getenv("KNOCK_OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    ollama_model: str = os.getenv("KNOCK_OLLAMA_MODEL", "llama3.1:8b")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "").strip()
    groq_base_url: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    request_timeout_seconds: float = float(os.getenv("KNOCK_REQUEST_TIMEOUT", "90"))
    tts_provider: str = os.getenv("KNOCK_TTS_PROVIDER", "auto").strip().lower()
    tts_public_path: str = os.getenv("KNOCK_TTS_PUBLIC_PATH", "/generated-audio")
    piper_python_executable: str = os.getenv("KNOCK_PIPER_PYTHON", sys.executable)
    piper_voice_model: str = os.getenv(
        "KNOCK_PIPER_VOICE_MODEL",
        str(BASE_DIR / "voices" / "en_US-norman-medium.onnx"),
    )
    piper_voice_model_activist: str = os.getenv(
        "KNOCK_PIPER_VOICE_MODEL_ACTIVIST",
        str(BASE_DIR / "voices" / "en_US-arctic-medium.onnx"),
    )
    piper_voice_model_archivist: str = os.getenv(
        "KNOCK_PIPER_VOICE_MODEL_ARCHIVIST",
        str(BASE_DIR / "voices" / "en_US-reza_ibrahim-medium.onnx"),
    )
    piper_voice_model_synthesis: str = os.getenv(
        "KNOCK_PIPER_VOICE_MODEL_SYNTHESIS",
        str(BASE_DIR / "voices" / "en_US-reza_ibrahim-medium.onnx"),
    )
    piper_volume: float = float(os.getenv("KNOCK_PIPER_VOLUME", "0.62"))
    piper_output_dir: str = os.getenv(
        "KNOCK_PIPER_OUTPUT_DIR",
        str(BASE_DIR / "generated_audio"),
    )


def get_settings() -> Settings:
    return Settings()
