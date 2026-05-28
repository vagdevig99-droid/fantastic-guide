# Aria — intelligent banking agent

A banking experience built around a single AI agent. The customer opens the app, sees Aria appear, and from there everything else unfolds — a personalised dashboard with four navigable tabs (Today · Money · Plan · Offers · Aria), a multi-stage conversational flow when they tap Aria, and a traditional widget-based fallback view that's always one toggle away.

Three priority hotspots from the value-chain analysis are covered end-to-end:

- **Servicing & relationship** — payments, disputes, account questions
- **Sales & advisory** — loans, cards, next-best-action
- **Growth & marketplace** — partner offers, loyalty, ecosystem

Regulatory framing is woven into every page and reply: RBI Customer Liability Framework, PMLA monitoring, Digital Lending Guidelines, Account Aggregator consent, MITC / Key Fact Statement disclosure, FEMA Liberalised Remittance Scheme, NPCI tokenisation rails — referenced as substance, not compliance theatre.

---

## Opening the experience

### Scripted mode (default · works offline · no setup)

1. Open File Explorer and go to `output/demo-app/`.
2. Double-click **`index.html`**.
3. Maximise the browser window for the best look — the phone frame is centred against the aurora backdrop.

If the file opens as raw text, right-click `index.html` → **Open with → Chrome** (or Edge).

### Live agent mode (optional · real Claude calls)

To swap the scripted dialog tree for a real Claude-powered agent that classifies intent, calls tools (`get_held_payments`, `check_loan_eligibility`, `compare_credit_cards`, etc.) against mock banking data, and streams its reply — see **[backend/README.md](backend/README.md)** for the ~5-minute setup. Once the server is running, the "Live" pill in the header lights up and you can toggle modes from the header.

Hybrid by design — you can pitch using Scripted (zero risk, zero cost, offline) and demonstrate the real agentic substance using Live, all in the same app.

---

## How the screens fit together

### 1 · Intro splash (~1.8 seconds)

The orb rises in the centre of the dark stage, "Aria" fades up, then "your intelligent banking agent" follows. Auto-advances to the hero entry.

### 2 · Hero (Aria asks what you need)

A large centred orb, a personalised greeting that already references the customer's real state (balance, OD usage, dispute pending, etc.), three pill chips mapping to the priority hotspots, a free-text quickbox, and a small *"Skip to my dashboard →"* link.

- Tap a chip → opens the chat with the right specialist agent.
- Type freely → Aria pattern-matches and drops into the right stage.
- Tap *"Skip to my dashboard"* → lands on **Today** with the bottom tabbar revealed.

### 3 · Personalised pages (the dashboard)

Bottom tabbar with five tabs: **Today · Money · Aria · Plan · Offers**. The Aria tab opens the chat; the other four are navigable, persona-aware pages composed of typed content blocks:

