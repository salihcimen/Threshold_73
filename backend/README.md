# Threshold_73 Backend

This backend powers the response chamber behind `Threshold_73`.

It provides:

- FastAPI endpoints for the frontend
- LangGraph orchestration for the staged voices
- Groq, Ollama, and mock provider support
- optional Piper voice rendering

## Endpoints

- `GET /api/health`
- `GET /api/config`
- `POST /api/ritual/respond`

## Voices

The current staged response flow is:

1. `The Sheriff`
2. `The Activist`
3. `The Balladeer`
4. `The Coda`

The first three are full responses. The coda is a short final line intended to read like an inscription.

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

## Provider Modes

Default mode:

```powershell
$env:KNOCK_MODEL_PROVIDER = "auto"
```

Resolution order:

1. `ollama` if available
2. `groq` if `GROQ_API_KEY` is configured
3. `mock` fallback

### Optional Groq mode

```powershell
$env:KNOCK_MODEL_PROVIDER = "groq"
$env:GROQ_API_KEY = "your_key_here"
$env:GROQ_MODEL = "llama-3.1-8b-instant"
```

### Optional Ollama mode

```powershell
$env:KNOCK_MODEL_PROVIDER = "ollama"
$env:KNOCK_OLLAMA_MODEL = "llama3.1:8b"
```

## Optional Piper TTS

Piper is used when:

- `KNOCK_TTS_PROVIDER` is `auto` or `piper`
- `piper-tts` is installed
- the configured `.onnx` voice files exist

Minimal env example:

```powershell
$env:KNOCK_TTS_PROVIDER = "auto"
$env:KNOCK_PIPER_VOICE_MODEL = "backend\\voices\\en_US-norman-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_ACTIVIST = "backend\\voices\\en_US-arctic-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_ARCHIVIST = "backend\\voices\\en_US-reza_ibrahim-medium.onnx"
$env:KNOCK_PIPER_VOICE_MODEL_SYNTHESIS = "backend\\voices\\en_US-reza_ibrahim-medium.onnx"
```

When Piper is available, `/api/ritual/respond` returns `audio_url` values and serves generated `.wav` files from `/generated-audio`.
