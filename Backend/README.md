# Backend — Live agent mode

This folder is **optional**. The banking experience works fully without it (Scripted mode is the default and runs offline by double-clicking `index.html`).

When you want to demonstrate the **real agentic experience** — Claude doing the routing, calling tools, streaming a generated response — start this server, paste your API key into `.env`, and a green "Live" pill lights up in the app header.

---

## What it does

```
   User types a message in the chat
        │
        ▼
   POST /api/chat/stream
        │
        ▼
   ┌───────────────────────────────┐
   │  Front-door (Haiku)           │  classifies → servicing / sales / growth / general
   │  emits: routing decision      │
   └────────────┬──────────────────┘
                ▼
   ┌───────────────────────────────┐
   │  Specialist agent (Claude)    │  system prompt + curated tool list
   │  - calls tools as needed      │  e.g. get_held_payments, check_loan_eligibility,
   │  - reads mock persona data    │       compare_credit_cards, list_partner_offers
   │  - streams the final response │       …a dozen tools total across the 3 specialists
   └───────────────────────────────┘
                │
                ▼
   Server-Sent Events back to the browser:
        reasoning → route → tool_call → tool_result → text deltas → done
```

The frontend renders these events using the same UI components used by the scripted mode (reasoning steps tick off, tool chips fade in, route badge appears, response streams into a bubble). The visual story is identical — the substance is generated.

---

## Setup (one time, ~5 minutes)

### 1. Get an Anthropic API key

1. Sign up at **https://console.anthropic.com/**
2. Add a few dollars of credit (new accounts often get ~$5 free).
3. Create an API key under *Settings → API Keys*.

### 2. Install Python (if you don't have it)

You need Python 3.10 or later. Check:

```powershell
python --version
```

If not installed, grab it from **https://python.org/downloads/** — tick *"Add Python to PATH"* during install.

### 3. Install dependencies

Open PowerShell, navigate to this folder, and run:

```powershell
cd "C:\Users\gandhala.vagdevi\OneDrive - Accenture\Documents\agent-banking\output\demo-app\backend"
pip install -r requirements.txt
```

### 4. Paste your key

In this folder there's a file called `.env.example`. Copy it to `.env`:

```powershell
copy .env.example .env
```

Open `.env` in Notepad and replace `sk-ant-...` with your real key.

### 5. Start the server

```powershell
python server.py
```

You should see something like:

```
────────────────────────────────────────────────────────────
 Aria · live agent backend
────────────────────────────────────────────────────────────
 Key configured : yes
 Model          : claude-haiku-4-5-20251001
 UI             : http://localhost:8000/
 Health         : http://localhost:8000/api/health
────────────────────────────────────────────────────────────
```

### 6. Open the app

Two options:

- **Recommended:** open **http://localhost:8000/** in your browser. The server serves the same UI.
- **Alternative:** double-click `index.html` as before. Same result; CORS is open.

The "Live" pill in the top header should now be enabled (it glows teal). Tap it to switch from Scripted to Live mode. Type in the chat — your text now goes through real Claude.

To stop the server, press **Ctrl+C** in the PowerShell window.

---

## Switching between modes

- **Scripted** (default) — runs entirely offline, deterministic, costs nothing. Use this for live client pitches where you can't risk a network blip.
- **Live** — real Claude, real tool use, real reasoning. Costs ~₹2–15 per conversation depending on model. Use this when demonstrating the genuine agentic capability.

The toggle is in the top-right of the header. It's only clickable when the server is running with a key configured; otherwise it's greyed.

Hero chips and personalised-page CTA buttons (alerts, "Open with Aria") will use whichever mode is currently active.

---

## Cost & model

The `.env` file lets you pick the model:

| Model | Cost (rough)         | When to use |
|-------|----------------------|-------------|
| `claude-haiku-4-5-20251001` | ~₹1 per conversation | Default — fast and capable for tool use |
| `claude-sonnet-4-6`         | ~₹5–15 per conversation | Richer reasoning, longer narratives |
| `claude-opus-4-7`           | ~₹40+ per conversation | Overkill for this demo, but works |

Edit `MODEL=...` in `.env` and restart the server to switch.

---

## What the agents can do

| Specialist | Tools available |
|---|---|
| **Servicing** | `get_account_balance`, `get_recent_transactions`, `get_held_payments`, `release_held_payment`, `raise_dispute_case`, `block_card` |
| **Sales & Advisory** | `get_account_balance`, `get_recent_transactions`, `check_loan_eligibility`, `draft_key_fact_statement`, `compare_credit_cards`, `get_spend_breakdown` |
| **Growth & Marketplace** | `get_account_balance`, `get_recent_transactions`, `get_mdr_analysis`, `list_partner_offers`, `get_loyalty_balance`, `get_spend_breakdown` |

Tools read from mock data in `data.py` — you can edit the personas there to add accounts, transactions, offers, etc., and the live agent will see your changes immediately (no restart needed for data changes if you restart the server).

---

## Troubleshooting

**"Server has no ANTHROPIC_API_KEY configured."**
→ The `.env` file isn't being picked up. Make sure it's in the `backend/` folder, not the parent. Check there are no quotes around your key.

**The Live pill stays greyed even after starting the server.**
→ Reload the page (Ctrl+F5). The app pings the server only on page load.

**"I couldn't reach the live agent" appears in the chat.**
→ The server stopped. Restart it with `python server.py`. Or switch to Scripted in the header.

**"401 Unauthorized" error in the server console.**
→ The API key is wrong or expired. Generate a new one at console.anthropic.com.

**Costs higher than expected.**
→ Switch `MODEL=claude-haiku-4-5-20251001` in `.env`. Haiku is ~10× cheaper than Sonnet.

---

## Files in this folder

- `server.py` — FastAPI app + SSE endpoint + static-file serving
- `agents.py` — system prompts for the four agent roles
- `tools.py` — Python implementations of every tool + the registry
- `data.py` — mock banking data for Priya & Arjun
- `.env.example` — template you copy to `.env` and fill in
- `requirements.txt` — Python dependencies
