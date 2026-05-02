# Threshold_73

`Threshold_73` is an interactive AI artwork built around Bob Dylan's *Knockin' on Heaven's Door*, the film *Pat Garrett & Billy the Kid*, and the historical mood of 1973.

It is designed as a ritual rather than a tool: the user leaves a role, habit, fear, or old identity at the door, and the room answers through four staged voices.

## What It Is

- `frontend`: a scroll-based theatrical interface with a threshold chamber, radio loading sequence, staged replies, and a final full-screen coda
- `backend`: a FastAPI + LangGraph system that generates historically grounded responses through The Sheriff, The Activist, The Balladeer, and The Coda

## Project Structure

### Frontend

- `src/main.ts`: scene flow, state, typing choreography, API calls, audio playback
- `src/style.css`: visual direction, motion, staging, responsive layout
- `public/threshold73-mark.svg`: site mark and favicon source

### Backend

- `backend/app/main.py`: FastAPI entry point
- `backend/app/graph.py`: LangGraph orchestration and coda normalization
- `backend/app/providers/`: model providers
- `backend/app/services/`: prompts, context selection, and TTS support

## Current Experience

- cinematic scroll intro
- threshold room with confession input
- three primary response voices
- full-screen final coda
- loading sound choreography
- optional voice relay through browser audio or Piper clips

## Run

### Frontend

```powershell
npm install
npm run dev
```

### Backend

```powershell
pip install -r backend\requirements.txt
npm run backend:dev
```

### Optional Piper Layer

```powershell
pip install -r backend\requirements-piper.txt
```

## Configuration

- Frontend API base URL: `VITE_API_BASE_URL`
- Backend provider mode: `KNOCK_MODEL_PROVIDER`
- Backend Ollama model: `KNOCK_OLLAMA_MODEL`
- Backend TTS mode: `KNOCK_TTS_PROVIDER`
- Piper voice model path: `KNOCK_PIPER_VOICE_MODEL`

See:

- [backend/.env.example](./backend/.env.example)
- [backend/README.md](./backend/README.md)