- **alert** — priority items that deep-link into the chat ("Review with Aria →")
- **kpi** — headline numbers with deltas
- **insight** — Aria's observations about the customer
- **narrative** — short paragraphs from Aria
- **card** — rich product / transaction / Key Fact Statement cards (reuses the chat's card library)
- **chart** — mini bar visualisations
- **cta** — pill buttons that jump into the chat at a deep stage

Same page structure, completely different content for Priya vs. Arjun. The cards on Arjun's *Plan* page model his card-upgrade pre-approval; the same page for Priya shows a 6-month cash-flow forecast and an indicative SME loan.

### 4 · Chat (multi-stage conversation)

The Aria tab opens the conversation. Aria asks clarifying questions before delivering the detailed response — reasoning steps tick off, tool-use chips fade in, the routed specialist agent is named with a colored badge, the response streams word-by-word with rich cards and inline regulatory references.

### 5 · Classic view (the widget fallback)

Top-right header toggle (**Aria** ↔ **Classic**) flips to a familiar banking app screen: account balance cards, six-tile quick actions, recent transactions, five-item bottom navigation. A floating **"Ask Aria"** pill returns to the hero.

---

## Suggested walkthrough for a client pitch (~7 min)

### Opening (~20 sec)

> "Most banking apps put twelve features on the home screen and ask the customer to navigate. We've inverted that. The app opens with the agent."

### Beat 1 — Intro → hero (~30 sec)

The intro plays automatically.

> "That orb is Aria. She's the front door."

The hero settles. Read the greeting aloud.

> "Notice it isn't a generic welcome. Aria already knows her balance, her OD utilisation, that her last GST return was filed early. The conversation starts from context."

### Beat 2 — A multi-stage answer (Priya · ~2 min)

Tap **"Borrow for the bakery"**.

Aria asks: *"What's the financing for?"* → tap **"New equipment"** → Aria narrows again: *"Roughly how much, and how soon?"* → pick any.

Now Aria's full reasoning runs: cash-flow review, Account Aggregator consent flow, Key Fact Statement drafting. The **Sales & Advisory** badge slots in. The reply streams in with side-by-side options, Key Fact Statement breakdown, recommendation grounded in her seasonal cash dip, and an explicit AA consent ask.

> "Notice the Key Fact Statement format — that's the RBI Digital Lending Guidelines disclosure, served inline in plain language. And the consent is single-purpose, time-bound, revocable."

### Beat 3 — The personalised tabs (~2 min)

Tap the **Today** tab in the bottom bar.

> "This is what Aria has curated for Priya today — an alert on the held payment, today's cash position with the delta since yesterday, the GST insight, and a narrative on her monsoon dip. Same agent, structured presentation."

Tap the **Today** alert's *"Review with Aria →"* button → it deep-links straight into the held-payment dialog.

Back out via the tabbar. Tap **Plan**.

> "A 6-month cash-flow forecast with the monsoon dip visible, the pre-qualified SME Equipment Loan with the full Key Fact Statement, an offer to set up a call with her relationship banker. None of this required her to navigate."

Tap **Offers** to show MDR breakdown and partner offers; tap **Money** to show accounts with Aria's annotations on transactions.

### Beat 4 — Switch persona (~1.5 min)

Switch the top dropdown to **Arjun · Retail**. Intro plays again, hero greets Arjun.

Tap **Today** → his dispute alert, salary credit, dining-up-18% insight.
Tap **Plan** → spend-by-category chart, pre-approved Platinum Travel Card, subscription leakage insight.
Tap **Offers** → Taj Holiday Village deal, IndiGo points redemption, zero-FX forex card with FEMA LRS framing.

> "Same structure. Completely different content. Aria curates per customer."

### Beat 5 — Classic fallback (~30 sec)

Toggle **Classic** in the header.

> "For the customer who still prefers a dashboard, it's right here. Aria sits as a floating pill, ready when they want her."

Tap **Ask Aria** → returns to the hero.

### Close (~30 sec)

> "Three priority hotspots, surfaced through one conversation. A curated dashboard the customer never built. Every recommendation grounded in policy, every disclosure shown inline. And the traditional view is always one tap away."

---

## Customising what Aria says

All content lives in `scenarios.js`. To add a new intent, tweak a clarifying question, change a regulatory reference, or add a page block, edit:

- `PERSONAS` — name, tagline, greetings
- `CATEGORIES` — the three intent chips on the hero (per persona)
- `STAGES` — the dialog graph: `type: "clarify"` (with options that branch) or `type: "final"` (full reasoning + tools + rich response)
- `PERSONALISED_PAGES` — the four tab pages per persona, each a stack of typed blocks
- `CLASSIC_VIEW` — accounts, quick actions, transactions for the widget fallback

Block types supported by the page renderer:

| Type | Use for |
|---|---|
| `alert` | A priority item with a *Review with Aria →* button that deep-links into the chat at a stage ID |
| `kpi` | A headline number with delta and context |
| `insight` | Aria's observation about the customer |
| `narrative` | A short Aria paragraph |
| `chart` | A list of bars: `{ width, color, label }` |
| `card` | A passthrough — drop existing rich card HTML (`.card`, `.kfs`, `.pill`) directly |
| `cta` | A pill action that jumps to a chat stage |

Save, refresh the browser — no build step.

---

## Technical notes

- Single-page experience built on plain HTML, CSS, and JavaScript. No framework, no build step, no server.
- Runs entirely client-side. No external API calls. No network dependency.
- Phone-framed for presentation; collapses to full-screen on narrow displays.
- All regulatory references are factual and current as of 2025–26.

## Evolving this further

- Plug a real model (Claude / OpenAI) into the stage runner — the reasoning-trace + tool-chip + streaming UI already speaks the language of tool-using agents.
- Connect to an Account Aggregator simulator for live consent.
- Add a fourth persona around **Origination & onboarding** (Rank #4 hotspot) once the first three land.
- Wire the mic button to the Web Speech API for true voice input.
- Persist intro-played state in `sessionStorage` so the splash only runs once per session.
