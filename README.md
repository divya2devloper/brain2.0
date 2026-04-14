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
cd /home/runner/work/brain2.0/brain2.0/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app app.main run --host 0.0.0.0 --port 2021
```

### 2) Frontend setup
```bash
cd /home/runner/work/brain2.0/brain2.0/frontend
npm ci
cp .env.example .env
npm run dev
```

### 3) Run checks
```bash
cd /home/runner/work/brain2.0/brain2.0/frontend && npm run lint && npm run build
cd /home/runner/work/brain2.0/brain2.0/backend && pytest -q
```

## Environment variables
See:
- `/home/runner/work/brain2.0/brain2.0/backend/.env.example`
- `/home/runner/work/brain2.0/brain2.0/backend/.env.production.example`
- `/home/runner/work/brain2.0/brain2.0/frontend/.env.example`

## API prefixes
All module APIs are exposed under `/api/v1`:
- `/auth`, `/gym`, `/dashboard`, `/whatsapp`, `/instagram`, `/business`, `/export`, `/training`, `/leads`, `/billing`, `/settings`

Health/status endpoints:
- `GET /health`
- `GET /status`

## Database migration
Run Supabase SQL migration:
- `/home/runner/work/brain2.0/brain2.0/supabase/migrations/20260414_initial_brain20.sql`

## Production notes
- Gunicorn config: `/home/runner/work/brain2.0/brain2.0/backend/gunicorn.conf.py`
- Nginx sample: `/home/runner/work/brain2.0/brain2.0/backend/config/nginx.brain2.0.conf`
- CI workflow: `/home/runner/work/brain2.0/brain2.0/.github/workflows/ci.yml`
- Hostinger deploy workflow: `/home/runner/work/brain2.0/brain2.0/.github/workflows/deploy-hostinger.yml`
