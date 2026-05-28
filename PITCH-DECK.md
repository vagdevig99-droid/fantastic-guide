# Pitch deck · 15-min internal-leadership demo

**Audience:** Accenture Song internal leadership · Commerce & Sales vertical
**Format:** 4 slides (2-min hook + closing) · 11-min single continuous live walk · 2-min Q&A
**Total:** 15 minutes hard cap

These are slide drafts in markdown. Paste into PowerPoint or Keynote, apply Accenture brand styling. Each slide carries title · 3-4 body bullets · speaker notes (15-30s talk track) · visual suggestion.

---

## Slide 1 · Why agentic banking · now

**Title:** Customers stopped navigating apps. They started talking to them.

**Sub-title:** From feature-app to agent-as-the-app — three forces converging

**Body bullets:**
- **LLM capability has crossed a threshold** — reliable tool use, multi-step reasoning, agent orchestration are now stable
- **Customer expectation has shifted** — Revolut AIR · DBS NAV · Bank of America Erica · conversational is the new normal
- **Competitive pressure is real** — every Tier-1 has at least one agentic initiative live or in flight
- **Our methodology** — value chain mapping → hotspot prioritisation → value-tree decomposition → working POC

**Speaker notes (~30s):**
> "Customers stopped navigating apps and started talking to them. Three forces are converging right now: LLMs that can actually use tools reliably; customer expectations reshaped by Revolut AIR, DBS NAV, BofA Erica — conversational has become the norm; and competitive pressure — every Tier-1 has at least one agentic initiative in play. The question isn't *whether* — it's *where*. We've done the work to answer that, methodically."

**Visual suggestion:** Split-screen mock — left side: traditional banking app with 12+ tabs and clutter · right side: a single conversational surface with one orb and one input line. Annotate the right side with "Aria · one agent, three specialists behind."

---

## Slide 2 · The 4 priority hotspots

**Title:** Where AI adds maximum value across the banking value chain

**Sub-title:** Four priority hotspots from our scoring framework · we're building three

**Body bullets:**
- **Discovery path:** banking value chain → capability decomposition → business-case scoring → hotspot prioritisation → value-tree decomposition (not built by gut)
- **The 4 priority hotspots:** Servicing & Relationship · Distribution Sales & Advisory · Growth Loyalty & Ecosystem · Origination Onboarding & Decisioning
- **Our scope (Song Commerce & Sales):** Sales · Growth · Origination — customer-facing
- **Servicing/RM:** Song Service vertical, separate scope, separate build

**Speaker notes (~30s):**
> "We didn't pick use cases by gut. We started with the banking value chain, decomposed it into capability blocks, scored each on a business-case framework — revenue uplift, cost reduction, risk takeout, customer-experience impact. That produced four priority hotspots. Today we'll show three: Sales, Growth, and Origination — all customer-facing, all within Song Commerce & Sales. The fourth, Servicing & Relationship, sits in Song Service and would be an RM-facing app — separate scope."

**Visual suggestion:** Reuse your existing value-chain image with the 4 priority hotspots highlighted in green. Add a small annotation/box on each: 3 are in scope (highlighted brighter) and 1 (Servicing) is greyed with the label "Song Service · separate build".

---

## Slide 3 · Inside one hotspot · the Origination value tree

**Title:** Inside one hotspot — how value gets created

**Sub-title:** Origination · Simplify application completion · lever-by-lever proof

**Body bullets:**
- **Lever:** Simplify application completion + automate KYC/KYB + accelerate decisioning + strengthen audit trail
- **Operational drivers:** conversational form-fill · document intelligence · pre-fill from existing relationship · missing-info prompts · journey rescue · adverse-media scan · credit memo synthesis
- **Targeted outcomes:** lower abandonment · higher completion rate · faster time-to-yes · cleaner audit defensibility
- **KPIs:** application completion rate · drop-off rate · time-to-submit · visitor-to-apply conversion · audit exception rate
- **Public proof:** HSBC GenAI credit memos · McKinsey 10–20% productivity uplift · BCG 60% KYC effort reduction · Industry consensus: highest-ROI agentic-AI opportunity in banking

**Speaker notes (~25s):**
> "This is the analytical depth behind every use case. For Origination, one lever — Simplify application completion — walks all the way through to operational drivers, targeted outcomes, measurable KPIs, and public proof points. Every screen you'll see in the demo carries a lever badge attribution back to a row on this tree. Nothing is decorative. Now let's see it."

**Visual suggestion:** Reuse your existing Origination value-tree image with one row (Simplify application completion or your hero lever) highlighted in green and arrowed in. Tag-line at the bottom: *"Every screen in the demo carries a lever badge."*

---

## Slide 4 · (Closing) Six levers ticked · deployable today

**Title:** What we demonstrated — and what's ready to deploy

**Sub-title:** Six lever ticks across three hotspots · runtime is hybrid

