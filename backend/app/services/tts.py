from __future__ import annotations

import asyncio
import hashlib
import wave
from dataclasses import dataclass
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

from ..config import Settings


@dataclass(slots=True)
class PiperClip:
    url: str
    mime_type: str = "audio/wav"


class PiperTtsService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.voice_model_paths = {
            "sheriff": Path(settings.piper_voice_model).expanduser().resolve(),
            "activist": Path(settings.piper_voice_model_activist).expanduser().resolve(),
            "archivist": Path(settings.piper_voice_model_archivist).expanduser().resolve(),
            "epilogue": Path(settings.piper_voice_model_activist).expanduser().resolve(),
            "synthesis": Path(settings.piper_voice_model_synthesis).expanduser().resolve(),
        }
        self.voice_config_paths = {
            clip_id: model_path.with_suffix(".onnx.json")
            for clip_id, model_path in self.voice_model_paths.items()
        }
        self.output_dir = Path(settings.piper_output_dir).expanduser().resolve()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self._voices: dict[str, PiperVoice] = {}

    async def available(self) -> bool:
        return await asyncio.to_thread(self._available_sync)

    async def synthesize(self, *, text: str, clip_id: str) -> PiperClip | None:
        if not text.strip():
            return None

        available = await self.available()
        if not available:
            return None

        return await asyncio.to_thread(self._synthesize_sync, text, clip_id)

    def _available_sync(self) -> bool:
        if self.settings.tts_provider == "none":
            return False

        if self.settings.tts_provider not in {"auto", "piper"}:
            return False

        for clip_id, model_path in self.voice_model_paths.items():
            if not model_path.exists():
                return False

            if not self.voice_config_paths[clip_id].exists():
                return False

        return True

    def _model_path_for_clip(self, clip_id: str) -> Path:
        return self.voice_model_paths.get(clip_id, self.voice_model_paths["sheriff"])

    def _config_path_for_clip(self, clip_id: str) -> Path:
        return self.voice_config_paths.get(clip_id, self.voice_config_paths["sheriff"])

    def _get_voice(self, clip_id: str) -> PiperVoice:
        if clip_id not in self._voices:
            self._voices[clip_id] = PiperVoice.load(
                self._model_path_for_clip(clip_id),
                config_path=self._config_path_for_clip(clip_id),
            )

        return self._voices[clip_id]

    def _synthesize_sync(self, text: str, clip_id: str) -> PiperClip:
        cache_key = (
            f"v5:{clip_id}:{text}:{self._model_path_for_clip(clip_id)}:{self.settings.piper_volume}"
        )
        slug = hashlib.sha1(cache_key.encode("utf-8")).hexdigest()[:16]
        output_path = self.output_dir / f"{slug}.wav"

        if not output_path.exists():
            voice = self._get_voice(clip_id)
            syn_config = SynthesisConfig(
                volume=self.settings.piper_volume,
                normalize_audio=False,
                noise_scale=0.62,
                noise_w_scale=0.7,
                length_scale=1.02,
            )
            with wave.open(str(output_path), "wb") as wav_file:
                voice.synthesize_wav(text, wav_file, syn_config=syn_config)

        return PiperClip(url=f"{self.settings.tts_public_path}/{output_path.name}")
