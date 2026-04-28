# KNOCK Backend

This backend powers the "1973 council" behind the door and can optionally render local Piper voice clips for playback in the frontend.

## Architecture

- `FastAPI`: HTTP API for the frontend.
- `LangGraph`: orchestration layer for the multi-agent ritual.
- `Groq provider`: free cloud LLM path without downloading a local model.
- `Mock provider`: works without any model installation.
- `Ollama provider`: optional local-model provider for a fully free setup.
- `Piper TTS`: optional local voice synthesis for higher-quality playback than browser TTS.

## Endpoints

- `GET /api/health`
- `GET /api/config`
- `POST /api/ritual/respond`

## Run

Install dependencies:

```powershell
pip install -r backend\requirements.txt
```

Optional Piper dependency:

```powershell
pip install -r backend\requirements-piper.txt
```

Start the API:

```powershell
python -m uvicorn backend.app.main:app --reload --app-dir .
```

If you want environment-based config, create a local `.env` file from `.env.example`.

## Provider Modes

Default mode is:

```powershell
$env:KNOCK_MODEL_PROVIDER = "auto"
```

Resolution order:

1. `ollama` if available
2. `groq` if `GROQ_API_KEY` is configured and valid
3. `mock` fallback

## Optional Ollama mode

Environment variables:

```powershell
$env:KNOCK_MODEL_PROVIDER = "ollama"
$env:KNOCK_OLLAMA_MODEL = "llama3.1:8b"
```

If no Ollama server is available, switch back to:

```powershell
$env:KNOCK_MODEL_PROVIDER = "mock"
```

## Optional Groq mode

Groq is useful when you want a free cloud API path and do not want to download a local model.

```powershell
$env:KNOCK_MODEL_PROVIDER = "groq"
$env:GROQ_API_KEY = "your_key_here"
$env:GROQ_MODEL = "llama-3.1-8b-instant"
```

The Groq API is OpenAI-compatible, so the backend uses a standard chat-completions style call under the hood.

## Optional Piper TTS

Piper is used only when:

- `KNOCK_TTS_PROVIDER` is `auto` or `piper`
- `piper-tts` is installed
- `KNOCK_PIPER_VOICE_MODEL` points to a real `.onnx` voice file

Minimal env example:

```powershell
$env:KNOCK_TTS_PROVIDER = "auto"
$env:KNOCK_PIPER_VOICE_MODEL = "backend\\voices\\en_US-joe-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_ACTIVIST = "backend\\voices\\en_US-arctic-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_ARCHIVIST = "backend\\voices\\en_US-norman-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_SYNTHESIS = "backend\\voices\\en_US-reza_ibrahim-medium.onnx"
```

When Piper is available, the backend returns `audio_url` fields in `/api/ritual/respond` and serves generated `.wav` files from `/generated-audio`.

## Suggested Flow

1. Start the frontend with `npm run dev`
2. Start the backend with `npm run backend:dev`
3. Enter a confession in the UI
4. Click `Leave the badge`
5. Verify the three agents and final synthesis render in the response section