**Body bullets:**
- ✓ **Origination · Simplify application completion**
- ✓ **Origination · Automate KYC/KYB evidence gathering**
- ✓ **Origination · Accelerate credit/application decisioning**
- ✓ **Origination · Strengthen audit trail**
- ✓ **Sales & Advisory · Improve lead conversion (NBA + trigger-based outreach)**
- ✓ **Growth Loyalty & Ecosystem · Build financial wellness journeys**
- **Runtime:** scripted today (no internet needed) · same UI runs Claude or Grok when an API key is set · backend lives in the project folder, ~250 lines · silent fallback to scripted if backend is unreachable

**Speaker notes (~30s):**
> "Six levers ticked across three priority hotspots. Everything you just saw runs scripted today — no internet needed, demo-day safe. The same UI, same tools, same agent registry, runs against Claude or Grok the moment you set an API key and start the backend. Backend's in the project folder, ~250 lines. It's deployable today. Next iterations: production-ready KYC integration, expanded marketplace, additional value-tree levers."

**Visual suggestion:** Reuse your slide 2 value-chain image but show the same 4 hotspots with 6 lever ticks added in green checkmarks across the 3 in-scope hotspots. Add a small footer diagram: *Scripted (offline) ↔ Live (API key + backend)* with a thin connecting line labelled "silent upgrade".

---

## Run-of-show timing (for reference)

| Segment | Duration | What |
|---|---|---|
| Slide 1 | 30s | Why agentic banking now |
| Slide 2 | 30s | 4 priority hotspots |
| Slide 3 | 25s | Origination value tree |
| Transition | 5s | "Let's see it in action" |
| **Hook total** | **~2 min** | |
| Phase 1 · trigger (NBA on Today) | 1 min | Two NBAs visible: salary-increment + car-buying |
| Phase 2 · decision (3 options) | 2 min | Reuse existing used-car flow |
| Phase 3 · origination revealed | 3.5 min | 7-stage progressive reveal — biggest lift |
| Phase 4 · wellness loop | 1.5 min | Plan tab + goal what-if simulator |
| Phase 5 · orchestration view | 2 min | Agent timeline overlay + L1–L4 |
| Phase 6 · close | 1 min | Tree with ticks + deployability |
| **Demo total** | **~11 min** | |
| Slide 4 | 30s | Closing tree-with-ticks |
| Q&A | 2 min | |
| **Grand total** | **~15 min** | |

---

## Q&A · prepared one-liner answers

**Q: Does this actually call an LLM?**
> "In demo mode this runs scripted. The same UI, same tools, same agent registry — when you set an API key and start the backend, every reasoning step and tool call comes from Claude or Grok. Backend's in the same project folder, ~250 lines."

**Q: How is this Song Commerce & Sales relevant?**
> "Everything here is customer-facing — the Commerce & Sales scope. The Servicing/RM equivalent would be a separate Song Service build, outside this POC."

**Q: How long would production take?**
> "The agentic layer is essentially ready. Real production needs four things this POC doesn't have yet: live KYC bureau integrations (CIBIL, CKYC), regulator-grade audit storage (likely AWS QLDB or similar), production model orchestration (LangGraph or in-house), and a compliance ring before any outbound action. Estimate 4-6 months for a deployable MVP at one bank."

**Q: What about Servicing?**
> "Servicing was rank #1 in our prioritisation — strongest market proof. But that's RM-facing, which is Song Service vertical. We focused this POC on the three hotspots within Commerce & Sales scope. Servicing would be a separate parallel build."

**Q: What's the cost of running this?**
> "About ₹1 per conversation on Claude Haiku, ₹5–15 on Sonnet, ₹0.50 on Grok 4 Fast. For a typical 5-minute demo conversation, well under one rupee on the cheap tier."

**Q: What standards does this comply with?**
> "Every response is grounded in real RBI policy — Customer Liability Framework for disputes, PMLA Schedule III for AML, Digital Lending Guidelines for the KFS and cooling-off, Account Aggregator framework for consent, FEMA LRS for forex, MITC for cards. The framing is in the system prompts and surfaces in every customer reply."

---

## Pre-flight checklist (10 minutes before the demo)

1. Open the app at `?mode=scripted` (forces offline mode, no internet dependency)
2. Persona is on **Arjun** in the header dropdown
3. Confirm intro animation plays cleanly
4. Confirm Today tab shows the two NBA cards (salary-increment + car-buying) with lever badges
5. Tap the car-buying NBA → 3-options card renders
6. Confirm "Proceed · pre-approved" leads into the origination 7-stage flow
7. Plan tab shows the Home Down-Payment goal card; tap → simulator opens
8. Press the orchestration shortcut (or tap the in-flow button) → overlay appears
9. Audio is at normal volume; phone is on Do Not Disturb
10. Backup recording is open in a second browser tab (in case live app fails)
