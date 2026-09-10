# Multi-Perspective Decision Framework

An enterprise-grade, distributed multi-agent debate platform that automates multi-perspective decision-making using independent asynchronous workers, event-driven queues, and custom consensus-scoring algorithms.

---

## 📋 Table of Contents

- [Project Architecture](#project-architecture)
- [What's Been Implemented](#whats-been-implemented)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [License](#license)

---

## 🏗️ Project Architecture

This is a modular, distributed system composed of:

- **Frontend** — React + TanStack Start UI for debate submission and result visualization
- **Backend Core** — Central orchestration and message handling
- **API Service** — RESTful API gateway for client communication
- **Model Personas** — Independent agent implementations with distinct perspectives
- **Consensus Engine** — Scoring and decision-making algorithms

---

## ✅ What's Been Implemented

### Frontend (React + TanStack Start)
- ✅ **Dashboard** — Overview with KPIs, feature grid, and how-it-works section
- ✅ **Submit Debate** (`/start`) — Form to submit decisions, integrates with backend via `POST /debate`
- ✅ **Live Demo** (`/live`) — Animated demonstration with mock data (no backend required)
- ✅ **Debate History** (`/history`) — Searchable table of past debates with mock data
- ✅ **Settings & About** (`/settings`, `/about`) — Static documentation pages
- ✅ **TypeScript Support** — Full type safety with `src/lib/types.ts`
- ✅ **Centralized API Integration** — Backend communication via `src/lib/api.ts`
- ✅ **Development Server** — Hot reload via Vite

### Backend Modules (Scaffolding)
- ✅ **Backend Core** — Directory structure for core orchestration logic
- ✅ **API Service** — Directory structure for RESTful API endpoints
- ✅ **Model Personas** — Directory structure for agent implementations
- ✅ **Consensus Engine** — Directory structure for consensus algorithms
- ✅ **Docker Compose** — Multi-container orchestration configuration file

### Shared Infrastructure
- ✅ **Git Configuration** — `.gitignore` for Node, Python, and build artifacts
- ✅ **MIT License** — Open-source licensing
- ✅ **Repository Structure** — Organized mono-repo layout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | TypeScript (95.7%), React, TanStack Start, Vite, CSS (4.3%) |
| **Backend** | Node.js, TypeScript (planned) |
| **Infrastructure** | Docker, Docker Compose |
| **API** | REST |
| **Package Manager** | npm (Node 18+) or Bun |

---

## 📁 Project Structure

```
Multi-Perspective-Decision-Framework/
├── frontend/                   # React + TanStack Start UI
│   ├── src/                   # Source code
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── README.md
├── backend-core/              # Core orchestration logic (scaffolding)
├── api-service/               # REST API gateway (scaffolding)
├── model-persona/             # Agent implementations (scaffolding)
├── consensus-engine/          # Consensus algorithms (scaffolding)
├── docker-compose.yml         # Multi-container orchestration
├── LICENSE                    # MIT License
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun**

Check your Node version:
```bash
node -v
```

If you don't have Node 18+, download the LTS installer from [nodejs.org](https://nodejs.org), or install [Bun](https://bun.sh) for a faster alternative.

### 1. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
# or
bun install
```

### 2. Configure Backend URL

Copy the environment template:

```bash
cp .env.example .env
```

Then edit `.env` and set `VITE_API_BASE_URL` to your backend server (default: `http://localhost:8000`).

### 3. Run the Frontend

```bash
npm run dev
# or
bun run dev
```

Open your browser to the URL printed in the terminal (usually **http://localhost:8080**).

---

## 💻 Development

### What Works Without a Backend

These pages use mock data and don't require the backend server:
- `/` — Dashboard
- `/live` — Live demo
- `/history` — Debate history
- `/about` — About page
- `/settings` — Settings page

### What Requires the Backend

- `/start` — The debate submission form requires the backend API running at the URL in your `.env` file.

When you click "Start Debate", the frontend makes a `fetch()` request to `POST {VITE_API_BASE_URL}/debate`. Until the backend is running, you'll see a red error box—this is expected.

### Type-Safe Integration

The API integration is centralized in `src/lib/api.ts`. All data is consumed by components via typed interfaces in `src/lib/types.ts`, so components don't need to know about the backend's actual response format.

When the backend API is ready, adjust only the mapping inside `submitDebate()` in `src/lib/api.ts` to match the backend's response shape. Everything downstream will continue to work.

### Building for Production

```bash
npm run build
npm run start
# or
bun run build
bun start
```

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

This is an active development project. Backend modules are scaffolded and ready for implementation. Contributions are welcome!

---

**Last Updated:** September 2026  
**Repository:** [github.com/Kinzalune/Multi-Perspective-Decision-Framework](https://github.com/Kinzalune/Multi-Perspective-Decision-Framework)
