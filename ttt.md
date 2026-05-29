# Train-the-Trainer · Aria · Agent-First Banking Demo

A walkthrough for anyone who needs to **demo, extend, or rebuild** this app. Treats the reader as competent but new to the project. No build step, no framework — read it, run it, change it.

---

## 1 · What this app is

A clickable, demo-ready prototype of an **agent-first banking experience**. Instead of menus and feature tiles, the customer talks to one AI agent — **Aria** — who routes intent, pulls real context, hands off to specialists, and orchestrates execution.

Two personas ship in the box:

- **Priya Sharma** · SME bakery owner · Pune · current account ₹8.42L · OD 39 % used
- **Arjun Mehta** · salaried retail customer · Bengaluru · salary ₹2.05 L / mo · CIBIL 812

The app is built for a **15-minute internal Accenture Song Commerce & Sales leadership pitch**. Five slides + an 8-minute live walk + Q&A. The demo runs offline; a FastAPI live mode exists but is invisible to the audience.

---

## 2 · The vision

> **There are no "features". There is one AI agent that decides which capability to invoke.**

Inspired by Revolut Air's "the agent is the front door" pattern. The customer never sees a feature catalogue; they see Aria. Aria sees intent, context, and constraints. The bank's specialists work *behind* the agent — they're routed to, not browsed.

Three priority hotspots scoped into Commerce & Sales (the Song vertical that owns this build):

1. Distribution, Sales & Advisory
2. Growth, Loyalty & Ecosystem Expansion
3. Origination & Onboarding

