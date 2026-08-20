# MPDF Frontend — Multi-Perspective Decision Framework

React + TanStack Start frontend for the multi-agent debate platform.

## What's in here

- `/` — dashboard (KPIs, feature grid, how-it-works)
- `/start` — submit a decision, calls `POST /debate` on your backend, shows the result
- `/live` — animated demo page (uses mock data, no backend needed)
- `/history` — searchable table of past debates (mock data)
- `/settings`, `/about` — static pages

`src/lib/api.ts` is the **only** file that talks to your backend. Everything
else consumes typed data (`src/lib/types.ts`) and doesn't care where it came
from.

## Prerequisites

You need **Node.js 18+** (or Bun). Check what you have:

```bash
node -v
```

If that fails or shows something below v18, install Node first:
- Windows/Mac: download the LTS installer from https://nodejs.org
- Or install Bun instead (faster, optional): https://bun.sh

## 1. Install dependencies

In this folder, run:

```bash
npm install
```

(or `bun install` if you have Bun)

## 2. Set your backend URL

```bash
cp .env.example .env
```

Then open `.env` and point `VITE_API_BASE_URL` at wherever Kirti's FastAPI
server runs (default assumes `http://localhost:8000`).

## 3. Run it

```bash
npm run dev
```

(or `bun run dev`)

Open the URL the terminal prints — usually **http://localhost:8080**.

## What works without the backend running

`/`, `/live`, `/history`, `/about`, `/settings` all work immediately —
they use mock data in `src/lib/mock-data.ts`.

`/start` needs Kirti's FastAPI server running and reachable at the URL in
your `.env`, since clicking "Start Debate" does a real `fetch()` to
`POST {VITE_API_BASE_URL}/debate`. Until that endpoint exists, you'll see a
red error box — that's expected, not a bug.

## When Kirti's real API is ready

Her actual JSON response will probably not exactly match
`src/lib/types.ts` → `DebateResult`. Don't change every component — just
adjust the mapping inside `submitDebate()` in `src/lib/api.ts` so it returns
data shaped like `DebateResult`, and everything downstream keeps working.

## Build for production

```bash
npm run build
npm run start
```
