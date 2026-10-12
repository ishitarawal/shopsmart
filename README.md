# ShopSmart — Natural Language Shopping Assistant

ShopSmart lets someone describe what they want to buy in plain conversational
language — *"wireless earbuds under ₹3,000 with good battery life for
travelling"* — and turns that into structured requirements, a ranked set of
real products, and a running conversation with an AI shopping assistant.

This repo is the **Phase 1 foundation**: complete project architecture,
frontend UI (Home, Search Results, AI Assistant, plus stubs for the rest of
the nav), backend API, database models, mock product data, and the
environment-variable structure everything else plugs into.

---

## Features (this phase)

- Natural-language search that extracts category, budget, use case and
  preferences from a sentence, then ranks real catalog products against them
- A conversational AI shopping assistant (ShopSmart AI) that asks clarifying
  questions and shows product cards inline
- A transparent "ShopSmart Match" recommendation score with plain-language
  reasons ("Within your ₹3,000 budget", "Matches: good battery life")
- Product details, wishlist, and comparison pages (comparison logic lands in
  a later phase; the page and route are scaffolded)
- Full **demo mode**: the app works with zero API keys and no database setup
  — mock data and a rule-based AI stand in until you add real credentials
- API keys never touch the frontend — every secret lives in the backend's
  `.env`, never in React, never committed to git

---

## Technology stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, lucide-react icons
**Backend:** Python, FastAPI, SQLAlchemy, Pydantic
**Database:** SQLite for local/demo use, structured to switch to
PostgreSQL/MySQL by changing one environment variable
**AI:** Provider-abstracted (`AIProvider` interface) — ships with a
rule-based `MockAIProvider`, plus a `RealAIProvider` that calls the
Anthropic Messages API once you add a key

---

## Project structure

```
shopsmart/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, ProductCard, SearchBar, ChatBubble, etc.
│   │   ├── pages/          # Home, SearchResults, AIAssistant, ProductDetails,
│   │   │                   # Compare, Wishlist, Profile
│   │   ├── services/api.js # The ONLY place the frontend calls the backend
│   │   ├── data/            # Local fallback demo data (used only if the
│   │   │                    # backend is unreachable)
│   │   ├── hooks/, context/ # Reserved for later phases
│   │   └── App.jsx, main.jsx, index.css
│   ├── .env.example
│   ├── package.json / vite.config.js / tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, error handling, DB seeding
│   │   ├── routes/          # products, search, recommendations, chat, wishlist, users
│   │   ├── services/        # ai_service.py, product_service.py, recommendation_service.py
│   │   ├── models/          # SQLAlchemy models (product.py, user.py)
│   │   ├── schemas/         # Pydantic request/response shapes
│   │   ├── database/        # connection.py — engine/session setup
│   │   └── data/mock_products.py  # Seed catalog (8 categories)
│   ├── .env.example
│   └── requirements.txt
│
└── README.md
```

---

## Running it locally

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # leave values blank to stay in demo mode
uvicorn app.main:app --reload --port 8000
```

The backend starts in **demo mode** automatically if `.env` is left mostly
blank: it creates a local SQLite file (`shopsmart_demo.db`) and seeds it with
the mock catalog on first run. Visit `http://localhost:8000/` — you should
see `"demo_mode": true`. Interactive API docs are at
`http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env             # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Visit `http://localhost:5173`. If the backend isn't running, the Search and
AI Assistant pages fall back to local demo data automatically, so the UI is
still fully explorable.

---

## Configuring environment variables

### Backend (`backend/.env`)

| Variable | Purpose | Leave blank for |
|---|---|---|
| `DATABASE_URL` | Postgres/MySQL connection string | Demo mode (local SQLite) |
| `AI_API_KEY` | Key for your AI provider | Rule-based `MockAIProvider` |
| `AI_API_PROVIDER` / `AI_MODEL` | Which provider/model `RealAIProvider` calls | — |
| `PRODUCT_API_KEY` / `PRODUCT_API_BASE_URL` | An external product/e-commerce API (Phase 4) | Mock/database catalog only |
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API | Defaults to `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Where the backend is running. No secrets — this file is safe in the browser bundle. |

**Never** commit a real `.env` file. `.gitignore` already excludes `.env`
everywhere in this repo; only `.env.example` (placeholders) is tracked.

---

## Running the database

Nothing to install for local development — demo mode uses a SQLite file
created automatically on first run.

To use PostgreSQL instead:

1. Create a database, e.g. `createdb shopsmart`
2. Set `DATABASE_URL=postgresql://user:password@localhost:5432/shopsmart` in
   `backend/.env`
3. Restart the backend — tables are created and seeded automatically if
   empty (same seed data as demo mode, so you can move straight into the
   database without losing the sample catalog)

The database layer (`app/database/connection.py`) only cares about the
`DATABASE_URL` string, so this is the only change needed to move from
SQLite to Postgres/MySQL.

---

## Adding your AI API key

1. Get an API key from your AI provider (Anthropic by default)
2. Set `AI_API_KEY=your_key_here` in `backend/.env`
3. Restart the backend — it automatically switches from `MockAIProvider` to
   `RealAIProvider`

If the key is missing, invalid, or the API call fails, the backend falls
back to `MockAIProvider` automatically rather than breaking search or chat.

## Adding a product API key (Phase 4)

`app/services/product_service.py` has a real `ExternalAPIProvider` class
with the right interface, but it intentionally raises `NotImplementedError`
until you provide the API's docs/credentials — no fake integration is
pretending to be real. Once you do, implement its three methods
(`list_products`, `get_product`, `list_categories`) to call and normalize
that API's responses into the same `ProductOut` shape everything else in
the app already uses.

---

## Demo mode

The app is designed to always be explorable, even with nothing configured:

| Missing | Fallback |
|---|---|
| `DATABASE_URL` | Local SQLite file, auto-seeded with mock data |
| `AI_API_KEY` | Rule-based `MockAIProvider` (real extraction logic, no external call) |
| `PRODUCT_API_KEY` | Mock/database catalog only |
| Backend unreachable at all | Frontend falls back to local demo data in `src/data/demoFallback.js` |

---

## What remains to be implemented

Following the phased plan in the original brief:

- **Phase 4** — Real external product/e-commerce API integration
- **Phase 7** — Deeper recommendation tuning (current scoring is a
  transparent weighted-factor baseline, ready to extend)
- **Phase 9** — Full product comparison UI (route/page scaffolded, table
  logic not yet built)
- **Phase 8** — Real user auth (Profile/Wishlist currently use a placeholder
  demo user id)
- **Phase 10** — Automated tests, deployment configuration, production
  hardening (rate limiting, stricter input validation, logging)

---

## Notes on API key security

- API keys are **never** placed in React/frontend code or public JavaScript
- All secrets live in `backend/.env`, read only by the backend
- `.env` is gitignored everywhere in this repo; only `.env.example`
  (placeholders) is committed
- The frontend only ever talks to our own backend (`VITE_API_BASE_URL`),
  never directly to an AI or product API