(Servicing was rank #1 in our methodology pass but lives in Song *Service* — deliberately out of scope for this POC.)

---

## 3 · Architecture at a glance

Four files do all the work:

| File | Owns |
|---|---|
| `output/demo-app/index.html` | Phone frame · 6 screens · status bar · header · nav tabs · composer |
| `output/demo-app/scenarios.js` | All persona data · 80+ chat stages · feature screens · NBA cards · active-plan registry |
| `output/demo-app/app.js` | Stage runner · screen routing · reasoning animation · block renderers · state |
| `output/demo-app/styles.css` | Visual system · 2 600+ lines of CSS · all components |

No build step. No framework. Open `index.html` in any browser and it works.

**Optional live mode** lives in `output/demo-app/backend/`:
- `server.py` — FastAPI with SSE streaming endpoint
- `agents.py` — front-door classifier + 4 specialist system prompts
- `tools.py` — 12-tool registry (Cash-flow analytics, AML rules, KFS engine…)
- `data.py` — mock persona data

If a key is set in `.env` and the backend is running, the app silently flips to live LLM calls — same UI, real reasoning. The audience can't tell the difference, which is the point.

---

## 4 · The agentic model

### One front-door + four specialists

```
                       customer message
                              ↓
                            Aria
                  (intent classifier · front door)
                              ↓
        ┌────────────┬────────────┬────────────┐
        ↓            ↓            ↓            ↓
  Servicing   Sales & Advisory  Growth &     Origination
                                Marketplace
```

Each specialist owns a *capability*, not a feature:
- **Servicing** · disputes, holds, lost cards, statements
- **Sales & Advisory** · loans, KFS, advice, NBA (next-best-action)
- **Growth & Marketplace** · partner offers, MDR optimisation, supplier financing, trips
- **Origination** · pre-approval, KYC, CIBIL, KFS, audit trail

The customer never picks who to talk to. Aria reads the message, names the specialist via a **route badge**, and the matching tool chips fade in.

### Why this beats menus

Three artefacts visible on every reply that traditional banking apps don't show:
- **Reasoning trace** — Aria thinking aloud, citing real numbers from the customer's own data
- **Tool chips** — every tool actually called, named (e.g. "Spend categoriser", "AA consent", "KFS engine")
- **Route badge** — the specialist who took over (colour-coded per agent)

This is the agentic signature. Strip these three off and you're back to chatbot.

---

## 5 · Core concepts (with examples)

### 5.1 Reasoning trace

When Aria works, she thinks visibly:

```
✓ Reading your last 4 salary credits · ₹1.85L → ₹1.85L → ₹1.85L → ₹2.05L (10.8% bump on 2 May)
✓ Checking your current SIP utilisation · ₹15K/mo · ₹2.18L corpus
✓ Pulling your term-life cover · ₹50L policy · Aditi as nominee
✓ Modelling 3 allocation options against your 20-year trajectory
```

Each line is a tick that animates in. Data comes from the persona file. No hallucinated numbers.

### 5.2 Tool chips

Below the reasoning, chips fade in showing the *tools* Aria called:

```
💰 Income pattern    📊 SIP planner    🛡 Insurance gap analyser
```

Each chip = one real backend tool. Lets the customer (and the regulator) know which systems were touched.

### 5.3 Route badge

A pill below the chips: *"Sales & Advisory Agent · Salary increment · allocation options"*. The specialist name + the routing reason. Colour-coded:

- **Teal** · Servicing
- **Violet** · Sales & Advisory
- **Amber** · Growth & Marketplace
- **Indigo** · Origination
- **Grey** · Aria (front door, when she handles it herself)

### 5.4 Lever badges (value-tree attribution)

Every NBA card on Today carries a small pill like *"✶ Sales & Advisory · Improve lead conversion"*. This ties the suggestion back to a *row on the value tree* — so when reviewers ask "which capability does this prove", you point at the badge.

The lever registry lives in `app.js` (`const LEVERS = { ... }`). Each NBA card lists `levers: ["sales-nba"]` etc.

### 5.5 Autonomy ladder L1–L4

How much agency Aria has, on a per-action basis:

| Level | Meaning | Example |
|---|---|---|
| L1 | Observe | "Auto-categorised 14 vendor payments" — bookkeeping only |
| L2 | Prepare | "Drafted 3 vendor chases (gentle tone)" — written but not sent |
| L3 | Act within rules | "GSTR-1 auto-filed" — within a pre-approved standing rule |
| L4 | Autonomous + reversible | "Refused 1 suspect merchant token" — acted unilaterally, customer can reverse |

Every overnight receipt on Priya's Today carries an L-tag so you can defend the autonomy boundary.

### 5.6 Standing rules + overnight receipts

The "Done overnight while you slept" block on Priya's Today lists 5 actions Aria took within her standing rules: GSTR-1 filing, categorisation, chase drafts, token refusal, settled payment. Each is timestamped, labelled with its L-level, and reversible if applicable.

This is the receipt for trust. The customer wakes up to a list of what was done and why — not surprises.

### 5.7 Active plans + Today-tab tracker

The agentic *execution* layer. When the customer picks "Go with Option 3 — Split 50/50" on the salary-bump screen, Aria doesn't just acknowledge — she activates a tracked plan:

```
Salary raise allocation · Active
Balanced plan · ₹20K/mo · split 50/50
─────────────────────────────────────
✓ SIP top-up · ₹15K → ₹16.5K/mo    Active · starts 5 June
◐ Term-life top-up · target ₹1Cr   Shortlist by 6 PM
◐ Cash-flow buffer · ~₹8,100/mo    Monitoring · healthy
◐ 60-day review                    Scheduled · 21 July

[View receipt]
```

This card lives on Today and persists for the session. Other action CTAs across the app (Accept disbursal, Apply for Platinum Travel, Book Taj, Pre-fill release form) all upgrade their state into a matching tracker.

Active-plan registry is in `scenarios.js` as `ACTIVE_PLANS`. Keys are persona-prefixed (`arjun:salary-3-approved`, `priya:release`, etc).

### 5.8 Handled-triggers collapse

When an NBA card on Today has been acted on (its `handledByPlans` matches an active plan), it disappears from the live flow and collapses into a small **"Handled triggers (N) ▾"** row at the bottom of Today. Expand the row → see the faded original NBA with a *"✓ Handled · see tracker above"* footer.

This makes the agentic story compound: triggers turn into missions, which turn into trackers, while old triggers gracefully step aside.

---

## 6 · The two personas in one page

|  | **Priya Sharma** | **Arjun Mehta** |
|---|---|---|
| Role | Owner · Sunrise Bakery, Pune | Salaried · Bengaluru |
| Type | SME | Retail |
| Cash position | ₹8,42,650 (current acct •• 4421) | ₹3,12,480 savings (•• 7731) |
| Credit | OD ₹3 L · 39 % used | CIBIL 812 prime+ · pre-approved loans |
| Lifecycle moment (NBA) | ₹4.80 L Mehta Flour payment on hold (AML 2.3× variance) | Salary increment ₹20K/mo · car-buying intent (Honda City) |
| Standing rules | 7 active (GSTR, vendor chases, payroll, fraud guard…) | Lighter set · subscription leak detector, statement reminders |
| Specialist most used in their demo | Servicing (release flow), Growth (MDR), Sales (loans) | Sales & Advisory (salary plan, card upgrade), Origination (car loan) |

The persona-switcher in the header (SME / Retail) flips between them in real time. State (active plans, completed stages) is per-session, so you can switch back and forth in a demo and not lose context.

---

## 7 · The major journeys (showcase tour)

### 7.1 Arjun · salary-increment allocation (the showcase)

**Trigger** · Gold NBA card on Today: *"₹20K salary increment landed — let's allocate it intentionally"*

**Journey**:
1. Tap *"Walk me through the 3 options"* on the gold NBA
2. Reasoning trace + 4 tool chips + Sales & Advisory route badge stream in
3. Response: 3 KFS-style option cards — Bump SIP / Top-up Term-life / Split 50/50 (recommended)
4. Tap *"Go with Option 3 — Split 50/50"* → reasoning trace fires + one-line ack streams in
5. Auto-navigation to **Today** · tracker card *"Salary raise allocation · Active"* pulses into view at the top
6. Status pills animate: SIP "Active · starts 5 June" (teal pulse), Term-life "Shortlist by 6 PM" (violet shimmer), Buffer "Monitoring · healthy" (teal pulse), Review "Scheduled · 21 July" (static)

**What makes it agentic**: the journey doesn't end with the recommendation. The selection turns into a *mission* the customer can watch, with statuses, monitoring, and a 60-day review baked in.

Stage IDs · `a-growth-salary-bump-final` (the 3-option screen) → `a-salary-plan-1/2/3` (the auto-tracker stages) → `a-salary-approved-sip` (receipt detour).

### 7.2 Arjun · car-buying workspace

**Trigger** · Violet NBA card on Today: *"Looking at used cars? I found the Honda City you viewed and 4 similar cars…"*

**Journey** · 6 screens, not 12:

1. **Today** · tap *"Open car workspace"*
2. **Feature screen `carbuy-market`** (the marketplace) · buying-setup header (EMI band, pre-approval, trade-in, location) + 7 filter chips + 5 car cards (Honda City *recommended* · Maruti Ciaz · Hyundai Verna · VW Vento · Toyota Yaris). Each card carries pre-computed EMI, after-trade-in price, inspection grade
3. **Feature screen `carbuy-deal-honda`** (deal room) · reconciled cost stack (₹9.80L − ₹4.92L trade-in = ₹4.88L net · ₹5L loan · 9.85% · ₹16,100 EMI · 36 months) + 5 car-detail rows + Aria's note + 4 action buttons
4. **Chat stage `a-carbuy-finance-pick`** · 3 financing options collapsed into ONE comparison card (recommended pre-highlighted)
5. **Chat stage `a-carbuy-approve`** · consolidated verification checklist + KFS in one streamed response (numbers reconcile across the whole journey — no ₹12L mystery)
6. **Today tracker** · *"Honda City purchase"* card with 8 status rows: car selected, loan pre-approved, KFS sent, trade-in pending, test drive, dealer payment, RC transfer, first EMI

**What makes it agentic**: Aria runs the **car-buying mission**, not the loan funnel. Marketplace knows your EMI band before you scroll. Numbers reconcile. The tracker tracks the *purchase*, not the disbursal.

Stage IDs · `a-carbuy-q1` (legacy fallback) · feature screens `carbuy-market` + `carbuy-deal-honda` · `a-carbuy-finance-pick` · `a-carbuy-approve` · `a-orig-disbursal-active` (activates the tracker).

### 7.3 Arjun · servicing (card help)

**Entry** · NBA card *"Dispute on ₹3,499 charge is still under review"* OR free-typed "I need help with my card" routes to `a-serv-q1`.

**Three sub-paths**:
- *"A charge I don't recognise"* → `a-serv-q2` (charge confirmation) → `a-serv-final` (full dispute flow: customer liability framework + block + chargeback + reissue + provisional credit)
- *"My card is lost / stolen"* → `a-serv-final-lost` (temporary block + replacement decision)
- *"Something about my statement"* → `a-serv-statement-q1` (clarify · 4 self-serve options) → View / Insights / Print / Email leaves · all with back-navigation

The **statement self-serve** sub-flow is the one most often demoed alongside salary-bump because it shows Aria handling something that *would* be human-routed in a normal bank.

### 7.4 Priya · held-payment release

**Trigger** · Red alert on Priya's Today: *"Your transfer to Mehta Flour Mills is on hold"*

**Journey**:
1. Tap *"Review with Aria"* on the alert
2. Servicing agent picks up · reasoning trace explains PMLA threshold variance (2.3× typical vendor payment)
3. Offers two clean options · *Quick release* (self-attest + invoice) or *Compliance review* (human officer, 1 working-day SLA)
4. Tap one → auto-tracker activates (`priya:release` or `priya:compliance`)
5. Today shows the *Mehta Flour payment · release* tracker with status rows

**What makes it agentic**: the hold isn't a generic "your payment failed" — it's a fully reasoned explanation backed by your own transaction history, with two compliant exits.

### 7.5 Priya · borrow (SME loan), MDR optimisation, supplier financing

- **`p-sales-q1`** → equipment / working capital / expansion sizing → KFS card with two options + AA consent ask
- **`p-growth-q1`** → MDR optimisation (Pine Labs vs Mswipe partner offers, ~₹18.6 K annual saving) · banking fees · TReDS supplier financing
- All terminate in trackers and have back-nav to the parent menu

---

## 8 · Key files cheat-sheet

```
output/demo-app/
├─ index.html                Phone frame · status bar · 6 screens · nav tabs
├─ app.js                    Stage runner · screen routing · all renderers
├─ scenarios.js              All persona data · stages · feature screens · trackers
├─ styles.css                ~2 600 lines · design system · components
└─ backend/                  Optional FastAPI live mode
   ├─ server.py
   ├─ agents.py
   ├─ tools.py
   └─ data.py

output/                      Pitch artefacts (live alongside the demo app)
├─ TRAIN-THE-TRAINER.md      This file
├─ CHAT-HISTORY.md           Prompt-by-prompt build log
├─ RUN-OF-SHOW.txt           15-min demo script
├─ DEMO-WALKTHROUGH.md       Slide-by-slide presenter guide
└─ PITCH-DECK.md             Slide content
```

**Where to edit what:**

| You want to… | Open | Look for |
|---|---|---|
| Change a persona greeting | `scenarios.js` | `PERSONAS.<id>.homeGreeting` |
| Tweak an NBA card | `scenarios.js` | `PERSONALISED_PAGES.<persona>.today.blocks[]` |
| Add a chat stage | `scenarios.js` | `STAGES` object · use existing stages as templates |
| Add a feature screen | `scenarios.js` | `FEATURE_SCREENS.<persona>.<feature-id>` |
| Add a new active plan | `scenarios.js` | `ACTIVE_PLANS` registry + wire `STAGE_TO_PLAN` in `app.js` |
| Change a block renderer | `app.js` | `renderBlock<Type>` functions |
| Adjust colours / spacing | `styles.css` | `:root { --violet, --teal, --bg-0, ... }` |
| Adjust the phone shell | `styles.css` line ~85 | `.phone { width, height }` + media query |
| Edit the run-of-show | `RUN-OF-SHOW.txt` | Numbered steps |

---

## 9 · How to demo it · 15-minute run-of-show

| Time | Slide | What you say / do |
|---|---|---|
| 0:00 – 2:00 | Slide 1-3 | The methodology hook · "We mapped the banking value tree, scored 50 use-cases, picked 3 hotspots inside Commerce & Sales scope" |
| 2:00 – 3:00 | Phase 1 | Open Arjun's Today · point at the gold + violet NBA cards · "Two trigger-based outreaches, not notifications" |
| 3:00 – 5:00 | Phase 2 | Tap salary NBA · show reasoning trace + tool chips + Sales & Advisory route badge · 3-option card |
| 5:00 – 8:00 | Phase 3 | Tap "Go with Option 3" · auto-nav to Today · tracker pulses in · "Same engine just turned the decision into a mission" |
| 8:00 – 10:00 | Phase 4 | Switch persona to Priya · show her Today (held payment + overnight receipts) · "Same engine, different customer, autonomy ladder visible" |
| 10:00 – 11:00 | Phase 5 | Open car NBA · show marketplace + deal room · "Aria runs the *purchase*, not just the loan" |
| 11:00 – 12:00 | Slide 4 | Close with the tree-with-ticks — every screen attributes back to a row on the value tree |
| 12:00 – 12:30 | Slide 5 | Decision and path forward |
| 12:30 – 15:00 | Q&A |  |

The full run-of-show is in `RUN-OF-SHOW.txt` with click-by-click instructions and what to say at each step.

---

## 10 · How to extend it

### Add a new chat stage

In `scenarios.js`, drop into the `STAGES` object:

```js
"a-newflow-q1": {
  type: "clarify",                  // or "final"
  agent: "Aria",                    // route badge name
  routingReason: "Narrowing intent",
  thinking: [
    "Reading the customer's last 3 messages",
    "Checking standing rules"
  ],
  tools: [
    { icon: "🔍", label: "Intent classifier" }
  ],
  responseHtml: `<p>What kind of thing did you have in mind?</p>`,
  options: [                        // shown as bottom pills
    { label: "Option A", goTo: "a-newflow-final-a" },
    { label: "Option B", goTo: "a-newflow-final-b" },
    { label: "Back to home", goTo: "a-serv-q1" }
  ],
},
```

Stage IDs follow `<persona>-<area>-<step>`: `a-serv-q1`, `p-sales-final-eq`, etc.

### Add a new feature screen

In `scenarios.js`, `FEATURE_SCREENS.<persona>.<feature-id>`:

```js
"new-feature": {
  title: "My new workspace",
  subtitle: "Subtitle text",
  blocks: [
    { type: "summary", label: "Cash position", value: "₹8,42,650", tone: "up" },
    { type: "divider", label: "Section" },
    { type: "row", icon: "💰", title: "Row title", sub: "Description", pill: { text: "Status", tone: "primary" } },
    { type: "note", body: "Compliance footnote" }
  ],
  primaryAction: { label: "Do the thing", openStage: "a-newflow-q1" },
}
```

To open it: `openFeature("new-feature")` from app.js, or set `openFeature: "new-feature"` on an NBA card.

### Add a new active plan

Two steps:

1. **`scenarios.js`** · add an entry to `ACTIVE_PLANS`:
   ```js
   "arjun:my-new-plan": {
     type: "active-plan",
     title: "My new plan",
     statusPill: "Active",
     selectedSummary: "One-line summary",
     rows: [
       { label: "Step 1", status: "Done",                tone: "ok" },
       { label: "Step 2", status: "In progress",         tone: "info" },
       { label: "Step 3", status: "Scheduled · 30 days", tone: "neutral" }
     ],
     primaryAction: { label: "View details", openStage: "a-my-plan-receipt" }
   }
   ```
2. **`app.js`** · wire the activation in `STAGE_TO_PLAN`:
   ```js
   const STAGE_TO_PLAN = {
     ...,
     "a-my-plan-activator": "arjun:my-new-plan"
   };
   ```

When the customer lands on `a-my-plan-activator` (a `final` stage with `autoOpenTracker: true`), the plan is added to `state.activePlans` and the tracker card appears on Today.

### Add a new persona

1. Add to `PERSONAS` in `scenarios.js` with `name`, `tagline`, `avatar`, `homeGreeting`, `tabBarLabels`
2. Add a Today block list in `PERSONALISED_PAGES.<new-id>.today`
3. Add chat stages under a new prefix (e.g. `n-` for new persona)
4. Add an option to the `#personaSelect` dropdown in `index.html`

---

## 11 · Design principles we landed on

These emerged during iteration. Worth knowing because they shape why screens look the way they do.

### Agentic in execution, not just discovery

Detecting a moment, pulling context, and recommending an option is the *easy* part. The agentic feel comes from what happens *after* the customer picks: the decision turns into a tracked mission with statuses, monitoring, and a review date. Don't end on a chat bubble; end on a tracker.

### Reduce friction at decision moments

Originally the salary-bump flow had: option card → in-motion card → approval confirm → "done" ack → "view tracker". Five taps. We collapsed it to: option card → reasoning trace + one-line ack → auto-nav to tracker. Two taps. The trust isn't in the consent screens; it's in the *receipt* (which is still reachable from the tracker as "View receipt").

### Honest language

If something isn't done, say "prepared", "queued", "comparing", "scheduled". Never "closed" until the policy is actually issued. The earlier version of the term-life card said *"Aditi's coverage gap closed · Yes"* before any policy was bound — we fixed it to *"Cover gap addressed · ~40 % (pending issuance)"*.

### Numbers reconcile across the whole journey

Car listed ₹9.80L, trade-in ₹4.92L, net ₹4.88L, loan ₹5L, EMI ₹16,100 over 36 months. Every screen shows numbers that derive from the same source. The earlier KFS card was showing ₹12L loan / 60 months / ₹20,950 EMI for the same car — broke trust instantly. Fixed.

### Tracker as the source of truth

After a customer kicks off a plan, the Today tracker becomes the canonical view. The NBA card that triggered it collapses into "Handled triggers". The chat stages that built up to it are still reachable but no longer the live story.

### Triggers collapse when acted on

Don't leave a gold NBA *"₹20K salary increment landed"* on the dashboard after the customer has already allocated it. Surface it once, let the action consume it, and tuck the audit trail away.

### One specialist per moment

The route badge changes colour when handing off (e.g. Sales → Origination at the "Accept · proceed to disbursal" moment). That handoff is the demo's punchline for orchestration. Make sure every meaningful transition shows the badge change.

### Standing rules + receipts = trust

L1–L4 isn't just a slide; it's printed on every overnight receipt on Priya's Today. The customer wakes up to a receipt, not a surprise. This is how autonomy becomes safe.

---

## 12 · What's intentionally out of scope

| Item | Why |
|---|---|
| Relationship-manager (RM) journeys | Song *Service* vertical · our scope is Song *Commerce & Sales* |
| Real CIBIL / CKYC integrations | POC demo · live mode mocks the responses |
| Regulator-grade audit storage | Would need QLDB or similar in production |
| Production model orchestration (LangGraph, etc) | Out of scope for an internal pitch |
| Compliance ring before outbound action | Would be a real-world add (~3 months work) |
| Multi-language | Demo is English; copy is one of the cheapest things to localise post-demo |
| Real-time collaboration | Not relevant to the agentic banking thesis |
| Push notifications · SMS · email | Acknowledged in copy ("I'll text you the case ID") but not wired |

---

## Appendix · jargon cheat-sheet (one-liners)

- **NBA card** — Next-Best-Action card on Today · trigger-detected
- **KFS** — Key Fact Statement · RBI Digital Lending Guidelines required format
- **MITC** — Most Important Terms & Conditions · cards
- **PMLA** — Prevention of Money Laundering Act · drives AML thresholds
- **AA / Account Aggregator** — RBI-licensed framework for consented data sharing
- **PSL** — Pre-Sanctioned Loan · the pre-approved relationship-rate loan
- **LRS** — Liberalised Remittance Scheme · FEMA limit on forex remittance per FY
- **L1–L4** — Aria's autonomy ladder · Observe → Prepare → Act-within-rules → Autonomous-with-reversibility
- **Lever** — a row on the value tree · what business outcome a feature attributes to (e.g. *"Improve lead conversion"*)
- **Route badge** — the pill that names the specialist agent who took over the reply

---

*End · for the prompt-by-prompt build log of how this app evolved, see `CHAT-HISTORY.md`.*
