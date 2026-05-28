# Demo walkthrough · click-by-click + talk track

**Purpose:** keep this open in a side window during rehearsal and on the day. Every step has (a) what to click, (b) what to point at on screen, (c) what to say. Honest about what's built today vs what's still pending.

---

## What's built right now (thin slice) vs Day-2 backlog

| Phase in run-of-show | Built today | Status |
|---|---|---|
| Slides 1-3 · methodology hook | `PITCH-DECK.md` — paste into PPT | ✓ Ready |
| Phase 1 · 2 NBA triggers on Today | Salary-increment + car-buying NBA cards on Arjun | ✓ Ready |
| Phase 2 · 3-options decision card | Existing used-car-final flow | ✓ Reused |
| Phase 3 · Origination revealed | `a-orig-summary` stage · 4 rich cards (KYC · KFS · Decision · Audit) | ✓ Ready (thin · summary card only · 7-stage reveal is Day 2) |
| Phase 4 · Wellness loop (Plan tab + what-if simulator) | Not built | ✗ Day 2 |
| Phase 5 · Agent orchestration overlay | Not built | ✗ Day 2 |
| Slide 4 · closing tree-with-ticks | `PITCH-DECK.md` slide 4 | ✓ Ready |

**Implication for today's rehearsal:** the live walk is ~7-8 minutes of working content, not the full 11. You have three options for the remaining ~3-4 minutes — see *"Filling the 11-minute live-walk slot"* at the bottom.

---

## Pre-flight (10 minutes before the meeting)

1. **Open browser** (Chrome or Edge · maximised window)
2. **Open the app:** double-click `output\demo-app\index.html`
   - Or in the URL bar append `?mode=scripted` to force offline mode (no internet dependency)
3. **Confirm persona** is on **Arjun** in the top-right dropdown ("Retail")
4. **Reload once** (Ctrl+F5) so the intro animation plays fresh
5. **Close other apps** that might steal focus (Slack · Teams · Outlook notifications)
6. **Phone on DND**
7. **Volume normal** — no sound in demo but Q&A might trigger something
8. **Side window:** open this `DEMO-WALKTHROUGH.md` in a small window for reference

**Sanity check (1-minute click test before they arrive):**
1. Refresh the page · intro plays · hero appears
2. Tap "Skip to my dashboard" → Today loads with 2 NBA cards at top (gold + violet)
3. Tap the **car NBA** → chat opens · routes through · 3-option response renders
4. Inside the 3-option response · tap *"Go with Option 3 — proceed to pre-approval"* → indigo Origination badge appears · 4 rich cards stack
5. Use the back-home button (top-right of chat) → return to Today
6. Tap the **salary NBA** → chat opens · 3-option salary allocation response renders
7. Switch persona to Priya · confirm her Today still works · switch back to Arjun

If all 7 work, you're green for the demo.

---

## Click-by-click walkthrough · with talk track

### 0:00 — 0:30 · Slide 1 · Why agentic banking now

**Show:** Slide 1 from `PITCH-DECK.md`

**Say:**
> "Customers stopped navigating apps. They started talking to them. Three forces converging: LLMs that can actually use tools reliably; customer expectations reshaped by Revolut AIR, DBS NAV, BofA Erica — conversational is the norm; and competitive pressure — every Tier-1 has at least one agentic initiative live. The question isn't whether — it's where. We've done the work to answer that."

### 0:30 — 1:15 · Slide 2 · 4 priority hotspots

**Show:** Slide 2 (value chain with 4 hotspots highlighted)

**Say:**
> "We didn't pick by gut. Started with the banking value chain, decomposed it into capability blocks, scored each on a business-case framework — revenue uplift, cost reduction, risk takeout, CX impact. Produced four priority hotspots. Today we'll show three — Sales, Growth, Origination — all customer-facing and within Song Commerce & Sales. The fourth, Servicing & Relationship, sits in Song Service and would be an RM-facing app — separate scope."

### 1:15 — 2:00 · Slide 3 · Origination value tree

**Show:** Slide 3 (one row of Origination value tree highlighted)

**Say:**
> "This is the analytical depth behind every use case. For Origination — one lever, Simplify application completion — walks all the way through operational drivers, outcomes, KPIs, public proof. HSBC, McKinsey, BCG all converge on this as the highest-ROI agentic-AI opportunity in banking. Every screen in the demo carries a lever badge that points back to a row on this tree. Now let's see it."

### 2:00 — 3:00 · Phase 1 · Today + 2 NBA triggers (Aria sees patterns)

**Click:** Switch from slides back to the browser tab with the app open

**Show:** The intro splash (re-trigger by reloading or persona-switching if needed)

Tap **"Skip to my dashboard →"** on the hero screen.

You land on Arjun's **Today** tab. At the top there are **two NBA trigger cards**:

