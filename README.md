# Brain 2.0

Production-ready starter for a single-location Gym CRM SaaS with multi-tenant-safe backend APIs, AI-assisted engagement modules, and role-aware frontend shell.

## Stack
- Frontend: React + TypeScript + Vite + Mantine + Axios + Socket.IO Client + TanStack Query
- Backend: Flask + Flask-CORS + Flask-SocketIO + Flask-Limiter + Celery fallback + Redis cache fallback
- Data: Supabase Postgres via REST (`httpx`) with RLS-first SQL migration
- AI: Gemini API integration with cache + fallback

## Local development
- Backend: `http://localhost:2021`
- Frontend: `http://localhost:5170`

### 1) Backend setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app app.main run --host 0.0.0.0 --port 2021
```

### 2) Frontend setup
```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

### 3) Run checks
```bash
cd frontend && npm run lint && npm run build
cd ../backend && pytest -q
```

## Environment variables
See:
- `backend/.env.example`
- `backend/.env.production.example`
- `frontend/.env.example`

## API prefixes
All module APIs are exposed under `/api/v1`:
- `/auth`, `/gym`, `/dashboard`, `/whatsapp`, `/instagram`, `/business`, `/export`, `/training`, `/leads`, `/billing`, `/settings`

Health/status endpoints:
- `GET /health`
- `GET /status`

## Database migration
Run Supabase SQL migration:
- `supabase/migrations/20260414_initial_brain20.sql`

## Supabase local setup
This repo includes a local Supabase CLI config:
- `supabase/config.toml`

Run locally (with Supabase CLI installed):
```bash
supabase start
supabase db reset
```

Then set backend env values in `backend/.env`:
- `SUPABASE_URL` (local REST URL, e.g. `http://127.0.0.1:54321`)
- `SUPABASE_KEY` (anon key)
- `SUPABASE_SERVICE_KEY` (service role key)

## Postman
Import:
- `postman/Brain2.0.postman_collection.json`
- `postman/Brain2.0.postman_environment.json`

Recommended flow:
1. Run `Auth > Login (sets token)` to populate `{{token}}`.
2. Run any request in `Protected` and `WhatsApp` folders.

## Production notes
- Gunicorn config: `backend/gunicorn.conf.py`
- Nginx sample: `backend/config/nginx.brain2.0.conf`
- CI workflow: `.github/workflows/ci.yml`
- Hostinger deploy workflow: `.github/workflows/deploy-hostinger.yml`
