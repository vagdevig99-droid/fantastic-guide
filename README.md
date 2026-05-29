# Aria · agent-first banking demo

A clickable, demo-ready prototype showing what banking looks like when **one AI agent (Aria)** routes every customer intent — instead of menus, feature tiles, and chatbots. Built for an internal Accenture Song Commerce & Sales leadership pitch.

Two personas ship in the box:
- **Priya Sharma** · SME bakery owner · Pune
- **Arjun Mehta** · retail salaried customer · Bengaluru

The demo runs in two modes:
- **Scripted** · static frontend · no backend, no key, runs anywhere (open `index.html`)
- **Live** · same UI, real Claude API behind the scenes · backend handles the key, frontend never sees it

---

## Quickstart — scripted demo (30 seconds, no setup)

Just open the file in any modern browser:

```
output/demo-app/index.html
```

That's it. The app boots into Aria's hero screen, both personas work, all NBA flows are pre-scripted with realistic reasoning traces. **No API key required.**

This is what you use for offline pitches and most demo situations.

---

## Quickstart — live demo (5 minutes, real Claude API)

Same UI, but every chat reply is a real LLM call with real reasoning and tool routing. The audience can't tell the difference.

### 1 · Install Python dependencies

```bash
cd output/demo-app/backend
pip install -r requirements.txt
```

Requires **Python 3.10+**.

### 2 · Add your API key

```bash
cp .env.example .env
```

Edit `.env` and paste your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxx
MODEL=claude-haiku-4-5-20251001
PORT=8000
```

Get a key at <https://console.anthropic.com>. The Haiku model is cheap (~₹1/conversation); Sonnet 4.6 and Opus 4.7 also work.

### 3 · Start the server

```bash
python server.py
```

### 4 · Open the demo

<http://localhost:8000/>

Look at the top-right of the phone status bar — a **small green dot** confirms live mode is active. Type any message in the composer · Aria will respond with real reasoning, tool calls, and a streamed answer grounded in the persona's mock data.

If the server isn't running, the same URL won't work — but `output/demo-app/index.html` will still open and run in scripted mode.

---

## Security · how the API key is protected

- The key lives **only** in `output/demo-app/backend/.env` — never in frontend code, never in the browser
- The frontend calls `/api/chat/stream` on the backend; the backend makes the Anthropic call
- `.env` is gitignored (add the project-root `.gitignore` if cloning fresh)
- For hosted demos, you must keep the backend running — a static-only deploy (GitHub Pages, S3) cannot do live mode

---

## Project layout

```
agent-banking/
├─ README.md                  ← you are here
├─ .env.example               ← copy to .env at backend/ when going live
├─ CLAUDE.md                  ← project context for AI assistants
├─ output/
│  ├─ demo-app/               ← the live demo (frontend + optional backend)
│  │  ├─ index.html
│  │  ├─ app.js               ← state machine · stage runner · live SSE handler
│  │  ├─ scenarios.js         ← all persona data · 80+ stages · feature screens
│  │  ├─ styles.css           ← design system · 2 600+ lines
│  │  └─ backend/             ← optional FastAPI live mode (see backend/README.md)
│  │     ├─ server.py
│  │     ├─ agents.py
│  │     ├─ tools.py
│  │     ├─ data.py
│  │     ├─ .env.example
│  │     └─ README.md
│  ├─ TRAIN-THE-TRAINER.md    ← onboarding doc · architecture, agentic concepts, journeys
│  ├─ RUN-OF-SHOW.txt         ← 15-min demo script · click-by-click
│  ├─ DEMO-WALKTHROUGH.md     ← slide-by-slide presenter guide
│  ├─ PITCH-DECK.md           ← 5-slide pitch content
│  └─ CHAT-HISTORY.md         ← build log · how the app evolved across 80+ prompts
├─ resources/                 ← reference materials
└─ workflows/                 ← workflow recipes
```

---

## Where to read next

| If you want to… | Open |
|---|---|
| Understand the agentic model + extend it | `output/TRAIN-THE-TRAINER.md` |
| Present the demo to leadership (15-min run) | `output/RUN-OF-SHOW.txt` + `output/DEMO-WALKTHROUGH.md` |
| Edit slide content for the deck | `output/PITCH-DECK.md` |
| See how the app was built prompt-by-prompt | `output/CHAT-HISTORY.md` |
| Deep-dive the backend (tools, agents, model) | `output/demo-app/backend/README.md` |

---

## Deploying

**Static frontend only** (GitHub Pages / S3 / Netlify): scripted mode works · live mode does NOT (no backend to hold the key).

**Anywhere with Python + a domain** (Render / Fly.io / Railway / EC2): start `backend/server.py`, point a domain at it, and both modes work. The backend serves the static frontend at `/`, so a single deployment handles everything.

The cleanest approach for a hosted demo: pick any provider, set the `ANTHROPIC_API_KEY` env var in their dashboard (no `.env` file), and run `python output/demo-app/backend/server.py`.

---

## Tech stack

- Frontend · vanilla HTML/CSS/JS · no framework · no build step · open `index.html` and it works
- Backend · FastAPI + Anthropic SDK · SSE streaming · ~310 lines
- Persona data · Python dicts in `backend/data.py`
- Design system · 2 600+ lines of CSS, hand-rolled
- Mock LLM tools · 12 tool definitions in `backend/tools.py` (cash-flow analytics, AML rules, KFS engine, etc) returning realistic synthetic outputs

This is intentionally low-dependency so anyone reading the codebase can follow what's happening.

---

## License & attribution

Internal Accenture Song demo · not for external distribution without permission. Built with Claude Code.