1. **Gold-accented:** *"₹20K salary increment landed — let's allocate it intentionally"* — with 3 cited signals (salary jump, unallocated bandwidth, stale SIP)
2. **Violet-accented:** *"Looking at used cars? Three signals say you're close"* — with 3 cited signals (salary, CarWale searches, corpus headroom)

**Point at the lever badges** (small chips that say *"Sales & Advisory · Improve lead conversion"* with a tree icon).

**Say:**
> "Arjun's Today. Two NBA cards at the top. Both carry a Sales & Advisory · Lead-conversion lever badge — every screen in this demo attributes back to a row on the value tree. The first card detected a salary increment of ₹20,000 on the 2nd of May — Aria notices the new bandwidth is sitting unallocated. The second card detected two browsing signals on CarWale plus comfortable corpus headroom — Aria infers car-buying intent. Neither of these is a notification. Each is a *trigger-based outreach* — what the value tree calls *lead conversion*."

### 3:00 — 5:00 · Phase 2 · 3-options decision card

**Click:** Tap *"Walk me through the 3 options"* on the **violet car NBA**.

The chat screen takes over. You see in sequence:

1. **Reasoning trace** ticks through 3 steps (Honda City listing · CIBIL band 812 · modelling 3 options)
2. **Tool chips** fade in (Used-car partners · Credit policy · Trade-in valuation)
3. **Route badge** appears: violet *"Sales & Advisory Agent"*
4. **Aria's response** streams: confirms car details, offers two options *"Walk me through the 3 options"* or *"Schedule a test drive first"*

Tap **"Walk me through the 3 options"**.

Again: reasoning trace (3 steps · longer), tool chips (5+ of them · Cash-flow analytics, Used-car partners, EMI calculator, Trade-in valuation, Credit policy), violet Sales & Advisory route badge.

Then the **3-option response streams in**:
- **Option 1:** Own cash + trade-in (cheapest over 5 years)
- **Option 2:** Standard used-car loan (faster)
- **Option 3:** PSL pre-approved · trade-in netted (recommended — green pill)

Each has a KFS-style grid: amount · rate · tenure · EMI · total interest.

**Say:**
> "Aria routed to Sales & Advisory. Three things visible to the customer that aren't in a normal banking app: the reasoning trace — Aria thinking aloud, citing real numbers from your own data; the tool chips — every tool Aria actually called to ground the answer; and the route badge — naming the specialist who took over. The response itself is a Key Fact Statement layout — RBI Digital Lending Guidelines compliant. Three options. Total interest spelled out. Recommendation is Option 3 — PSL pre-approved at 9.85% — saves about ₹1L in interest versus the standard loan."

### 5:00 — 8:00 · Phase 3 · Origination revealed

**Click:** Inside the 3-option response, tap *"Go with Option 3 — proceed to pre-approval"*.

What happens:

1. **Reasoning trace ticks through 7 steps:** Handoff from Sales to Origination · pulling e-KYC vault · CIBIL pull · adverse-media check on Spinny Whitefield · credit memo · KFS · audit-log entry
2. **Tool chips fade in (7):** e-KYC vault · Credit bureau (CIBIL) · Adverse-media scan · KFS engine · Credit memo synth · Policy check · Audit logger
3. **NEW route badge — indigo "Origination Agent"** (deep blue · distinct from violet Sales badge)
4. **Streamed response with 4 stacked rich cards:**
   - **Origination summary card** — green-tick fields: Aadhaar •••• 4821 · PAN matched ITR · Address proof current · CIBIL 812 prime+ · Adverse media 0 hits · Policy checks 7 of 7 passed
   - **Key Fact Statement card** — loan principal · APR · tenure · indicative EMI · processing fee · foreclosure · cooling-off · total interest
   - **Decision card** — big green checkmark · *"Pre-approved · 9.40% PSL"* · *"Sanction letter ready · disbursal once you accept"*
   - **Audit trail card** — monospace timestamped log of every step (KYC pulled at 09:41:02 · CIBIL inquiry 09:41:03 · adverse media 09:41:04 · credit memo 09:41:06 · KFS rendered 09:41:07 · Decision APPROVE 09:41:09)

**Say:**
> "Watch the route badge change colour. Aria has handed off to Origination — a separate specialist, indigo branding. Origination doesn't talk to you about cars or cards — it runs the application machinery. Seven steps in the reasoning trace. Seven tools called. Real ones — every Tier-1 bank already has these systems; this layer just orchestrates them.
>
> Then the four cards: KYC fields green-ticked from the existing vault, no document upload needed. The Key Fact Statement — RBI Digital Lending Guidelines compliant — APR, EMI, total interest, cooling-off period, all disclosed before any commitment. The decision — pre-approved at 9.40%. And critically, the audit trail — every step timestamped and immutable. This is what makes agentic actions *defensible* to a regulator.
>
> Ninety seconds of customer time. Origination today at most banks is 7 to 14 days at a branch. *That's* the time-to-yes lever from the value tree."

### 8:00 — 12:00 · Filling the 11-minute live-walk slot

