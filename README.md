# Threshold_73

KNOCK is a web-based AI artwork built around Bob Dylan's "Knockin' on Heaven's Door" and its historical afterlife.

The experience is split into two layers:

- `frontend`: a scroll-based ritual space where the user enters a personal threshold
- `backend`: a multi-agent "1973 council" that answers through historically grounded voices

## Current Structure

### Frontend

- `src/main.ts`: scene flow, scroll behavior, UI state, API calls
- `src/style.css`: art direction, motion, staging, responsive layout

### Backend

- `backend/app/main.py`: FastAPI entry point
- `backend/app/graph.py`: LangGraph orchestration
- `backend/app/providers/`: model providers (`mock`, `ollama`)
- `backend/app/services/`: prompts and historical context selection

## Roadmap

### Phase 1: Foundation

- [x] Establish the visual language
- [x] Build the scroll-based intro ritual
- [x] Build the threshold room with the door and confession area
- [x] Scaffold a FastAPI + LangGraph backend
- [x] Connect frontend submit flow to backend response rendering

### Phase 2: Working Demo

- [x] Install backend dependencies
- [x] Run FastAPI locally
- [x] Test the full request-response loop from the UI
- [x] Tune live outputs so the council feels more poetic and distinct

### Phase 3: Real Local AI

- [ ] Install and run Ollama locally
- [ ] Switch provider mode from `mock` to `ollama`
- [ ] Tune model prompts and response length
- [ ] Add graceful fallback when the local model is unavailable

### Phase 3B: Free Cloud Fallback

- [x] Add Groq provider support
- [x] Configure `GROQ_API_KEY`
- [x] Switch the ritual to cloud inference without local model download

### Phase 4: Exhibition Polish

- [x] Add TTS / radio voice layer
- [ ] Add agent-by-agent reveal sequence
- [x] Add loading choreography and sound cues
- [ ] Replace browser TTS with local Piper voice clips
- [ ] Prepare screenshots, architecture diagram, and README polish for submission

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

### Optional Piper Voice Layer

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

- [backend/.env.example](</C:/Users/burito/Desktop/Lectures/Projects/AI/knock/backend/.env.example>)
- [backend/README.md](</C:/Users/burito/Desktop/Lectures/Projects/AI/knock/backend/README.md>)