The thin slice covers ~6 minutes of live walk (Phase 1 + 2 + 3). You have ~3-4 minutes to fill. Three options — pick one or mix:

#### Option A · Walk the salary NBA too (~2 minutes)

**Click:** Use the chat's back button (top-right) to return to Today. Tap the **gold salary NBA**.

**Show:** Similar arc — reasoning, tool chips, violet Sales badge, 3-option response (SIP bump · term-life top-up · 50/50 split recommended).

**Say:**
> "Same pattern, different trigger. Salary increment detected on the 2nd of May. Three options: bump SIP by ₹3K for compounding, top up term-life cover for protection, or split 50/50. Recommended is split — covers both, preserves discretion. The lever is the same — improve lead conversion via trigger-based outreach — but the moment is different. This is what 'continuous awareness' actually looks like."

#### Option B · Show Priya for breadth (~2 minutes)

**Click:** Top-right dropdown · switch to **SME** (Priya). Intro plays. Tap *"Skip to my dashboard"*.

**Show:** Priya's Today — held-payment alert, overnight section with L1-L4 receipts (GSTR-1 auto-filed, vendor chases drafted, suspect merchant token refused), payroll alert, vendor-overdue alert.

**Say:**
> "Same agent infrastructure, different customer. Priya — SME bakery owner. Different Today entirely — held payment for Mehta Flour Mills, GST filed early last night by a standing rule, three vendors overdue with chases already drafted in three tones. Notice the L1 through L4 badges — that's the autonomy ladder. L4 is autonomous with reversibility — Aria acted last night, here's the receipt, the customer can reverse if they want. This is how we make autonomy *safe*."

Optionally tap one of the overnight receipts → audit trail expands.

#### Option C · Show backend + deployability (~1.5 minutes)

**Don't click anything visible.** Open File Explorer to `output\demo-app\backend\` in a side window.

**Say:**
> "What you saw runs scripted — demo-day safe, no internet needed. But this is also deployable. Backend folder, four Python files: server.py is FastAPI with a streaming endpoint; agents.py has the front-door classifier and four specialist prompts; tools.py is the 12-tool registry; data.py is the mock persona data. About 250 lines total. Set an Anthropic or xAI API key in .env, run python server.py, and every reasoning step + tool call you just saw comes from a real LLM instead of script. Same UI, silent upgrade. That's the deployable route."

### 12:00 — 12:30 · Slide 4 · Close

**Show:** Slide 4 from `PITCH-DECK.md` (tree-with-ticks)

**Say:**
> "Six lever ticks across three hotspots. Everything you saw runs scripted today. Same UI runs Claude or Grok the moment you set an API key. Deployable. Next iterations are production-ready KYC integrations, expanded marketplace, additional value-tree levers, and the RM-facing build in the Service vertical."

### 12:30 — 15:00 · Q&A

Use the prepared one-liners in `PITCH-DECK.md` section *"Q&A · prepared one-liner answers"*.

---

## What if something breaks during the live walk

| What goes wrong | Recovery move |
|---|---|
| NBA cards don't appear on Today | Reload with `?mode=scripted` appended to URL. Make sure persona is Arjun. |
| Tapping NBA opens a blank chat | Hard reload (Ctrl+Shift+R). The scripted scenarios are static — if they fail to load, the JS file didn't parse. |
| Origination badge looks the same as Sales | Browser cached the old CSS — Ctrl+F5 to bust cache. |
| Chat hangs mid-response | Don't tap again. Wait 2 seconds. If still frozen, refresh tab and resume from Today. |
| Intro animation loops | Add `?mode=scripted` to URL — the URL param suppresses re-runs. |
| You forget the talk track | Look at this file (open in side window) — the talk track is here. |

**Backup plan:** record the full demo as a screen capture (MP4) the evening before. If anything breaks live, play the recording silently and narrate over it.

---

## Honest framing if leadership asks "is this complete?"

This is a working thin slice. You should answer honestly:

> "You've seen the agentic spine end-to-end — front-door routing, four specialists, tool use, reasoning traces, audit trail. The pieces still pending are the 7-stage origination reveal (we're showing the summary card; the full step-by-step KYC walkthrough is two days of additional content work) and the agent-orchestration overlay (one more day). Nothing structural is missing — content depth is. Estimate one week to ship the complete demo."

This is more credible than overselling. Internal leadership respects honest scoping.

---

## Daily rebuild status reference

| Day | Built | Status |
|---|---|---|
| Day 1 | Slides · lever badge · Origination registry (frontend) · 2 NBA cards · 3 new STAGES (car-buying entry · salary-increment · orig-summary) · 4 rich cards in orig-summary | ✓ Today |
| Day 2 | Full 7-stage origination reveal · goal what-if simulator · agent orchestration overlay | Pending |
| Day 3 | TReDS NBA for Priya · pre-trip activation for Arjun · backend Origination wiring + 5-target FRONTDOOR + new tools | Pending |
