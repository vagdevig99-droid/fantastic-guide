// ════════════════════════════════════════════════════════════════════════
// Aria · content & dialog graph
// Indian banking context · RBI-aligned framing throughout
// ════════════════════════════════════════════════════════════════════════
//
// Three data structures power the experience:
//   1. PERSONAS         — the customer profiles
//   2. CATEGORIES       — top-level intents shown on the Home screen,
//                          each pointing to a starting dialog stage
//   3. STAGES           — the dialog graph itself; each stage either asks
//                          a clarifying question (type:"clarify") or
//                          delivers the final detailed reply (type:"final")
//   4. CLASSIC_VIEW     — data for the traditional widget-based fallback
//
// A free-typed message is routed by scanning all stages reachable from the
// current persona's categories, matching keyword triggers, and jumping
// straight to the most specific stage that fits.
// ════════════════════════════════════════════════════════════════════════

const PERSONAS = {
  priya: {
    id: "priya",
    name: "Priya Sharma",
    tagline: "Owner · Sunrise Bakery, Pune",
    avatar: "PS",
    homeGreeting: "Good morning, Priya. Your current account is at <b>₹8,42,650</b> and your overdraft is <b>39% used</b>. What would you like me to take care of today?",
    chatOpening: "I'm with you. Tell me a bit more and I'll handle this end-to-end.",
  },
  arjun: {
    id: "arjun",
    name: "Arjun Mehta",
    tagline: "Salaried · Bengaluru",
    avatar: "AM",
    homeGreeting: "Hey Arjun. Your salary credited on <b>2 May</b> — savings at <b>₹3,12,480</b>, credit card statement due on <b>18 May</b>. What can I help with?",
    chatOpening: "Got it. Quick clarification and I'll take this all the way through.",
  },
};

// ════════════════════════════════════════════════════════════════════════
// Home screen · top-level intents
// ════════════════════════════════════════════════════════════════════════
const CATEGORIES = {
  priya: [
    {
      id: "p-serv",
      label: "Account & payments",
      sub: "Holds, transfers, reconciliation",
      icon: "wallet",
      gradient: "linear-gradient(135deg,#2DD4BF,#36E2C8)",
      triggers: ["transfer", "flag", "flagged", "hold", "held", "blocked", "aml", "mehta", "payment"],
      startStage: "p-serv-q1",
    },
    {
      id: "p-sales",
      label: "Borrow for the bakery",
      sub: "Equipment, working capital, expansion",
      icon: "loan",
      gradient: "linear-gradient(135deg,#7C5CFF,#B66DFF)",
      triggers: ["loan", "oven", "equipment", "finance", "borrow", "credit", "expansion"],
      startStage: "p-sales-q1",
    },
    {
      id: "p-growth",
      label: "Lower my business costs",
      sub: "MDR, fees, supplier financing",
      icon: "trending",
      gradient: "linear-gradient(135deg,#F59E0B,#FFB341)",
      triggers: ["terminal", "pos", "mdr", "cost", "fee", "marketplace", "offer"],
      startStage: "p-growth-q1",
    },
  ],
  arjun: [
    {
      id: "a-serv",
      label: "Card & account help",
      sub: "Disputes, charges, lost card",
      icon: "shield",
      gradient: "linear-gradient(135deg,#2DD4BF,#36E2C8)",
      triggers: ["charge", "dispute", "fraud", "unknown", "recognise", "recognize", "lost", "stolen"],
      startStage: "a-serv-q1",
    },
    {
      id: "a-sales",
      label: "Cards & spending",
      sub: "Upgrade, add a card, review patterns",
      icon: "card",
      gradient: "linear-gradient(135deg,#7C5CFF,#B66DFF)",
      triggers: ["upgrade", "credit card", "card", "rewards", "spend", "spending"],
      startStage: "a-sales-q1",
    },
    {
      id: "a-growth",
      label: "Plan something",
      sub: "Trip, big purchase, long-term goals",
      icon: "target",
      gradient: "linear-gradient(135deg,#F472B6,#FB7299)",
      triggers: ["goa", "travel", "trip", "vacation", "holiday", "flight", "hotel", "plan"],
      startStage: "a-growth-q1",
    },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Dialog stages · the conversation graph
//   - "clarify"  stages ask a question and offer options that jump to
//                another stage. Light reasoning, no tool calls.
//   - "final"    stages deliver the rich, RBI-aware response. Full
//                reasoning trace + tool calls + cards.
// ════════════════════════════════════════════════════════════════════════
const STAGES = {

  // ────────── Priya · Servicing tree ──────────
  "p-serv-q1": {
    type: "clarify",
    thinking: [
      "Reading your last 30 days · 6 supplier payments, 1 currently held",
      "Scoping which service option fits",
    ],
    agent: "Aria",
    routingReason: "Narrowing the service request",
    responseHtml: `<p>Of course. To get this right in one go — which of these is closest to what's happening?</p>`,
    options: [
      { label: "A payment of mine is on hold", goTo: "p-serv-q2", triggers: ["hold", "held", "blocked", "flag", "transfer"] },
      { label: "A charge looks wrong", goTo: "p-serv-q-other", triggers: ["wrong", "charge", "debit"] },
      { label: "KYC / documents query", goTo: "p-serv-q-other", triggers: ["kyc", "document", "verify"] },
    ],
  },
  "p-serv-q2": {
    type: "clarify",
    thinking: [
      "Pulling 2 active holds on your business current account (•• 4421)",
      "Looking at vendor history for context",
    ],
    agent: "Aria",
    routingReason: "Identifying the held transaction",
    responseHtml: `<p>I see two recent holds. Is it about the <b>₹4,80,000 to Mehta Flour Mills on 14 May</b>, or another one?</p>`,
    options: [
      { label: "The Mehta Flour Mills transfer", goTo: "p-serv-final", triggers: ["mehta", "flour"] },
      { label: "A different one", goTo: "p-serv-q-other" },
      { label: "Back to service options",        goTo: "p-serv-q1",      triggers: ["back", "service"] },
    ],
  },
  "p-serv-final": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Payment hold · AML triage",
    thinking: [
      "Reading your 14 prior payments to Mehta Flour Mills (₹52k–₹2.1L range)",
      "Comparing today's ₹4,80,000 outflow to the 6-month vendor average — 2.3× variance",
      "Cross-referencing PMLA Schedule III threshold-monitoring rules",
      "Drafting the quick-release route · invoice + self-attest pattern",
    ],
    tools: [
      { icon: "📒", label: "Transaction ledger" },
      { icon: "🛡️", label: "AML rules engine" },
      { icon: "📂", label: "Case management" },
    ],
    responseHtml: `
<p>Got it. Your transfer of <b>₹4,80,000</b> to <b>Mehta Flour Mills</b> on <b>14 May</b> is on a short hold — it's <b>2.3× larger</b> than your typical payment to this vendor, which triggered an automated AML review under the PMLA monitoring rules that scan every transaction.</p>

<div class="card transaction">
  <div class="card-row">
    <span class="muted">Beneficiary</span>
    <span><b>Mehta Flour Mills</b> · A/C •• 6620 · HDFC0001872</span>
  </div>
  <div class="card-row">
    <span class="muted">Amount</span>
    <span class="amount">₹4,80,000.00</span>
  </div>
  <div class="card-row">
    <span class="muted">Status</span>
    <span class="pill warn">Hold pending verification</span>
  </div>
  <div class="card-row">
    <span class="muted">Reason</span>
    <span>Threshold variance · 2.3× of 6-mo average</span>
  </div>
</div>

<p>Two clean ways forward:</p>
<ul class="actions-list">
  <li><b>Quick release</b> — confirm the supplier and upload the latest invoice. I can pre-fill the form using vendor details from your past 14 payments. Funds typically move within 30 minutes.</li>
  <li><b>Compliance review</b> — if you'd rather a human officer take a fresh look, I'll raise a ticket with our Compliance desk. SLA: one working day.</li>
</ul>

<div class="note">Your funds remain in your account in the meantime — only the outbound transfer is paused. You'll see the clearance record under <i>Statements → Holds</i> once released.</div>
`,
    options: [
      { label: "Pre-fill the release form", goTo: "p-serv-release-active" },
      { label: "Escalate to Compliance",    goTo: "p-serv-compliance-active" },
      { label: "Back to service options",   goTo: "p-serv-q1" },
    ],
    terminal: true,
  },
  "p-serv-q-other": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Routing to a specialist",
    thinking: [
      "Logging the request against your relationship file",
      "Routing to the right desk under your business-banking SLA (1 working day)",
    ],
    tools: [{ icon: "📂", label: "Case routing" }],
    responseHtml: `<p>Let me route this to the right specialist. I've raised a case (#SRV-${Math.floor(Math.random()*9000+1000)}) and an officer will get back to you within one working day. You'll also see this under <i>Help → Open tickets</i>.</p>`,
    options: [
      { label: "Back to service options", goTo: "p-serv-q1" },
    ],
    terminal: true,
  },

  // ────────── Priya · Sales/Borrow tree ──────────
  "p-sales-q1": {
    type: "clarify",
    thinking: [
      "Cross-checking your current cash position (₹8.4L) and OD utilisation (39%)",
      "Reading the credit context",
    ],
    agent: "Aria",
    routingReason: "Clarifying the purpose",
    responseHtml: `<p>Happy to help. So I bring the right options — what's the financing for?</p>`,
    options: [
      { label: "New equipment (oven, mixer, freezer)", goTo: "p-sales-q2-eq", triggers: ["oven", "equipment", "machine", "mixer"] },
      { label: "Working capital / inventory", goTo: "p-sales-final-wc", triggers: ["working capital", "inventory", "stock"] },
      { label: "Expansion / a second outlet", goTo: "p-sales-final-exp", triggers: ["expansion", "second", "outlet", "open"] },
    ],
  },
  "p-sales-q2-eq": {
    type: "clarify",
    thinking: [
      "Reviewing 12 months of equipment-related outflows (avg ₹62k/quarter)",
      "Sizing the new ask",
    ],
    agent: "Aria",
    routingReason: "Sizing the request",
    responseHtml: `<p>Got it — equipment. Two more details and I can show you a proper Key Fact Statement. Roughly how much, and how soon?</p>`,
    options: [
      { label: "₹3–5L · within 2 weeks",            goTo: "p-sales-final-eq" },
      { label: "₹6–10L · within a month",           goTo: "p-sales-final-eq" },
      { label: "Show me both options side by side", goTo: "p-sales-final-eq" },
      { label: "Back to borrow options",            goTo: "p-sales-q1" },
    ],
  },
  "p-sales-final-eq": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "SME equipment financing",
    thinking: [
      "Reading 12-month cash flow · ₹19.8L average monthly turnover",
      "Modelling July monsoon dip (-22%) against an EMI of ~₹24,700 over 30 months",
      "Drafting Account Aggregator consent for GSTR-1/3B (last 4 quarters)",
      "Pulling indicative APR · 10.40% under your SME Equipment Loan policy",
    ],
    tools: [
      { icon: "📊", label: "Cash-flow analytics" },
      { icon: "🔗", label: "Account Aggregator" },
      { icon: "📄", label: "Key Fact Statement engine" },
      { icon: "🏦", label: "Credit policy" },
    ],
    responseHtml: `
<p>Based on what I can see, two clean options. Let me lay both out — and then there's a quick consent ask before we proceed.</p>

<div class="card option">
  <div class="card-head">
    <b>Option A · SME Equipment Loan</b>
    <span class="pill primary">Pre-qualified</span>
  </div>
  <div class="kfs">
    <div><span class="muted">Indicative limit</span><b>up to ₹8,00,000</b></div>
    <div><span class="muted">Rate (APR)</span><b>10.40% p.a.</b></div>
    <div><span class="muted">Tenure</span><b>24–36 months</b></div>
    <div><span class="muted">Processing fee</span><b>1.0% + GST</b></div>
    <div><span class="muted">Foreclosure</span><b>Nil after 6 months</b></div>
    <div><span class="muted">Cooling-off</span><b>3 days post-disbursal</b></div>
  </div>
  <p class="card-foot muted">Indicative EMI ₹24,700 for ₹6,00,000 over 30 months. Full Key Fact Statement will be issued before sanction, as required under the RBI Digital Lending Guidelines.</p>
</div>

<div class="card option">
  <div class="card-head">
    <b>Option B · Enhance your existing OD</b>
    <span class="pill ghost">Faster, smaller</span>
  </div>
  <div class="kfs">
    <div><span class="muted">New limit</span><b>₹3,00,000 → ₹6,00,000</b></div>
    <div><span class="muted">Rate</span><b>11.25% p.a. (only on used balance)</b></div>
    <div><span class="muted">Setup time</span><b>~24 hours, fully online</b></div>
    <div><span class="muted">Best for</span><b>Working capital, not asset purchase</b></div>
  </div>
</div>

<p><b>My recommendation:</b> Option A. The oven is a 5–7 year asset; term financing keeps your OD free for cash-flow swings — your bakery sees a ~22% dip every monsoon and that's exactly when the OD earns its keep.</p>

<div class="note compliance">
  <b>One consent to confirm.</b> To finalise eligibility I'd pull your last 4 quarters of GSTR-1 and GSTR-3B through the Account Aggregator network. The consent is single-purpose, time-bound (90 days), and revocable any time from <i>Settings → Data Sharing</i>. Shall I send the consent request to your registered mobile?
</div>
`,
    options: [
      { label: "Send AA consent",            goTo: "p-sales-aa-consent-sent" },
      { label: "Draft Option A application", goTo: "p-sales-application-drafted" },
      { label: "Back to borrow options",     goTo: "p-sales-q1" },
    ],
    terminal: true,
  },

  "p-sales-aa-consent-sent": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "AA consent in motion · GSTR-1 + GSTR-3B",
    thinking: [
      "Generating single-purpose AA consent · GSTR-1 + GSTR-3B (4 quarters)",
      "Routing the consent request to your registered mobile · +91 98•••• 4421",
      "Setting validity window · 90 days · revocable any time",
      "Writing immutable audit-log entry · ref AA-CNS-7821",
    ],
    tools: [
      { icon: "🔗", label: "Account Aggregator" },
      { icon: "📱", label: "Consent gateway" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p><b>AA consent request sent.</b> Mobile gateway pinged, audit logged, data pull armed for your approval. Taking you to <i>Today</i> so you can watch the status live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "p-sales-application-drafted": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Equipment loan application · in motion",
    thinking: [
      "Drafting the SME Equipment Loan application · pre-filled from KYC vault",
      "Sizing at ₹6,00,000 · 30-month tenure · indicative EMI ₹24,700",
      "Generating Key Fact Statement per RBI Digital Lending Guidelines",
      "Queueing AA consent prompt for GSTR data refresh",
    ],
    tools: [
      { icon: "📑", label: "KFS engine" },
      { icon: "🏦", label: "Credit policy" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p><b>Application drafted.</b> KFS attached, AA consent queued, awaiting your review. Taking you to <i>Today</i> so you can watch progress live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "p-sales-final-wc": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Working capital sizing",
    thinking: [
      "Reviewing your 6-month inventory cycle (~45 days average)",
      "Reading your current OD · ₹1,18,400 used of ₹3,00,000 (39%)",
      "Comparing OD top-up at 11.25% vs invoice discounting on your top 5 B2B receivables",
    ],
    tools: [
      { icon: "📊", label: "Cash-flow analytics" },
      { icon: "🏦", label: "Credit policy" },
    ],
    responseHtml: `
<p>For working capital — given your seasonality — I'd lean toward keeping it short and revolving rather than locking it into a term loan.</p>
<div class="card option">
  <div class="card-head"><b>Enhance your OD to ₹6L</b><span class="pill primary">Best fit</span></div>
  <div class="kfs"><div><span class="muted">Rate</span><b>11.25% (used only)</b></div><div><span class="muted">Setup</span><b>~24h, online</b></div></div>
</div>
<div class="card option">
  <div class="card-head"><b>Invoice discounting line</b><span class="pill ghost">Alternative</span></div>
  <p class="muted">Convert outstanding invoices into instant working capital. Useful if you have large B2B receivables.</p>
</div>
<div class="note compliance">Both options carry a full Key Fact Statement before draw-down, per RBI Digital Lending norms.</div>
`,
    options: [
      { label: "Back to borrow options", goTo: "p-sales-q1" },
    ],
    terminal: true,
  },
  "p-sales-final-exp": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Expansion financing",
    thinking: [
      "Modelling a 5–7 year cash projection for a second outlet",
      "Pulling Vikram Iyer's calendar · your dedicated SME relationship banker",
    ],
    tools: [{ icon: "📊", label: "Cash-flow analytics" }, { icon: "👤", label: "RM calendar" }],
    responseHtml: `<p>Opening a second outlet is a bigger conversation than I should resolve solo — there are 5–7 year cash projections, lease vs. property choices, and the GST registration angle to think through.</p>
<p>I'd like to set up a 30-minute video call with <b>Vikram Iyer</b>, your dedicated relationship banker. He has three slots open this week. Want me to send across the calendar invite?</p>
<div class="note">In the meantime, I can pull together a one-page indicative term sheet so you walk into that call with numbers, not assumptions.</div>`,
    options: [
      { label: "Back to borrow options", goTo: "p-sales-q1" },
    ],
    terminal: true,
  },

  // ────────── Priya · Growth tree ──────────
  "p-growth-q1": {
    type: "clarify",
    thinking: [
      "Reading last month's payment-cost lines · you paid ~₹3,470 in MDR + fees",
      "Narrowing the cost lever",
    ],
    agent: "Aria",
    routingReason: "Narrowing the cost lever",
    responseHtml: `<p>There's usually saving somewhere. Which cost are we looking at?</p>`,
    options: [
      { label: "Card acceptance (MDR)", goTo: "p-growth-q2-mdr", triggers: ["mdr", "card", "swipe", "pos"] },
      { label: "Banking fees & charges", goTo: "p-growth-final-fees", triggers: ["fee", "charge"] },
      { label: "Supplier financing costs", goTo: "p-growth-final-supplier", triggers: ["supplier", "financing"] },
    ],
  },
  "p-growth-q2-mdr": {
    type: "clarify",
    thinking: [
      "Sizing against April volume · ₹12.8L processed at 0.27% blended MDR",
    ],
    agent: "Aria",
    routingReason: "Sizing card volume",
    responseHtml: `<p>Quick gauge — roughly how much do you process on cards each month?</p>`,
    options: [
      { label: "Under ₹5 lakh",                          goTo: "p-growth-final-mdr" },
      { label: "₹5–15 lakh (your range, last 6 months)", goTo: "p-growth-final-mdr" },
      { label: "Over ₹15 lakh",                          goTo: "p-growth-final-mdr" },
      { label: "Back to cost-lever options",             goTo: "p-growth-q1" },
    ],
  },
  "p-growth-final-mdr": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Merchant economics · MDR & terminal upgrade",
    thinking: [
      "Slicing April's ₹3,470 MDR across UPI / RuPay / Visa / Mastercard",
      "Visa/MC credit is 12% of your volume but 41% of cost (₹1,420)",
      "Scanning marketplace partners under our Payment Aggregator licence",
      "Matching offers to your ₹620 average ticket size",
    ],
    tools: [
      { icon: "📉", label: "MDR analyser" },
      { icon: "🛒", label: "Merchant marketplace" },
      { icon: "🏷️", label: "Partner offer engine" },
    ],
    responseHtml: `
<p>There's real saving here. Last month you processed <b>₹12.8 lakh</b> across cards and UPI, paying ~<b>₹3,470 in MDR</b>. Roughly 41% sat on Visa/Mastercard credit, where the cap is higher.</p>

<div class="card chart-card">
  <div class="card-head"><b>Where your MDR went · April</b></div>
  <div class="bar"><div class="bar-fill" style="width:62%;background:linear-gradient(90deg,#7C5CFF,#B66DFF)"></div><span>UPI · ₹0 (PSU mandate)</span></div>
  <div class="bar"><div class="bar-fill" style="width:18%;background:linear-gradient(90deg,#22C8B2,#36E2C8)"></div><span>RuPay debit · ₹0 (RBI mandate)</span></div>
  <div class="bar"><div class="bar-fill" style="width:42%;background:linear-gradient(90deg,#F59E0B,#FFB341)"></div><span>Visa/Mastercard credit · ₹1,420</span></div>
  <div class="bar"><div class="bar-fill" style="width:30%;background:linear-gradient(90deg,#F472B6,#FB7299)"></div><span>Visa/Mastercard debit · ₹2,050</span></div>
</div>

<p>Two marketplace partners would actually shift the curve:</p>

<div class="card option">
  <div class="card-head"><b>Pine Labs SmartPOS Mini</b><span class="pill primary">Best fit</span></div>
  <p class="muted">Zero device fee for 6 months · UPI + cards + BBPS · settles to your business account T+1.</p>
  <div class="kfs compact">
    <div><span class="muted">Effective blended MDR</span><b>0.42%</b></div>
    <div><span class="muted">Est. annual saving</span><b>~₹18,600</b></div>
    <div><span class="muted">Bonus</span><b>3% statement cashback on first ₹2L</b></div>
  </div>
</div>

<div class="card option">
  <div class="card-head"><b>Mswipe QR-First</b><span class="pill ghost">Lighter setup</span></div>
  <p class="muted">No device · UPI-only QR with audio confirmation speaker. Best if 80%+ of your customers already pay UPI.</p>
  <div class="kfs compact">
    <div><span class="muted">Monthly fee</span><b>₹0</b></div>
    <div><span class="muted">Bonus</span><b>₹1,500 statement credit after ₹50k processed</b></div>
  </div>
</div>

<div class="note">Both partners hold RBI Payment Aggregator authorisation. Settlement runs on NPCI rails, so your end-of-day reconciliation stays exactly as it is.</div>
`,
    options: [
      { label: "Shortlist Pine Labs",            goTo: "p-growth-final-mdr" },
      { label: "12-month total cost comparison", goTo: "p-growth-final-mdr" },
      { label: "Back to cost-lever options",     goTo: "p-growth-q1" },
    ],
    terminal: true,
  },
  "p-growth-final-fees": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Banking fees review",
    thinking: [
      "Pulling 6 months of fee debits · ₹4,820 total",
      "NEFT/RTGS outward is your largest line · ₹2,140",
      "Modelling savings if vendor payments under ₹5L move to UPI",
    ],
    tools: [{ icon: "📊", label: "Charges ledger" }],
    responseHtml: `<p>I've pulled your last 6 months of bank charges — total <b>₹4,820</b>. The biggest line is <b>NEFT/RTGS outward fees (₹2,140)</b>. You'd save most of that by moving high-value vendor payments to UPI for amounts under ₹5L. Want me to set up beneficiary-level routing rules?</p>`,
    options: [
      { label: "Back to cost-lever options", goTo: "p-growth-q1" },
    ],
    terminal: true,
  },
  "p-growth-final-supplier": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Supplier financing review",
    thinking: [
      "Listing your top 5 suppliers by FY27 volume (Mehta Flour, ABC Sugar, Sunrise Dairy, BESCOM, KSEB)",
      "Checking TReDS registration · 3 of 5 are on platform",
      "Modelling early-payment discount yield",
    ],
    tools: [{ icon: "🏷️", label: "Partner registry" }],
    responseHtml: `<p>Three of your top suppliers are already on TReDS — meaning they'd accept dynamic discounting if you pay early. That's typically <b>1.5–2% off the invoice</b> for paying 10–15 days ahead. Shall I draft the early-payment policy and send it to those three?</p>`,
    options: [
      { label: "Back to cost-lever options", goTo: "p-growth-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Servicing tree ──────────
  "a-serv-q1": {
    type: "clarify",
    thinking: [
      "Reading your card activity · 1 disputed charge already flagged this week",
      "Standing by to triage",
    ],
    agent: "Aria",
    routingReason: "Narrowing the help request",
    responseHtml: `<p>I've got you. Which is it?</p>`,
    options: [
      { label: "A charge I don't recognise", goTo: "a-serv-q2", triggers: ["charge", "dispute", "unknown", "recognise", "recognize", "fraud"] },
      { label: "My card is lost / stolen", goTo: "a-serv-final-lost", triggers: ["lost", "stolen", "missing"] },
      { label: "Something about my statement", goTo: "a-serv-statement-q1", triggers: ["statement"] },
    ],
  },
  "a-serv-q2": {
    type: "clarify",
    thinking: [
      "Scanning May card activity on •• 4108 · QUICKSTREAM MEDIA on 12 May is the outlier",
    ],
    agent: "Aria",
    routingReason: "Pinpointing the transaction",
    responseHtml: `<p>One charge in the last week sits outside your usual pattern — a <b>₹3,499 swipe to QUICKSTREAM MEDIA on 12 May</b>. Is that the one?</p>`,
    options: [
      { label: "Yes, that's the one",         goTo: "a-serv-final" },
      { label: "No, it's a different charge", goTo: "a-serv-final-other" },
      { label: "Back to card help options",   goTo: "a-serv-q1" },
    ],
  },
  "a-serv-final": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Card dispute · unrecognised transaction",
    thinking: [
      "Cross-checking QUICKSTREAM against your 6-month merchant list · no match",
      "Geo-pattern: you transact in Bengaluru · this charge originated in GB",
      "Confirming RBI Customer Liability Framework · 6 days from charge, well inside the 3-working-day zero-liability window",
      "Preparing block-dispute-reissue on Visa rails · 7 tokenised merchants will auto-update",
    ],
    tools: [
      { icon: "💳", label: "Card transactions" },
      { icon: "🌍", label: "Geo-pattern check" },
      { icon: "🛡️", label: "Customer Liability Framework" },
      { icon: "🔄", label: "Card lifecycle" },
    ],
    responseHtml: `
<p>You usually transact in Bengaluru, on a handful of repeat merchants — this fits neither.</p>

<div class="card transaction alert">
  <div class="card-row"><span class="muted">Merchant</span><span><b>QUICKSTREAM MEDIA</b> · GB · MCC 4899</span></div>
  <div class="card-row"><span class="muted">Amount</span><span class="amount">₹3,499.00</span></div>
  <div class="card-row"><span class="muted">When</span><span>12 May · 23:42 IST · card-not-present</span></div>
  <div class="card-row"><span class="muted">Authentication</span><span>3D Secure not used · token mismatch</span></div>
</div>

<p>Two yes/no questions and we're done:</p>
<ol>
  <li>Have you (or anyone with access to your card) signed up for a streaming or content service in the last 30 days?</li>
  <li>Is your physical card still with you?</li>
</ol>

<p>If both answers are <b>no</b>, here's what I'll do in one go:</p>
<ul class="actions-list">
  <li><b>Block the card</b> immediately on the network rails — no further charges land.</li>
  <li><b>Raise a chargeback</b> under the RBI Customer Liability Framework — reported within the 3-working-day window, so your liability is <b>zero</b>.</li>
  <li><b>Issue a replacement</b> with a new PAN; your tokenised cards on file (Netflix, Amazon, Swiggy) auto-update through the card network's tokenisation rails — nothing breaks for you.</li>
</ul>

<div class="note">Provisional credit of ₹3,499 will be posted within 7 working days while we investigate. I'll text you the case ID the moment it's raised.</div>
`,
    options: [
      { label: "Confirm 'no' on both — execute everything", goTo: "a-serv-final" },
      { label: "Wait, let me check first",                  goTo: "a-serv-final" },
      { label: "Back to card help options",                 goTo: "a-serv-q1" },
    ],
    terminal: true,
  },
  "a-serv-final-lost": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Lost / stolen card",
    thinking: [
      "Issuing immediate network hot-list block on •• 4108",
      "Queueing a replacement with token lineage preserved · 7 merchants protected",
    ],
    tools: [{ icon: "🛡️", label: "Network hot-list" }, { icon: "🔄", label: "Card lifecycle" }],
    responseHtml: `<p>I've placed a <b>temporary block</b> on the card immediately. Two quick decisions:</p>
<ul class="actions-list">
  <li><b>Confirm permanent block</b> and ship a replacement (delivery in 2 working days; tokenised cards on file auto-update).</li>
  <li><b>Keep it as a temporary block</b> in case you find it in the next few hours — I'll auto-unblock if you tap it.</li>
</ul>
<div class="note">Under the RBI Customer Liability Framework, any fraud reported within 3 working days carries zero customer liability.</div>`,
    options: [
      { label: "Back to card help options", goTo: "a-serv-q1" },
    ],
    terminal: true,
  },
  "a-serv-final-other": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Routing to a human officer",
    thinking: [
      "Logging the case against your relationship file",
      "Routing to a Servicing officer with 1-working-day SLA",
    ],
    tools: [{ icon: "📂", label: "Case routing" }],
    responseHtml: `<p>I've logged this and routed it to a Servicing officer. Case <b>#SRV-${Math.floor(Math.random()*9000+1000)}</b>. You'll get a response within one working day, and the case will show under <i>Help → Open tickets</i>.</p>`,
    options: [
      { label: "Back to card help options", goTo: "a-serv-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Statement self-serve (View / Insights / Print / Email) ──────────
  "a-serv-statement-q1": {
    type: "clarify",
    thinking: [
      "Pulling your May cycle on •• 4108 · 18 Apr → 17 May",
      "Total spends ₹41,220 · payment due 18 May",
    ],
    agent: "Aria",
    routingReason: "Statement self-serve",
    responseHtml: `<p>Sure — here's your current statement at a glance.</p>

<div class="card transaction">
  <div class="card-row"><span class="muted">Card</span><span><b>Visa Platinum</b> · •• 4108</span></div>
  <div class="card-row"><span class="muted">Cycle</span><span>18 Apr → 17 May</span></div>
  <div class="card-row"><span class="muted">Total spends</span><span class="amount">₹41,220</span></div>
  <div class="card-row"><span class="muted">Payment due</span><span><b>₹41,220</b> · 18 May</span></div>
  <div class="card-row"><span class="muted">Minimum due</span><span>₹2,062</span></div>
</div>

<p>What would you like to do with it?</p>`,
    options: [
      { label: "View the May statement",        goTo: "a-serv-statement-view",     triggers: ["view", "open", "show"] },
      { label: "Show me insights on this cycle", goTo: "a-serv-statement-insights", triggers: ["insight", "analyse", "analyze", "trend"] },
      { label: "Print the statement",            goTo: "a-serv-statement-print",    triggers: ["print"] },
      { label: "Email me a PDF copy",            goTo: "a-serv-statement-email",    triggers: ["email", "mail", "send"] },
      { label: "Back to card help options",      goTo: "a-serv-q1",                 triggers: ["back", "card help", "menu"] },
    ],
  },

  "a-serv-statement-view": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Statement preview · in-chat",
    thinking: [
      "Loading the May cycle ledger · •• 4108",
      "Pulling top transactions ordered by date",
    ],
    tools: [
      { icon: "📄", label: "Statement ledger" },
      { icon: "💳", label: "Card transactions" },
    ],
    responseHtml: `<p>Here's your May statement at a glance.</p>

<div class="card">
  <div class="card-head"><b>Visa Platinum · •• 4108</b><span class="pill ghost">18 Apr → 17 May</span></div>
  <div class="kfs compact">
    <div><span class="muted">Opening balance</span><b>₹0</b></div>
    <div><span class="muted">Total spends</span><b>₹41,220</b></div>
    <div><span class="muted">Payment due</span><b>₹41,220 · 18 May</b></div>
    <div><span class="muted">Minimum due</span><b>₹2,062</b></div>
  </div>

  <div class="card-row"><span class="muted">2 May · Swiggy Instamart</span><span class="amount">₹2,140</span></div>
  <div class="card-row"><span class="muted">5 May · BPCL fuel · Whitefield</span><span class="amount">₹3,200</span></div>
  <div class="card-row"><span class="muted">8 May · Apple Music + iCloud</span><span class="amount">₹5,499</span></div>
  <div class="card-row"><span class="muted">10 May · Zomato</span><span class="amount">₹1,860</span></div>
  <div class="card-row"><span class="muted">12 May · QUICKSTREAM MEDIA · GB</span><span class="amount">₹3,499</span></div>
  <div class="card-row"><span class="muted">15 May · Amazon · electronics</span><span class="amount">₹8,990</span></div>

  <p class="card-foot muted">Showing 6 of 38 transactions. Full PDF available under <i>Money → Statements</i> — bank-signed under IT Act § 5.</p>
</div>`,
    options: [
      { label: "Back to statement options", goTo: "a-serv-statement-q1" },
    ],
    terminal: true,
  },

  "a-serv-statement-insights": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Statement insights · spend categorisation",
    thinking: [
      "Categorising 38 May transactions across 7 merchant categories",
      "Comparing month-over-month against April cycle",
      "Flagging anomalies against your 6-month merchant pattern",
    ],
    tools: [
      { icon: "📊", label: "Spend categorisation" },
      { icon: "📈", label: "Month-over-month" },
      { icon: "🌍", label: "Geo-pattern check" },
    ],
    responseHtml: `<p>Three things stand out this cycle.</p>

<div class="card option">
  <div class="card-head"><b>Where it went · top 3 categories</b><span class="pill primary">May cycle</span></div>
  <div class="kfs compact">
    <div><span class="muted">Food &amp; delivery</span><b>₹8,420 · +18% vs Apr</b></div>
    <div><span class="muted">Subscriptions</span><b>₹6,899 · +₹2,400 vs Apr</b></div>
    <div><span class="muted">Fuel &amp; commute</span><b>₹5,600 · flat vs Apr</b></div>
  </div>
  <p class="card-foot muted">Biggest single spend · Apple Music + iCloud bundle <b>₹5,499</b> on 8 May. MoM delta <b>+₹3,140</b> vs April — almost all of it sits in subscriptions.</p>
</div>

<div class="card transaction alert">
  <div class="card-row"><span class="muted">Anomaly flagged</span><span><b>QUICKSTREAM MEDIA · GB</b> · 12 May</span></div>
  <div class="card-row"><span class="muted">Amount</span><span class="amount">₹3,499</span></div>
  <div class="card-row"><span class="muted">Why I noticed</span><span>Card-not-present · GB origin · no match in your 6-month merchant list</span></div>
  <p class="card-foot muted">Already raised in the dispute flow — under the RBI Customer Liability Framework, reporting inside 3 working days keeps your liability at zero.</p>
</div>

<div class="note">If you'd like me to cap food-delivery spends at <b>₹6,000/mo</b> via a Standing Rule, you'd save ~<b>₹2,400/mo</b> on this card alone. I'll surface the rule for your approval — no auto-enforcement until you tap.</div>`,
    options: [
      { label: "Back to statement options", goTo: "a-serv-statement-q1" },
    ],
    terminal: true,
  },

  "a-serv-statement-print": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Print job · digitally signed PDF",
    thinking: [
      "Generating the bank-signed PDF for May cycle",
      "Routing to your default printer · falling back to phone Downloads",
    ],
    tools: [
      { icon: "🖨️", label: "Print job" },
      { icon: "🔏", label: "IT Act § 5 signature" },
    ],
    responseHtml: `<p>Print-ready PDF generated.</p>

<div class="card">
  <div class="card-row"><span class="muted">Document</span><span><b>Statement · Visa Platinum •• 4108</b></span></div>
  <div class="card-row"><span class="muted">Cycle</span><span>18 Apr → 17 May</span></div>
  <div class="card-row"><span class="muted">Pages</span><span>4 · A4</span></div>
  <div class="card-row"><span class="muted">Sent to</span><span>Your default printer · also saved to Downloads</span></div>
</div>

<div class="note">The PDF is <b>digitally signed under IT Act § 5</b>, so it's accepted as proof of statement by most institutions — visas, loan applications, KYC re-verifications.</div>`,
    options: [
      { label: "Back to statement options", goTo: "a-serv-statement-q1" },
    ],
    terminal: true,
  },

  "a-serv-statement-email": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Email statement · registered address",
    thinking: [
      "Composing PDF + categorised Excel for May cycle",
      "Verifying your registered email · arjun.•••@gmail.com",
      "Queueing on the secure mail relay",
    ],
    tools: [
      { icon: "📧", label: "Secure mail relay" },
      { icon: "🔏", label: "IT Act § 5 signature" },
    ],
    responseHtml: `<p>Sending the <b>May statement</b> to your registered email.</p>

<div class="card">
  <div class="card-row"><span class="muted">To</span><span><b>arjun.•••@gmail.com</b></span></div>
  <div class="card-row"><span class="muted">Attachments</span><span>PDF · bank-signed · 4 pages</span></div>
  <div class="card-row"><span class="muted"></span><span>Excel · categorised · 38 rows</span></div>
  <div class="card-row"><span class="muted">Delivery</span><span>Under a minute · I'll ping you once it lands</span></div>
</div>

<div class="note">Same <b>IT Act § 5</b> digital signature applies. If your email address has changed, update it under <i>Settings → Profile</i> and I'll resend.</div>`,
    options: [
      { label: "Back to statement options", goTo: "a-serv-statement-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Sales tree ──────────
  "a-sales-q1": {
    type: "clarify",
    thinking: [
      "Pulling your card portfolio · 1 credit, 1 debit, 7 tokenised merchants",
      "Standing by for the spending question",
    ],
    agent: "Aria",
    routingReason: "Narrowing the card question",
    responseHtml: `<p>Sure. Which one were you thinking about?</p>`,
    options: [
      { label: "Should I upgrade my credit card?", goTo: "a-sales-q2-up", triggers: ["upgrade", "credit card"] },
      { label: "Add another card to the mix", goTo: "a-sales-final-add", triggers: ["add", "another", "second"] },
      { label: "Just review my spending patterns", goTo: "a-sales-final-review", triggers: ["spend", "spending", "pattern", "review"] },
    ],
  },
  "a-sales-q2-up": {
    type: "clarify",
    thinking: [
      "Reading 6 months of card swipes · ₹95k average monthly spend",
      "Tilting the recommendation",
    ],
    agent: "Aria",
    routingReason: "Tilting the recommendation",
    responseHtml: `<p>Last 6 months your dining + online + travel adds up to <b>74% of your card spend</b>. What matters most to you?</p>`,
    options: [
      { label: "Travel + lounge access",     goTo: "a-sales-final-up" },
      { label: "Dining & online cashback",   goTo: "a-sales-final-up" },
      { label: "Show me both, side by side", goTo: "a-sales-final-up" },
      { label: "Back to card options",       goTo: "a-sales-q1" },
    ],
  },
  "a-sales-final-up": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Next-best-action · card upgrade",
    thinking: [
      "Categorising 6-month spend · dining 32%, online 24%, travel 18%, rest 26%",
      "Modelling reward yield · current 1× flat vs Platinum Travel 4×/2×/1× vs Dine&Shop 5%/3%/1%",
      "Checking your pre-approved limits · both options are warm internally",
      "Confirming MITC disclosure obligations before recommending",
    ],
    tools: [
      { icon: "🧮", label: "Spend categoriser" },
      { icon: "🎯", label: "NBA engine" },
      { icon: "📑", label: "MITC compliance check" },
    ],
    responseHtml: `
<p>Two cards meaningfully beat what you carry now. Both pre-approved — no fresh CIBIL pull needed.</p>

<div class="card chart-card">
  <div class="card-head"><b>Where your card actually goes</b></div>
  <div class="bar"><div class="bar-fill" style="width:64%;background:linear-gradient(90deg,#7C5CFF,#B66DFF)"></div><span>Dining · 32%</span></div>
  <div class="bar"><div class="bar-fill" style="width:48%;background:linear-gradient(90deg,#22C8B2,#36E2C8)"></div><span>Online shopping · 24%</span></div>
  <div class="bar"><div class="bar-fill" style="width:36%;background:linear-gradient(90deg,#F472B6,#FB7299)"></div><span>Travel · 18%</span></div>
  <div class="bar"><div class="bar-fill" style="width:22%;background:linear-gradient(90deg,#94A3B8,#CBD5E1)"></div><span>Everything else · 26%</span></div>
</div>

<div class="card option">
  <div class="card-head"><b>Platinum Travel Card</b><span class="pill primary">Best yield for you</span></div>
  <div class="kfs compact">
    <div><span class="muted">Annual fee</span><b>₹2,500 (waived above ₹4L spend)</b></div>
    <div><span class="muted">Rewards</span><b>4× travel · 2× dining · 1× rest</b></div>
    <div><span class="muted">Perks</span><b>8 domestic lounge visits · zero forex on intl. swipe</b></div>
    <div><span class="muted">Modelled net benefit</span><b>+₹14,800 / year</b></div>
  </div>
</div>

<div class="card option">
  <div class="card-head"><b>Dine & Shop Card</b><span class="pill ghost">Simpler</span></div>
  <div class="kfs compact">
    <div><span class="muted">Annual fee</span><b>₹999</b></div>
    <div><span class="muted">Rewards</span><b>5% cashback on dining · 3% online · 1% rest</b></div>
    <div><span class="muted">Modelled net benefit</span><b>+₹9,200 / year</b></div>
  </div>
</div>

<div class="note compliance">Net-benefit numbers are after fees and assume your current spend shape holds. The full <b>Most Important Terms &amp; Conditions (MITC)</b> appears before you accept — finance charge, late fee, surcharge waiver, all set per RBI norms.</div>
`,
    options: [
      { label: "Apply for the Platinum Travel",          goTo: "a-cardapp-platinum-active" },
      { label: "Model what changes if dining drops 30%", goTo: "a-sales-final-up" },
      { label: "Back to card options",                   goTo: "a-sales-q1" },
    ],
    terminal: true,
  },
  "a-sales-final-add": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Card portfolio · second-card sizing",
    thinking: [
      "Reading your utilisation · 16% of ₹2,50,000 on •• 4108",
      "Scanning under-rewarded categories · fuel (0% on current card, ~₹7k/mo) and overseas (3.5% markup)",
    ],
    tools: [{ icon: "🧮", label: "Spend categoriser" }, { icon: "📊", label: "Credit limit analyser" }],
    responseHtml: `<p>Adding a second card only helps if it covers a gap your current card doesn't. Two patterns from your data are interesting: <b>fuel</b> (you pay ₹6–8k/month, your current card gives 0%) and <b>foreign currency</b> (you swiped overseas twice last quarter at 3.5% markup).</p>
<p>A <b>fuel card</b> would save you ~₹2,300/year on its own. A <b>zero-FX travel card</b> would save 3.5% on every overseas swipe. Want me to lay both side by side?</p>`,
    options: [
      { label: "Back to card options", goTo: "a-sales-q1" },
    ],
    terminal: true,
  },
  "a-sales-final-review": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Spend review",
    thinking: [
      "Pulling 6-month spend by category",
      "Flagging March online spike · ₹38k vs your typical ₹18–22k",
      "Detecting 3 dormant subscriptions · ₹2,400/month leakage",
    ],
    tools: [{ icon: "🧮", label: "Spend categoriser" }],
    responseHtml: `<p>Your 6-month spend shape: dining 32%, online 24%, travel 18%, rest 26%. Three things worth noting:</p>
<ul class="actions-list">
  <li><b>Dining is up 18% YoY</b> — you've added 4 new restaurants to your regulars list.</li>
  <li><b>Online shopping spike in March</b> — ₹38k vs your usual ₹18–22k. Worth a glance.</li>
  <li><b>Subscription leakage of ₹2,400/month</b> — three services you haven't used in 60+ days.</li>
</ul>
<p>I can cancel the unused subscriptions for you if you'd like.</p>`,
    options: [
      { label: "Back to card options", goTo: "a-sales-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Growth tree ──────────
  "a-growth-q1": {
    type: "clarify",
    thinking: [
      "Reading recent signals · 2 flight searches to GOI in the last 8 days",
      "Standing by to plan",
    ],
    agent: "Aria",
    routingReason: "Narrowing the goal",
    responseHtml: `<p>Tell me a bit more. What are you planning?</p>`,
    options: [
      { label: "A trip / vacation", goTo: "a-growth-q2-trip", triggers: ["trip", "travel", "vacation", "holiday", "goa", "flight"] },
      { label: "A big purchase (phone, laptop, etc.)", goTo: "a-growth-final-purchase", triggers: ["phone", "laptop", "buy"] },
      { label: "Long-term savings / investment", goTo: "a-growth-final-saving", triggers: ["savings", "invest", "long term"] },
    ],
  },
  "a-growth-q2-trip": {
    type: "clarify",
    thinking: [
      "Confirming travel intent · BLR→GOI searches on 11 May and 15 May",
      "Checking rewards liquidity · 18,400 points (₹18,400 redeemable)",
    ],
    agent: "Aria",
    routingReason: "Trip details",
    responseHtml: `<p>I noticed two flight searches in the last week. Domestic, international, or still deciding?</p>`,
    options: [
      { label: "Domestic — Goa",           goTo: "a-growth-final-trip" },
      { label: "International",            goTo: "a-growth-final-intl" },
      { label: "Still deciding",           goTo: "a-growth-final-trip" },
      { label: "Back to planning options", goTo: "a-growth-q1" },
    ],
  },
  "a-growth-final-trip": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Travel intent · personalised partner offers",
    thinking: [
      "Pulling live travel partners under our Payment Aggregator licence",
      "Checking your rewards · 18,400 points · 2,400 expiring 30 Sep",
      "Modelling overseas swipe markup · 3.5% on Visa Signature vs 0% on Zero-FX Forex Card",
    ],
    tools: [
      { icon: "✈️", label: "Travel partners" },
      { icon: "💱", label: "Forex card · FEMA/LRS" },
      { icon: "🎁", label: "Rewards balance" },
    ],
    responseHtml: `
<p>Good timing. Your reward balance is healthier than you might think — and there's a forex play worth flagging.</p>

<div class="card option">
  <div class="card-head"><b>Taj Holiday Village · 4 nights</b><span class="pill primary">22% off</span></div>
  <p class="muted">Sea-view, breakfast included. ₹3,000 dining credit when paid with your bank card. Free cancellation till 7 days before check-in.</p>
  <div class="kfs compact">
    <div><span class="muted">Total</span><b>₹38,400 → ₹29,950</b></div>
    <div><span class="muted">Cashback</span><b>5% to card · ₹1,498</b></div>
  </div>
</div>

<div class="card option">
  <div class="card-head"><b>IndiGo · BLR → GOI return</b><span class="pill ghost">Pay with points</span></div>
  <p class="muted">Your 18,400 reward points cover roughly <b>70% of a return ticket</b> in next month's window. Balance billed to your card.</p>
</div>

<div class="card option">
  <div class="card-head"><b>Zero-FX Multi-Currency Forex Card</b><span class="pill warn">Recommended</span></div>
  <p class="muted">Issued digitally in two minutes, physical card delivered before travel. Zero markup on USD, EUR, THB swipes. Reload up to USD 2,50,000 in a financial year under FEMA's Liberalised Remittance Scheme.</p>
  <div class="kfs compact">
    <div><span class="muted">Card fee</span><b>Waived if loaded ≥ ₹50,000</b></div>
    <div><span class="muted">Vs your current card</span><b>Saves 3.5% on every overseas swipe</b></div>
  </div>
</div>

<div class="note">All three partners are integrated under RBI's Payment Aggregator framework — settlement, refund, and dispute rails sit on the same protections as a direct bank purchase.</div>
`,
    options: [
      { label: "Book the Taj first",        goTo: "a-growth-taj-booking" },
      { label: "Set up the forex card now", goTo: "a-growth-forex-active" },
      { label: "Back to planning options",  goTo: "a-growth-q1" },
    ],
    terminal: true,
  },
  "a-growth-final-intl": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "International travel planning",
    thinking: [
      "Reading your FY27 LRS usage · USD 4,200 of USD 2,50,000 (1.7%) — plenty of room",
      "Listing partner offers in your declared destination range",
    ],
    tools: [{ icon: "💱", label: "Forex card · FEMA/LRS" }, { icon: "✈️", label: "Travel partners" }],
    responseHtml: `<p>You've used <b>USD 4,200 of your USD 2,50,000 LRS limit</b> this financial year, so plenty of room. The forex card is a clear win (saves 3.5% per swipe) and I can have it active in two minutes. Where to?</p>`,
    options: [
      { label: "Back to planning options", goTo: "a-growth-q1" },
    ],
    terminal: true,
  },
  "a-growth-final-purchase": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Big-ticket purchase",
    thinking: [
      "Listing partner cashback offers across your high-spend categories",
      "Modelling no-cost EMI eligibility on your Visa Signature (₹2.08L headroom)",
    ],
    tools: [{ icon: "🏷️", label: "Partner offer engine" }, { icon: "🧮", label: "EMI calculator" }],
    responseHtml: `<p>I can usually find the right combination of partner cashback + no-cost EMI on your card. Tell me what you're looking at and I'll fetch live offers from our marketplace.</p>`,
    options: [
      { label: "Back to planning options", goTo: "a-growth-q1" },
    ],
    terminal: true,
  },
  "a-growth-final-saving": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Long-term savings",
    thinking: [
      "Reading your Equity-Hybrid SIP · ₹2,18,460 corpus · ₹15,000/month · +4.2% MTD",
      "Modelling target-based plans against your ₹1.85L salary",
    ],
    tools: [{ icon: "📊", label: "Goal planner" }],
    responseHtml: `<p>Your ₹15,000 SIP is a strong base. For a 7–10 year horizon I'd want to know your goal — house down-payment, child's education, retirement — before recommending the next ₹10k allocation. Which is it for you?</p>`,
    options: [
      { label: "Back to planning options", goTo: "a-growth-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Used-car 3-option financing ──────────
  "a-growth-used-car-final": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Used-car · 3-option financing",
    thinking: [
      "Reading your CIBIL band · 812 (prime+)",
      "Modelling three financing options against your ₹3.12L savings + ₹4.85L–₹4.92L trade-in",
      "Comparing pre-approved Pre-Sanction Loan rate vs standard used-car loan",
      "Pulling Spinny + Cars24 trade-in valuations for your Hyundai i20",
    ],
    tools: [
      { icon: "🏦", label: "Credit policy" },
      { icon: "🚗", label: "Used-car partners" },
      { icon: "🧮", label: "EMI calculator" },
      { icon: "💱", label: "Trade-in valuation" },
    ],
    responseHtml: `
<p>Three clean options. I've ranked them by what saves you the most over the life of the car. The Honda is ₹9.80L listed; with your trade-in netted out, your real outlay drops to ₹4.95–5.0L depending on the valuation you accept.</p>

<div class="card option">
  <div class="card-head"><b>Option 1 · Own cash + trade-in</b><span class="pill primary">Cheapest over 5 years</span></div>
  <div class="kfs compact">
    <div><span class="muted">Cash from your savings</span><b>₹2,00,000</b></div>
    <div><span class="muted">Trade-in (Cars24, higher)</span><b>₹4,92,000</b></div>
    <div><span class="muted">PSL top-up (small bridge)</span><b>₹2,88,000</b></div>
    <div><span class="muted">Total interest paid · 36 months</span><b>~₹38,500</b></div>
  </div>
  <p class="card-foot muted">Lowest cost. Keeps your SIP corpus intact. Bridge loan pre-sanctioned at 9.25%.</p>
</div>

<div class="card option">
  <div class="card-head"><b>Option 2 · Standard used-car loan</b><span class="pill ghost">Faster</span></div>
  <div class="kfs compact">
    <div><span class="muted">Loan amount</span><b>₹7,00,000</b></div>
    <div><span class="muted">Rate (APR)</span><b>11.50% p.a.</b></div>
    <div><span class="muted">Tenure</span><b>48 months</b></div>
    <div><span class="muted">Indicative EMI</span><b>₹18,250</b></div>
    <div><span class="muted">Total interest · 48 months</span><b>~₹1,76,000</b></div>
  </div>
  <p class="card-foot muted">No trade-in dependency. Disburses in 24 hours. KFS issued per RBI Digital Lending Guidelines.</p>
</div>

<div class="card option">
  <div class="card-head"><b>Option 3 · PSL pre-approved · trade-in netted</b><span class="pill primary">Recommended</span></div>
  <div class="kfs compact">
    <div><span class="muted">Trade-in (Cars24)</span><b>₹4,92,000</b></div>
    <div><span class="muted">PSL pre-approved</span><b>₹5,00,000</b></div>
    <div><span class="muted">Rate (APR)</span><b>9.85% p.a. (relationship rate)</b></div>
    <div><span class="muted">Tenure</span><b>36 months</b></div>
    <div><span class="muted">Indicative EMI</span><b>₹16,100</b></div>
    <div><span class="muted">Total interest · 36 months</span><b>~₹79,600</b></div>
  </div>
  <p class="card-foot muted">Best balance · ₹1.0L lower interest than Option 2 · keeps ₹1.1L of savings as buffer · 3-day cooling-off as per RBI norms.</p>
</div>

<div class="note compliance">
  <b>One consent to confirm.</b> To lock the relationship rate I'd pull your last 6 months of salary credits and the i20 RC + insurance documents — single-purpose Account Aggregator consent, time-bound (60 days), revocable from Settings → Data sharing. Cars24 is integrated under our marketplace partnership; the trade-in payment lands in your savings account before the new car is registered to you.
</div>
`,
    options: [
      { label: "Go with Option 3 — proceed to pre-approval", goTo: "a-orig-summary" },
      { label: "Side-by-side total cost (5 years)",        goTo: "a-growth-used-car-final" },
      { label: "Back to car options",                      goTo: "a-carbuy-q1" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Car-buying entry (NBA card → used-car flow) ──────────
  "a-carbuy-q1": {
    type: "clarify",
    thinking: [
      "Pulling the Honda City listing from Spinny Whitefield · 28,400 km · 2022 · ₹9.80L",
      "Reading your CIBIL band · 812 · prime+",
      "Modelling 3 financing options against your ₹3.12L savings + ₹4.85–4.92L trade-in",
    ],
    tools: [
      { icon: "🚗", label: "Used-car partners" },
      { icon: "🏦", label: "Credit policy" },
      { icon: "💱", label: "Trade-in valuation" },
    ],
    agent: "Sales & Advisory Agent",
    routingReason: "Used-car · proceeding to financing options",
    responseHtml: `<p>Quick confirm and I'll lay out the 3 options.</p>
<p>The car is the Honda City <b>N-Line N8 CVT, 2022</b>, 28,400 km, single owner, A+ inspection, Spinny Whitefield · listed <b>₹9.80L</b>. Trade-in on your i20: Spinny ₹4.85L / Cars24 ₹4.92L. CIBIL 812 puts you in <b>PSL pre-approved at 9.4%</b>.</p>
<p>Want me to walk you through the 3 financing options now, or test-drive first?</p>`,
    options: [
      { label: "Walk me through the 3 options", goTo: "a-growth-used-car-final" },
      { label: "Schedule a test drive first", goTo: "a-growth-final-purchase" },
    ],
  },

  // ────────── Arjun · Salary-increment NBA (Phase 1 in-scope) ──────────
  "a-growth-salary-bump-final": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Salary increment · allocation options",
    thinking: [
      "Reading your last 4 salary credits · ₹1.85L → ₹1.85L → ₹1.85L → ₹2.05L (10.8% bump on 2 May)",
      "Checking your current SIP utilisation · ₹15K/mo · ₹2.18L corpus · last reviewed Nov",
      "Pulling your term-life cover · ₹50L policy · Aditi as nominee · last raised in 2022",
      "Modelling 3 allocation options against your 20-year financial trajectory",
    ],
    tools: [
      { icon: "💰", label: "Income pattern" },
      { icon: "📊", label: "SIP planner" },
      { icon: "🛡", label: "Insurance gap analyser" },
    ],
    responseHtml: `
<p>Good news handled cleanly. Your salary bumped from ₹1,85,000 to ₹2,05,000 on 2 May — a sustainable ₹20K/mo of new bandwidth. Lifestyle creep eats this if you don't act in the first 60 days, so let me show you three options.</p>

<div class="card option">
  <div class="card-head"><b>Option 1 · Bump SIP by ₹3,000/mo</b><span class="pill primary">Compounding</span></div>
  <div class="kfs compact">
    <div><span class="muted">New monthly SIP</span><b>₹18,000</b></div>
    <div><span class="muted">10-year corpus added</span><b>+₹4,20,000</b></div>
    <div><span class="muted">% of increment</span><b>15%</b></div>
  </div>
  <p class="card-foot muted">Reaches your home-down-payment goal ~14 months earlier. Modelled at 11% CAGR equity hybrid · disclosure: market-linked, past returns don't guarantee future ones.</p>
</div>

<div class="card option">
  <div class="card-head"><b>Option 2 · Top up term-life cover</b><span class="pill ghost">Protection</span></div>
  <div class="kfs compact">
    <div><span class="muted">Current cover</span><b>₹50,00,000</b></div>
    <div><span class="muted">Proposed</span><b>₹1,00,00,000</b></div>
    <div><span class="muted">Premium delta</span><b>~₹400/mo</b></div>
    <div><span class="muted">Cover gap addressed</span><b>~40% (pending issuance)</b></div>
  </div>
  <p class="card-foot muted">10× rule of thumb says your cover should be ~₹2.4 Cr at ₹2L salary. This closes about 40% of the gap. Section 80C eligible.</p>
</div>

<div class="card option">
  <div class="card-head"><b>Option 3 · Split 50/50 (recommended)</b><span class="pill primary">Balanced</span></div>
  <div class="kfs compact">
    <div><span class="muted">SIP bump</span><b>+₹1,500/mo</b></div>
    <div><span class="muted">Term-life top-up</span><b>+₹400/mo</b></div>
    <div><span class="muted">Free cash flow preserved</span><b>₹8,100/mo</b></div>
  </div>
  <p class="card-foot muted">My recommendation. Covers compounding + protection without consuming the whole increment — keeps ~40% of the new bandwidth for discretionary or buffer.</p>
</div>

<div class="note compliance">
  Premium quotes are indicative. Full <b>MITC</b> appears before you accept any policy upgrade. Term-life claim settlement ratios are public in IRDAI's annual report and we'll surface them inside the apply flow.
</div>
`,
    options: [
      { label: "Go with Option 3 — Split 50/50 (recommended)", goTo: "a-salary-plan-3" },
      { label: "Lock in Option 1 — Bump SIP by ₹3,000/mo",     goTo: "a-salary-plan-1" },
      { label: "Lock in Option 2 — Top up term-life cover",    goTo: "a-salary-plan-2" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Salary allocation · Plan in motion (3 variants) ──────────
  "a-salary-plan-3": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Balanced plan activated · execution layer",
    thinking: [
      "Composing the balanced plan against your ₹20K/mo new bandwidth",
      "Booking SIP top-up · ₹15,000 → ₹16,500 from 5 June",
      "Queueing term-life policy comparison · 4 IRDAI-licensed insurers",
      "Setting cash-flow guardrail · floor ₹8,100/mo",
      "Scheduling 60-day plan review · 21 July",
    ],
    tools: [
      { icon: "📋", label: "Plan composer" },
      { icon: "📊", label: "SIP mandate engine" },
      { icon: "🛡", label: "Insurance comparator" },
      { icon: "📈", label: "Cash-flow watch" },
    ],
    responseHtml: `<p><b>Balanced plan activated.</b> SIP top-up booked, policy comparison started, buffer under watch. Taking you to <i>Today</i> so you can see progress live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "a-salary-plan-1": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Compounding plan activated · execution layer",
    thinking: [
      "Composing the compounding plan against your ₹20K/mo new bandwidth",
      "Booking SIP top-up · ₹15,000 → ₹18,000 from 5 June",
      "Setting cash-flow guardrail · floor ₹17,000/mo un-allocated",
      "Scheduling 60-day plan review · 21 July",
    ],
    tools: [
      { icon: "📋", label: "Plan composer" },
      { icon: "📊", label: "SIP mandate engine" },
      { icon: "📈", label: "Cash-flow watch" },
    ],
    responseHtml: `<p><b>Compounding plan activated.</b> SIP top-up booked, the rest stays as un-allocated bandwidth under watch. Taking you to <i>Today</i> so you can see progress live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "a-salary-plan-2": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Protection plan activated · execution layer",
    thinking: [
      "Composing the protection plan against your ₹20K/mo new bandwidth",
      "Queueing term-life policy comparison · 4 IRDAI-licensed insurers",
      "Setting cash-flow guardrail · floor ₹19,600/mo un-allocated",
      "Scheduling 60-day plan review · 21 July",
    ],
    tools: [
      { icon: "📋", label: "Plan composer" },
      { icon: "🛡", label: "Insurance comparator" },
      { icon: "📈", label: "Cash-flow watch" },
    ],
    responseHtml: `<p><b>Protection plan activated.</b> Policy comparison started, the rest of your increment stays as un-allocated bandwidth under watch. Taking you to <i>Today</i> so you can see progress live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  // SIP approval flow · still reachable from the Today tracker via "View receipt"
  // on the salary-3-approved card — provides the audit trail / receipt detail
  // for users who want to see exactly what changed.
  "a-salary-approved-sip": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "SIP top-up receipt · audit trail",
    thinking: [
      "Loading SIP mandate amendment record",
      "Fetching immutable audit-log entry · ref SIP-AMD-9118",
    ],
    tools: [
      { icon: "✅", label: "SIP mandate engine" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p>Receipt for the SIP top-up that's now active.</p>

<div class="card transaction">
  <div class="card-row"><span class="muted">SIP amendment</span><span><b>₹15,000 → ₹16,500/mo</b></span></div>
  <div class="card-row"><span class="muted">First new debit</span><span>5 June · auto · •• 7731</span></div>
  <div class="card-row"><span class="muted">Audit ref</span><span>SIP-AMD-9118 · immutable</span></div>
  <div class="card-row"><span class="muted">Confirmation</span><span>Sent to arjun.•••@gmail.com</span></div>
</div>

<div class="note">Cancel any time from <i>Investments → SIP → Modify</i>. Mutual fund investments are subject to market risks; AMFI registered distributor ARN 19xxxx.</div>`,
    options: [
      { label: "Back to allocation options", goTo: "a-growth-salary-bump-final" },
    ],
    terminal: true,
  },

  // ════════════════════════════════════════════════════════════════════════
  // Arjun · Car-buying workspace · chat-side stages
  // (marketplace + deal room live in FEATURE_SCREENS · these are the chat
  // moments — financing picker, approval, action acks)
  // ════════════════════════════════════════════════════════════════════════

  "a-carbuy-finance-pick": {
    type: "clarify",
    agent: "Aria",
    routingReason: "Honda City · choose how to pay",
    thinking: [
      "Pulling pre-approved relationship rate · 9.85% PSL",
      "Modelling 3 financing routes against your i20 trade-in",
      "Recommending the lowest-friction option",
    ],
    tools: [
      { icon: "🧮", label: "EMI calculator" },
      { icon: "🏦", label: "Credit policy" },
      { icon: "💱", label: "Trade-in valuation" },
    ],
    responseHtml: `<p>Three ways to pay for the Honda City. I've ranked them — your i20 trade-in works hardest under option one.</p>

<div class="finance-pick-card">
  <div class="finance-pick-row recommended">
    <div class="finance-pick-radio">●</div>
    <div class="finance-pick-main">
      <div class="finance-pick-title"><b>Trade-in + relationship loan</b><span class="finance-pick-tag">Recommended</span></div>
      <div class="finance-pick-numbers"><span><b>₹16,100</b>/mo</span><span>36 mo</span><span>9.85% APR</span></div>
      <div class="finance-pick-note muted">Uses your i20 net of ₹4.92L · keeps SIP intact · no corpus withdrawal</div>
    </div>
  </div>
  <div class="finance-pick-row">
    <div class="finance-pick-radio">○</div>
    <div class="finance-pick-main">
      <div class="finance-pick-title"><b>Higher down payment</b><span class="finance-pick-tag ghost">Lowest interest</span></div>
      <div class="finance-pick-numbers"><span><b>₹13,200</b>/mo</span><span>36 mo</span><span>9.85% APR</span></div>
      <div class="finance-pick-note muted">Uses ₹2L more cash up front · saves ~₹19,000 in total interest</div>
    </div>
  </div>
  <div class="finance-pick-row">
    <div class="finance-pick-radio">○</div>
    <div class="finance-pick-main">
      <div class="finance-pick-title"><b>Standard used-car loan</b><span class="finance-pick-tag ghost">Fastest</span></div>
      <div class="finance-pick-numbers"><span><b>₹18,250</b>/mo</span><span>48 mo</span><span>11.50% APR</span></div>
      <div class="finance-pick-note muted">No trade-in dependency · disburses in 24 hours</div>
    </div>
  </div>
</div>

<div class="note">All routes carry a full Key Fact Statement before sanction per RBI Digital Lending Guidelines.</div>`,
    options: [
      { label: "Continue with recommended", goTo: "a-carbuy-approve" },
      { label: "Edit down payment",         goTo: "a-carbuy-finance-pick" },
      { label: "Back to deal room",         goTo: "__open-carbuy-deal__" },
    ],
  },

  "a-carbuy-approve": {
    type: "final",
    agent: "Origination Agent",
    routingReason: "Final approval · KFS + consent",
    thinking: [
      "Pulling e-KYC vault · Aadhaar •••• 4821 · PAN matched ITR",
      "Confirming CIBIL band · 812 · prime+",
      "Reading last 6 months of salary credits · stable ₹2.05L",
      "Drafting Key Fact Statement per RBI Digital Lending Guidelines",
      "Setting cooling-off window · 3 days post-disbursal",
      "Cueing immutable audit-log entry · ref ORIG-7842",
    ],
    tools: [
      { icon: "🪪", label: "e-KYC vault" },
      { icon: "📊", label: "Credit bureau (CIBIL)" },
      { icon: "📑", label: "KFS engine" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p>One approval to proceed. I'll verify the checklist below and surface the Key Fact Statement before any disbursal.</p>

<div class="approve-card">
  <div class="approve-head">Verification checklist</div>
  <div class="approve-row done">
    <span class="approve-mark">✓</span>
    <div><b>KYC</b> · Aadhaar •••• 4821 (vault) · PAN matched ITR</div>
  </div>
  <div class="approve-row done">
    <span class="approve-mark">✓</span>
    <div><b>Salary credits</b> · last 6 months · stable ₹2.05L</div>
  </div>
  <div class="approve-row done">
    <span class="approve-mark">✓</span>
    <div><b>CIBIL</b> · 812 · prime+ band</div>
  </div>
  <div class="approve-row pending">
    <span class="approve-mark">○</span>
    <div><b>i20 RC + insurance</b> · needed for trade-in confirmation</div>
  </div>
  <div class="approve-row pending">
    <span class="approve-mark">○</span>
    <div><b>Honda City listing</b> · attached from Spinny Whitefield</div>
  </div>
</div>

<div class="approve-card">
  <div class="approve-head">Key Fact Statement</div>
  <div class="approve-kfs">
    <div><span class="muted">Loan principal</span><b>₹5,00,000</b></div>
    <div><span class="muted">APR</span><b>9.85% p.a.</b></div>
    <div><span class="muted">Tenure</span><b>36 months</b></div>
    <div><span class="muted">EMI</span><b>₹16,100/mo</b></div>
    <div><span class="muted">Processing fee</span><b>₹5,000 + GST</b></div>
    <div><span class="muted">Cooling-off</span><b>3 days post-disbursal</b></div>
    <div><span class="muted">First EMI</span><b>5 July</b></div>
    <div><span class="muted">Total interest</span><b>~₹79,600</b></div>
  </div>
</div>

<div class="note compliance">No dealer payment, no policy submission, no money movement until you tap <b>Approve and proceed</b>. Per RBI Digital Lending Guidelines, you have 3 working days to reverse without penalty after disbursal.</div>`,
    options: [
      { label: "Approve and proceed",   goTo: "a-orig-disbursal-active" },
      { label: "Save and decide later", goTo: "__open-carbuy-deal__" },
    ],
    terminal: true,
  },

  "a-carbuy-testdrive-ack": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Test drive · slot requested",
    thinking: [
      "Pinging Spinny Whitefield · partner integration",
      "Holding a Saturday morning window · subject to seller confirmation",
      "Adding to your calendar tentatively · revocable",
    ],
    tools: [
      { icon: "🗓", label: "Partner calendar" },
      { icon: "🚗", label: "Used-car partners" },
    ],
    responseHtml: `<p><b>Test drive requested.</b> I've asked Spinny Whitefield to hold a slot on <b>Saturday morning, 25 May</b>. They'll confirm by SMS to your registered number within an hour.</p>

<div class="card">
  <div class="card-row"><span class="muted">Car</span><span><b>Honda City N-Line N8 CVT · 2022</b></span></div>
  <div class="card-row"><span class="muted">Where</span><span>Spinny Whitefield, Bengaluru</span></div>
  <div class="card-row"><span class="muted">Tentative slot</span><span>Sat 25 May · 10:00–10:45</span></div>
  <div class="card-row"><span class="muted">Reversible</span><span>Cancel any time before confirmation</span></div>
</div>

<div class="note">No payment, no reservation hold. The car remains listed until you decide.</div>`,
    options: [
      { label: "View purchase tracker", goTo: "__open-today-tracker__" },
      { label: "Back to deal room",    goTo: "__open-carbuy-deal__" },
    ],
    terminal: true,
  },

  "a-carbuy-reserve-ack": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Reservation · refundable hold",
    thinking: [
      "Placing a 48-hour refundable hold with Spinny",
      "Reserving ₹5,000 against your card · fully refundable if you walk away",
      "Locking the listed price for 48 hours",
    ],
    tools: [
      { icon: "🔒", label: "Listing reservation" },
      { icon: "💳", label: "Card hold · refundable" },
    ],
    responseHtml: `<p><b>Car reserved for 48 hours.</b> Listed price locked at ₹9.80L. Refundable hold of ₹5,000 placed on your card · reversed automatically if you don't complete or walk away.</p>

<div class="card">
  <div class="card-row"><span class="muted">Car</span><span><b>Honda City N-Line N8 CVT · 2022</b></span></div>
  <div class="card-row"><span class="muted">Reserved until</span><span>Friday 24 May · 18:00</span></div>
  <div class="card-row"><span class="muted">Hold amount</span><span>₹5,000 · refundable</span></div>
  <div class="card-row"><span class="muted">Listed price locked</span><span>₹9,80,000</span></div>
</div>

<div class="note">If you proceed, the hold is adjusted against the booking. If you don't, it reverses to your card within 24 hours.</div>`,
    options: [
      { label: "Continue to financing",   goTo: "a-carbuy-finance-pick" },
      { label: "View purchase tracker",   goTo: "__open-today-tracker__" },
      { label: "Back to deal room",       goTo: "__open-carbuy-deal__" },
    ],
    terminal: true,
  },

  // ────────── Arjun · Origination summary (THIN SLICE — full 7-stage flow ships Day 2) ──────────
  "a-orig-summary": {
    type: "final",
    agent: "Origination Agent",
    routingReason: "Pre-approval initiated · KYC + bureau + decisioning",
    thinking: [
      "Handing off from Sales & Advisory to Origination",
      "Pulling your e-KYC vault · Aadhaar •••• 4821 linked · PAN matched ITR · address proof current",
      "Triggering CIBIL pull · score 812 · band prime+ · last hard inquiry 4 months ago",
      "Running adverse-media check on Spinny Whitefield · 0 hits",
      "Drafting credit memo · all 7 policy checks passed",
      "Generating Key Fact Statement per RBI Digital Lending Guidelines · APR 9.4% · cooling-off 3 days",
      "Writing immutable audit-log entry · case ref ORIG-7842",
    ],
    tools: [
      { icon: "🪪", label: "e-KYC vault" },
      { icon: "📊", label: "Credit bureau (CIBIL)" },
      { icon: "🔍", label: "Adverse-media scan" },
      { icon: "📑", label: "KFS engine" },
      { icon: "🗂", label: "Credit memo synth" },
      { icon: "🛡", label: "Policy check" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `
<p>Pre-approval initiated. Origination is handling end-to-end · no branch visit, no doc upload, ~90 seconds.</p>

<div class="orig-card">
  <div class="orig-card-head"><div class="orig-card-title">Origination summary</div><span class="orig-card-pill pill-verified">Pre-approved</span></div>
  <div class="orig-field-list">
    <div class="orig-field prefilled"><span class="orig-field-label">e-KYC</span><span class="orig-field-val">Aadhaar •••• 4821 · PAN matched ITR</span></div>
    <div class="orig-field prefilled"><span class="orig-field-label">Address proof</span><span class="orig-field-val">Brigade society letter · 2024</span></div>
    <div class="orig-field prefilled"><span class="orig-field-label">CIBIL · prime+ band</span><span class="orig-field-val">812</span></div>
    <div class="orig-field prefilled"><span class="orig-field-label">Adverse media</span><span class="orig-field-val">0 hits on Spinny Whitefield</span></div>
    <div class="orig-field prefilled"><span class="orig-field-label">Policy checks</span><span class="orig-field-val">7 of 7 passed</span></div>
  </div>
</div>

<div class="orig-card">
  <div class="orig-card-head"><div class="orig-card-title">Key Fact Statement</div><span class="orig-card-pill">Per RBI Digital Lending Guidelines</span></div>
  <div class="orig-memo">
    <div class="orig-memo-line"><span class="orig-memo-label">Loan principal</span><span class="orig-memo-value">₹5,00,000</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Rate (APR)</span><span class="orig-memo-value">9.85% p.a. · PSL pre-approved</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Tenure</span><span class="orig-memo-value">36 months</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Indicative EMI</span><span class="orig-memo-value">₹16,100 / month</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Processing fee</span><span class="orig-memo-value">1.00% + GST · ₹5,900</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Foreclosure</span><span class="orig-memo-value">Nil after 6 months</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Cooling-off</span><span class="orig-memo-value">3 days post-disbursal</span></div>
    <div class="orig-memo-line"><span class="orig-memo-label">Total interest payable</span><span class="orig-memo-value">~₹79,600 over 36 months</span></div>
  </div>
</div>

<div class="orig-decision">
  <div class="orig-decision-icon">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>
  <div class="orig-decision-title">Pre-approved · 9.40% PSL</div>
  <div class="orig-decision-sub">Sanction letter ready · disbursal once you accept</div>
</div>

<div class="orig-audit">
  <div class="orig-audit-head">Audit trail · immutable</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:02</span> · KYC pulled from vault · Aadhaar token-id ak-71xx</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:03</span> · CIBIL inquiry · soft pull · score 812</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:04</span> · Adverse media · zero hits across 9 sources</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:06</span> · Credit memo synthesised · 7/7 policy checks passed</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:07</span> · KFS rendered · RBI Digital Lending Guidelines compliant</div>
  <div class="orig-audit-line"><span class="orig-audit-time">09:41:09</span> · Decision · APPROVE · authorised by rule "PSL · CIBIL > 750 · own-tenure car loan"</div>
</div>

<div class="note compliance">
  Every step above is logged to an immutable audit trail · reviewable by you, your relationship banker, and the regulator on request. The Key Fact Statement is yours before any debit hits your account · 3-day cooling-off applies post-disbursal per the RBI Digital Lending Guidelines.
</div>
`,
    options: [
      { label: "Accept · proceed to disbursal", goTo: "a-orig-disbursal-active" },
      { label: "Email me the KFS for review",   goTo: "a-orig-summary" },
      { label: "Back to financing options",     goTo: "a-growth-used-car-final" },
    ],
    terminal: true,
  },

  // ════════════════════════════════════════════════════════════════════════
  // Phase 2 · "in motion" execution-layer stages (one per action CTA)
  // Same template as a-salary-plan-*: status rows · Today-tab tracker
  // ════════════════════════════════════════════════════════════════════════

  "a-orig-disbursal-active": {
    type: "final",
    agent: "Origination Agent",
    routingReason: "Disbursal in motion · ₹12L credit",
    thinking: [
      "Booking the disbursal · ₹5,00,000 to savings •• 7731",
      "Generating signed sanction letter PDF · IT Act § 5",
      "Setting cooling-off window · 22 May → 25 May",
      "Writing immutable audit entry · ref ORIG-7842-DISB",
    ],
    tools: [
      { icon: "🏦", label: "Disbursal engine" },
      { icon: "📑", label: "Sanction letter" },
      { icon: "🛡", label: "Cooling-off monitor" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p><b>Disbursal in motion.</b> ₹5,00,000 booking with treasury, sanction letter sent, cooling-off window open. Taking you to <i>Today</i> so you can see the loan tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "a-cardapp-platinum-active": {
    type: "final",
    agent: "Sales & Advisory Agent",
    routingReason: "Card application in motion · pre-approved",
    thinking: [
      "Pre-approval confirmed · no fresh CIBIL pull needed",
      "Drafting MITC for e-sign · per RBI norms",
      "Reserving tokenisation rails for 7 merchants on file",
      "Queueing physical card production · 2 working days",
    ],
    tools: [
      { icon: "💳", label: "Card application" },
      { icon: "📑", label: "MITC engine" },
      { icon: "🔄", label: "Tokenisation rails" },
    ],
    responseHtml: `<p><b>Card application in motion.</b> Pre-approved, MITC drafted, tokenisation rails reserved, physical card queued. Taking you to <i>Today</i> so you can see the application tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "a-growth-taj-booking": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Taj booking in motion · pending payment",
    thinking: [
      "Holding 4 nights at Taj Holiday Village · sea-view room",
      "Attaching ₹3,000 dining credit per partner offer",
      "Confirming free-cancellation window · 7 days before check-in",
    ],
    tools: [
      { icon: "🏨", label: "Travel partners" },
      { icon: "🎁", label: "Partner offer engine" },
    ],
    responseHtml: `<p><b>Taj booking in motion.</b> 4 nights held, dining credit attached, free cancellation armed. Taking you to <i>Today</i> so you can see the booking tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "a-growth-forex-active": {
    type: "final",
    agent: "Growth & Marketplace Agent",
    routingReason: "Forex card in motion · FEMA/LRS",
    thinking: [
      "Issuing digital forex card · live in two minutes",
      "Queueing physical card · 5 working days",
      "Confirming FY27 LRS headroom · USD 245,800 of USD 250,000",
    ],
    tools: [
      { icon: "💱", label: "Forex card · FEMA/LRS" },
      { icon: "🛡", label: "LRS limit monitor" },
    ],
    responseHtml: `<p><b>Forex card in motion.</b> Digital card is live, physical card queued, LRS headroom monitored. Taking you to <i>Today</i> so you can see the forex tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  // Priya · Phase 2 execution flows
  "p-serv-release-active": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Quick-release in motion · self-attest path",
    thinking: [
      "Drafting the release form · pre-filled from your 14 prior payments",
      "Generating PMLA self-attest declaration",
      "Cueing AML engine for post-release variance scan",
    ],
    tools: [
      { icon: "📝", label: "Release form engine" },
      { icon: "🛡", label: "AML rules engine" },
      { icon: "📜", label: "Audit logger" },
    ],
    responseHtml: `<p><b>Release in motion.</b> Form drafted with vendor history, variance scan armed. Taking you to <i>Today</i> so you can see the release tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

  "p-serv-compliance-active": {
    type: "final",
    agent: "Servicing Agent",
    routingReason: "Compliance review in motion · case opened",
    thinking: [
      "Opening compliance case · ref CMP-3214",
      "Assigning Anita Devi (SME desk · 7 years tenure)",
      "Setting SLA · 1 working day",
    ],
    tools: [
      { icon: "📂", label: "Case management" },
      { icon: "👤", label: "RM calendar" },
    ],
    responseHtml: `<p><b>Compliance review in motion.</b> Case opened, officer assigned, SLA running. Taking you to <i>Today</i> so you can see the case tracker live.</p>`,
    autoOpenTracker: true,
    terminal: true,
  },

};

// ════════════════════════════════════════════════════════════════════════
// Fallback — when free-typed input matches nothing
// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
// Active plans — surfaced on Today after the user kicks off an execution
// flow. Each entry is keyed by persona+plan-id and maps to a block payload
// that renderBlockActivePlan renders. State is held in app.js · state.activePlans
// ════════════════════════════════════════════════════════════════════════
const ACTIVE_PLANS = {
  "arjun:salary-3-approved": {
    type: "active-plan",
    title: "Salary raise allocation",
    statusPill: "Active",
    selectedSummary: "Balanced plan · ₹20K/mo · split 50/50",
    rows: [
      { label: "SIP top-up · ₹15K → ₹16.5K/mo",  status: "Active · starts 5 June", tone: "ok"      },
      { label: "Term-life top-up · target ₹1Cr", status: "Shortlist by 6 PM",      tone: "info"    },
      { label: "Cash-flow buffer · ~₹8,100/mo",  status: "Monitoring · healthy",   tone: "ok"      },
      { label: "60-day review",                  status: "Scheduled · 21 July",    tone: "neutral" },
    ],
    primaryAction: { label: "View receipt", openStage: "a-salary-approved-sip" },
  },
  "arjun:salary-1": {
    type: "active-plan",
    title: "Salary raise allocation",
    statusPill: "Active",
    selectedSummary: "Compounding plan · all into SIP",
    rows: [
      { label: "SIP top-up · ₹15K → ₹18K/mo",    status: "Active · starts 5 June", tone: "ok"      },
      { label: "Un-allocated bandwidth · ₹17K",  status: "Monitoring · healthy",   tone: "ok"      },
      { label: "60-day review",                  status: "Scheduled · 21 July",    tone: "neutral" },
    ],
    primaryAction: { label: "View receipt", openStage: "a-salary-approved-sip" },
  },
  "arjun:salary-2": {
    type: "active-plan",
    title: "Salary raise allocation",
    statusPill: "Active",
    selectedSummary: "Protection plan · cover top-up",
    rows: [
      { label: "Term-life top-up · target ₹1Cr",  status: "Shortlist by 6 PM",     tone: "info"    },
      { label: "Un-allocated bandwidth · ₹19.6K", status: "Monitoring · healthy",  tone: "ok"      },
      { label: "60-day review",                   status: "Scheduled · 21 July",   tone: "neutral" },
    ],
    primaryAction: { label: "View receipt", openStage: "a-salary-approved-sip" },
  },
  "arjun:car-purchase": {
    type: "active-plan",
    title: "Honda City purchase",
    statusPill: "Active",
    selectedSummary: "Net cost ₹4.88L · EMI ₹16,100/mo · 36 months",
    rows: [
      { label: "Car selected · Honda City 2022",  status: "Done",                       tone: "ok"      },
      { label: "Loan pre-approved · ₹5L · 9.85%", status: "Done",                       tone: "ok"      },
      { label: "KFS sent · IT Act § 5",           status: "Done",                       tone: "ok"      },
      { label: "Trade-in valuation",              status: "Cars24 confirmation pending", tone: "info"    },
      { label: "Test drive",                      status: "Not scheduled",              tone: "warn"    },
      { label: "Dealer payment",                  status: "After your approval",        tone: "neutral" },
      { label: "RC transfer",                     status: "After delivery",             tone: "neutral" },
      { label: "First EMI ₹16,100",               status: "Scheduled · 5 July",         tone: "neutral" },
    ],
    primaryAction:   { label: "Schedule test drive", openStage: "a-carbuy-testdrive-ack" },
    secondaryAction: { label: "View KFS receipt",    openStage: "a-orig-summary" },
  },
  "arjun:platinum-card": {
    type: "active-plan",
    title: "Platinum Travel Card application",
    statusPill: "Active",
    selectedSummary: "Pre-approved · +₹14,800/yr modelled net benefit",
    rows: [
      { label: "MITC e-sign",            status: "Awaiting signature",  tone: "warn"    },
      { label: "7 tokenised merchants",  status: "Rails reserved",      tone: "info"    },
      { label: "Physical card",          status: "Queued · 2 days",     tone: "info"    },
    ],
    primaryAction: { label: "Continue setup", openStage: "a-cardapp-platinum-active" },
  },
  "arjun:taj-booking": {
    type: "active-plan",
    title: "Taj Holiday Village · 4 nights",
    statusPill: "Active",
    selectedSummary: "22% off · ₹29,950 · dining credit ₹3,000 attached",
    rows: [
      { label: "Pay ₹29,950",             status: "Awaiting payment",        tone: "warn"    },
      { label: "₹3,000 dining credit",    status: "Attached",                tone: "info"    },
      { label: "Free cancellation",       status: "Open · 7 days before",    tone: "ok"      },
    ],
    primaryAction: { label: "Continue setup", openStage: "a-growth-taj-booking" },
  },
  "arjun:forex-card": {
    type: "active-plan",
    title: "Forex card · multi-currency",
    statusPill: "Active",
    selectedSummary: "Digital card live · physical in 5 working days",
    rows: [
      { label: "Load currency",           status: "Awaiting first load",   tone: "warn"    },
      { label: "LRS headroom",            status: "Healthy · USD 245,800", tone: "ok"      },
      { label: "Physical card",           status: "In production",         tone: "info"    },
    ],
    primaryAction: { label: "Continue setup", openStage: "a-growth-forex-active" },
  },
  "priya:release": {
    type: "active-plan",
    title: "Mehta Flour payment · release",
    statusPill: "Active",
    selectedSummary: "₹4,80,000 · self-attest quick release",
    rows: [
      { label: "Sign self-attest",       status: "Awaiting signature",  tone: "warn"    },
      { label: "Funds clear ETA",        status: "~30 min post-sign",   tone: "info"    },
      { label: "Variance scan",          status: "Active",              tone: "ok"      },
    ],
    primaryAction: { label: "Continue setup", openStage: "p-serv-release-active" },
  },
  "priya:compliance": {
    type: "active-plan",
    title: "Mehta Flour payment · compliance review",
    statusPill: "Active",
    selectedSummary: "Human officer review · case CMP-3214",
    rows: [
      { label: "Anita Devi · SME desk",   status: "In review",         tone: "info"    },
      { label: "SLA",                     status: "1 working day",     tone: "ok"      },
      { label: "Auto-escalation",         status: "Armed",             tone: "neutral" },
    ],
    primaryAction: { label: "View case", openStage: "p-serv-compliance-active" },
  },
  "priya:aa-consent-sent": {
    type: "active-plan",
    title: "AA consent · GST data",
    statusPill: "Active",
    selectedSummary: "GSTR-1 + GSTR-3B · 4 quarters · for Option A eligibility",
    rows: [
      { label: "Consent request",           status: "Sent · AA-CNS-7821",     tone: "ok"      },
      { label: "Your approval",             status: "Awaiting in AA app",     tone: "warn"    },
      { label: "GST data pull",             status: "Armed · runs on approval", tone: "info"  },
      { label: "Loan eligibility re-check", status: "Queued · ~2 min after pull", tone: "neutral" },
    ],
    primaryAction: { label: "View consent receipt", openStage: "p-sales-aa-consent-sent" },
  },
  "priya:sme-eq-application": {
    type: "active-plan",
    title: "Equipment loan · Option A application",
    statusPill: "Active",
    selectedSummary: "₹6,00,000 · 30 mo · 10.40% APR · EMI ₹24,700",
    rows: [
      { label: "Application drafted",     status: "Pre-filled from KYC",      tone: "ok"      },
      { label: "Key Fact Statement",      status: "Attached",                 tone: "ok"      },
      { label: "AA consent · GSTR data",  status: "Pending your approval",    tone: "warn"    },
      { label: "Your review",             status: "Awaiting",                 tone: "warn"    },
      { label: "Disbursal",               status: "After you accept",         tone: "neutral" },
    ],
    primaryAction: { label: "Review application", openStage: "p-sales-application-drafted" },
  },
};

const FALLBACK_STAGE = {
  type: "clarify",
  agent: "Aria",
  routingReason: "No specialist match — staying with the front-door",
  thinking: [
    "Parsing your message against this customer's intent map",
    "No specialist match yet · staying with the front-door",
  ],
  responseHtml: `<p>I don't have quite enough to act on that yet — could be I just need a clearer signal. Here are three things I can take all the way through. Tap one, or rephrase and I'll route it.</p>`,
  // options populated dynamically from the current persona's categories
};

// ════════════════════════════════════════════════════════════════════════
// Classic (widget) view — the fallback for users who prefer the old way
// ════════════════════════════════════════════════════════════════════════
const CLASSIC_VIEW = {
  priya: {
    cards: [
      { type: "Current · Business", number: "•• 4421", balance: "₹8,42,650", accent: "linear-gradient(135deg,#7C5CFF,#B66DFF)" },
      { type: "Overdraft", number: "Limit ₹3,00,000", balance: "₹1,18,400 used", accent: "linear-gradient(135deg,#F59E0B,#FFB341)" },
      { type: "Savings · Personal", number: "•• 9082", balance: "₹2,15,300", accent: "linear-gradient(135deg,#2DD4BF,#36E2C8)" },
    ],
    quickActions: [
      { id: "pay-vendor", icon: "vendor",     label: "Pay vendor" },
      { id: "gst-taxes",  icon: "calculator", label: "GST & taxes" },
      { id: "statements", icon: "document",   label: "Statements" },
      { id: "cards",      icon: "card",       label: "Cards" },
      { id: "payroll",    icon: "users",      label: "Payroll" },
      { id: "more",       icon: "grid",       label: "More" },
    ],
    transactions: [
      { merchant: "Mehta Flour Mills", date: "14 May · Held", amount: "−₹4,80,000", state: "pending" },
      { merchant: "ABC Sugar Traders", date: "13 May", amount: "−₹62,400" },
      { merchant: "Vodafone Idea", date: "12 May", amount: "−₹1,840" },
      { merchant: "GST output · April", date: "11 May", amount: "−₹38,200" },
      { merchant: "Sunrise Bakery POS", date: "10 May", amount: "+₹42,150" },
    ],
  },
  arjun: {
    cards: [
      { type: "Savings", number: "•• 7731", balance: "₹3,12,480", accent: "linear-gradient(135deg,#7C5CFF,#B66DFF)" },
      { type: "Credit Card · Visa Signature", number: "•• 4108", balance: "₹41,220 / ₹2,50,000", accent: "linear-gradient(135deg,#F472B6,#FB7299)" },
      { type: "Mutual Fund SIP", number: "Equity · Hybrid", balance: "₹2,18,460", accent: "linear-gradient(135deg,#2DD4BF,#36E2C8)" },
    ],
    quickActions: [
      { id: "send-money",  icon: "send",     label: "Send money" },
      { id: "pay-bills",   icon: "receipt",  label: "Pay bills" },
      { id: "cards",       icon: "card",     label: "Cards" },
      { id: "investments", icon: "chart",    label: "Investments" },
      { id: "statements",  icon: "document", label: "Statements" },
      { id: "more",        icon: "grid",     label: "More" },
    ],
    transactions: [
      { merchant: "QUICKSTREAM MEDIA", date: "12 May · Disputed", amount: "−₹3,499", state: "alert" },
      { merchant: "Swiggy", date: "11 May", amount: "−₹742" },
      { merchant: "Amazon India", date: "10 May", amount: "−₹2,890" },
      { merchant: "Salary credit", date: "2 May", amount: "+₹1,85,000" },
      { merchant: "SIP · Equity Hybrid", date: "1 May", amount: "−₹15,000" },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════
// Voice transcription samples — per persona, the things Aria "hears"
// when the customer taps the mic. Cycled in order per session.
// ════════════════════════════════════════════════════════════════════════
const VOICE_TRANSCRIPTIONS = {
  priya: [
    "Why was my Mehta Flour transfer flagged?",
    "How do I lower my MDR on cards?",
    "Can I get a loan for a new oven?",
    "Where do I stand on GST this month?",
  ],
  arjun: [
    "There's a charge I don't recognise",
    "Should I upgrade my credit card?",
    "What travel offers are live for me?",
    "How much have I spent on subscriptions?",
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Next-best chips — shown at the chat bottom after a terminal stage
// completes. These are the *adaptive* suggestion chips: they change
// based on what the customer just did. Keyed by completed-stage id.
// ════════════════════════════════════════════════════════════════════════
const NEXT_BEST_SUGGESTIONS = {
  // Priya — Servicing
  "p-serv-final": [
    { label: "Set a standing rule for Mehta Flour Mills", userMessage: "Set a rule to auto-approve Mehta Flour payments under ₹5L", goTo: "p-serv-q-other" },
    { label: "Review my other vendor payments",            userMessage: "Show me all upcoming vendor payments",                     goTo: "p-growth-q1" },
  ],
  // Priya — Sales / loans
  "p-sales-final-eq": [
    { label: "Insurance for the new oven",                userMessage: "What about insurance for this equipment?",                 goTo: "p-serv-q-other" },
    { label: "Stress-test my cash flow",                  userMessage: "Stress-test my cash flow against this EMI",                goTo: "p-growth-q1" },
    { label: "Claim GST input on the purchase",            userMessage: "How do I claim GST input on this oven?",                   goTo: "p-serv-q-other" },
  ],
  "p-sales-final-wc": [
    { label: "Switch to invoice discounting",             userMessage: "Set up invoice discounting on my top 5 receivables",       goTo: "p-growth-final-supplier" },
    { label: "Cap my OD utilisation",                     userMessage: "Cap my OD utilisation at 60%",                              goTo: "p-serv-q-other" },
  ],
  "p-sales-final-exp": [
    { label: "Send Vikram a brief first",                 userMessage: "Send Vikram a one-pager before the meeting",                goTo: "p-serv-q-other" },
  ],
  // Priya — Growth
  "p-growth-final-mdr": [
    { label: "Shortlist Pine Labs",                       userMessage: "Shortlist Pine Labs SmartPOS",                              goTo: "p-serv-q-other" },
    { label: "12-month total cost comparison",             userMessage: "Show the 12-month total cost comparison",                   goTo: "p-growth-final-mdr" },
  ],
  "p-growth-final-fees": [
    { label: "Set up UPI routing rules",                  userMessage: "Auto-route under-₹5L vendor payments via UPI",              goTo: "p-serv-q-other" },
  ],
  "p-growth-final-supplier": [
    { label: "Draft the early-payment policy",            userMessage: "Draft an early-payment discount policy for my top 3",      goTo: "p-serv-q-other" },
  ],

  // Arjun — Servicing
  "a-serv-final": [
    { label: "Review subscription leakage",                userMessage: "Show me unused subscriptions",                              goTo: "a-sales-final-review" },
    { label: "Upgrade to a more rewarding card",           userMessage: "Should I upgrade my credit card?",                          goTo: "a-sales-q2-up" },
  ],
  "a-serv-final-lost": [
    { label: "Order an instant virtual card",              userMessage: "Issue a virtual card I can use until the physical arrives", goTo: "a-serv-final-other" },
  ],
  // Arjun — Sales
  "a-sales-final-up": [
    { label: "Cancel my 3 unused subscriptions",           userMessage: "Cancel the three unused subscriptions",                     goTo: "a-sales-final-review" },
    { label: "Travel offers for next month",               userMessage: "What travel offers are live for me",                        goTo: "a-growth-q2-trip" },
    { label: "Tax-saving investments",                     userMessage: "Long-term tax-saving plans",                                goTo: "a-growth-final-saving" },
  ],
  "a-sales-final-add": [
    { label: "Apply for the fuel card",                    userMessage: "Apply for the fuel card",                                   goTo: "a-serv-final-other" },
  ],
  "a-sales-final-review": [
    { label: "Cancel all 3 unused subscriptions",          userMessage: "Cancel all 3 unused subscriptions",                         goTo: "a-serv-final-other" },
    { label: "Re-allocate the ₹2,400 to my SIP",            userMessage: "Add ₹2,400/month to my SIP",                                 goTo: "a-growth-final-saving" },
  ],
  // Arjun — Growth
  "a-growth-final-trip": [
    { label: "Issue the forex card now",                   userMessage: "Issue the forex card now",                                  goTo: "a-growth-final-trip" },
    { label: "Set reminders for the trip",                 userMessage: "Set reminders for hotel, flight, forex",                    goTo: "a-serv-final-other" },
  ],
  "a-growth-final-intl": [
    { label: "Apply for the forex card",                   userMessage: "Apply for the Zero-FX forex card",                          goTo: "a-growth-final-trip" },
  ],
  "a-growth-final-saving": [
    { label: "Start an ELSS top-up",                       userMessage: "Start an ELSS top-up of ₹10,000/month",                     goTo: "a-serv-final-other" },
    { label: "Buy a Sovereign Gold Bond",                  userMessage: "Subscribe to the open SGB tranche",                         goTo: "a-serv-final-other" },
  ],
  // Used-car flow
  "a-growth-used-car-final": [
    { label: "Walk me into the pre-approval flow", userMessage: "Take me through pre-approval", goTo: "a-orig-summary" },
    { label: "Schedule the Cars24 trade-in inspection", userMessage: "Schedule the Cars24 inspection this weekend",            goTo: "a-serv-final-other" },
    { label: "Compare insurance for the Honda City",     userMessage: "Show me motor insurance options for the new car",         goTo: "a-serv-final-other" },
    { label: "Lock the relationship rate today",         userMessage: "Lock the 9.85% rate before EOD",                          goTo: "a-serv-final-other" },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Browse-via-conversation — verticals shown below Aria's chat opening.
// Tapping a chip is functionally equivalent to the user typing that intent;
// each routes to a known stage in the dialog graph.
// ════════════════════════════════════════════════════════════════════════
const BROWSE_VERTICALS = {
  priya: [
    { icon: "💳", label: "Payments",   userMessage: "I have a payment question",      goTo: "p-serv-q1" },
    { icon: "💰", label: "Borrowing",  userMessage: "Thinking about a loan",          goTo: "p-sales-q1" },
    { icon: "📉", label: "Lower costs", userMessage: "Want to reduce my costs",        goTo: "p-growth-q1" },
    { icon: "🧾", label: "GST & tax",  userMessage: "Where do I stand on GST",        goTo: "p-serv-q-other" },
    { icon: "👥", label: "Payroll",    userMessage: "Payroll for this month",         goTo: "p-serv-q-other" },
    { icon: "📊", label: "Invest",     userMessage: "Looking at business investments", goTo: "p-sales-q1" },
  ],
  arjun: [
    { icon: "💳", label: "Payments",   userMessage: "I have an account question",     goTo: "a-serv-q1" },
    { icon: "💰", label: "Borrowing",  userMessage: "Looking at a loan",              goTo: "a-sales-q1" },
    { icon: "✨", label: "Cards",      userMessage: "Help me with my cards",          goTo: "a-sales-q1" },
    { icon: "📊", label: "Invest",     userMessage: "Long-term investments",          goTo: "a-growth-final-saving" },
    { icon: "🎁", label: "Offers",     userMessage: "What offers are live for me",    goTo: "a-growth-q1" },
    { icon: "✈️", label: "Travel",    userMessage: "Planning a trip",                goTo: "a-growth-q2-trip" },
  ],
};

// ════════════════════════════════════════════════════════════════════════
// Personalised pages — what Aria has curated for this customer today
// Each persona has 4 tabs: today · money · plan · offers
// Each tab is a stack of typed "blocks":
//   alert | kpi | insight | narrative | card | chart | cta
// Renderers live in app.js (renderBlock*). The "card" block passes its
// `html` through verbatim so we reuse the existing rich-card markup that
// already lives in STAGES (Key Fact Statement grids, pill badges, etc.).
// ════════════════════════════════════════════════════════════════════════
const PERSONALISED_PAGES = {

  // ════════════════ Priya — SME, bakery owner ════════════════
  priya: {

    today: {
      title: "Today",
      subtitle: "Wednesday · 17 May",
      blocks: [
        {
          type: "alert",
          tone: "warn",
          icon: "⏸",
          title: "Your transfer to Mehta Flour Mills is on hold",
          body: "₹4,80,000 paused for an AML check — 2.3× larger than your usual payment to this vendor.",
          actionLabel: "Review with Aria",
          openStage: "p-serv-final",
          handledByPlans: ["priya:release", "priya:compliance"],
        },
        {
          type: "overnight",
          headline: "Done overnight while you slept",
          subline: "5 actions completed against your standing rules · 6 May–18 May audit log",
          receipts: [
            { action: "GSTR-1 auto-filed for April cycle", rule: "L3 · Tax compliance", time: "02:14", reversible: true,  detail: "Filed with GSTN portal. Acknowledgement no. ARN-AA27052526..." },
            { action: "Auto-categorised 14 vendor payments", rule: "L1 · Bookkeeping",   time: "02:00", reversible: false, detail: "Tagged against your Chart of Accounts. No exceptions raised." },
            { action: "Drafted 3 vendor chases (gentle tone)", rule: "L2 · AR automation",  time: "06:30", reversible: true,  detail: "Stagger: T+0 gentle, T+3 firm, T+7 payment-plan offer." },
            { action: "Refused 1 suspect merchant token (Visa Corp)", rule: "L4 · Fraud guard", time: "23:18", reversible: true, detail: "Token request from an MCC outside your usual list. Held for your review." },
            { action: "Settled ₹62,400 to ABC Sugar Traders", rule: "L3 · Vendor payment",  time: "09:14", reversible: false, detail: "Within rule envelope: < ₹1L, regular vendor, no variance." },
          ],
        },
        {
          type: "kpi",
          label: "Cash position",
          value: "₹8,42,650",
          delta: "+ ₹42,150 since yesterday",
          deltaTone: "up",
          context: "Current account · •• 4421",
        },
        {
          type: "kpi",
          label: "Overdraft headroom",
          value: "₹1,81,600",
          delta: "39% of limit used",
          deltaTone: "neutral",
          context: "Comfortable above your typical monsoon dip (~22% revenue drop)",
        },
        {
          type: "insight",
          icon: "✓",
          title: "GSTR-3B filed on 11 May — well ahead of deadline",
          body: "Input Tax Credit carry-forward of <b>₹14,200</b> is available to set off against your next quarter's output liability.",
        },
        {
          type: "alert",
          tone: "warn",
          icon: "💼",
          title: "Payroll runs in 12 days · ₹55,000 across 3 employees",
          body: "Anita ₹22,000 · Kishore ₹18,000 · Raju ₹15,000 · debit auto-scheduled for 30 May. TDS, PF and ESIC computed automatically.",
          actionLabel: "Review payroll",
        },
        {
          type: "alert",
          tone: "info",
          icon: "📨",
          title: "3 vendors overdue payment · ₹84,200 total",
          body: "Mehta Flour (₹52,000 · 8 days), Sunrise Dairy (₹18,200 · 3 days), Karnataka Spices (₹14,000 · 12 days). Drafts are already prepared in 3 tones.",
          actionLabel: "Open the AR chases",
        },
        {
          type: "insight",
          icon: "🧮",
          title: "TDS deposit for May is due by 7 Jun",
          body: "Estimated TDS payable on salaries + 194Q vendor TDS: <b>₹4,840</b>. I'll auto-queue the challan 48 hours before the deadline unless you want to do it manually.",
        },
        {
          type: "narrative",
          body: "Your bakery typically sees a ~22% revenue dip through June and July. With ₹1.82L of OD headroom plus your usual ₹2.1L month-end receivables, you're comfortable on cash. If you want, I can model the worst-case scenario.",
        },
        {
          type: "cta",
          label: "Ask Aria to model the monsoon scenario",
          openStage: "p-growth-q1",
        },
      ],
    },

    money: {
      title: "Money",
      subtitle: "Across all your accounts",
      blocks: [
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Current · Business</b><span class="pill ghost">•• 4421</span></div>
  <div class="kfs compact">
    <div><span class="muted">Balance</span><b>₹8,42,650</b></div>
    <div><span class="muted">Avg. inflow</span><b>₹19.8L / mo</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Overdraft facility</b><span class="pill warn">39% used</span></div>
  <div class="kfs compact">
    <div><span class="muted">Limit</span><b>₹3,00,000</b></div>
    <div><span class="muted">Used</span><b>₹1,18,400</b></div>
    <div><span class="muted">Rate</span><b>11.25% p.a.</b></div>
    <div><span class="muted">Interest MTD</span><b>₹942</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Savings · Personal</b><span class="pill ghost">•• 9082</span></div>
  <div class="kfs compact">
    <div><span class="muted">Balance</span><b>₹2,15,300</b></div>
  </div>
</div>`,
        },
        {
          type: "insight",
          icon: "🔍",
          title: "I've spotted a pattern in your vendor payments",
          body: "Your top 3 suppliers receive <b>62%</b> of your outflows. ABC Sugar Traders is now your largest by volume — overtook Mehta Flour Mills in April.",
        },
        {
          type: "card",
          html: `
<div class="card transaction">
  <div class="card-row"><span class="muted">Mehta Flour Mills</span><span class="amount">−₹4,80,000</span></div>
  <div class="card-row"><span class="muted">14 May · AML hold</span><span class="pill warn">Pending</span></div>
</div>
<div class="card transaction" style="margin-top:8px">
  <div class="card-row"><span class="muted">ABC Sugar Traders</span><span class="amount">−₹62,400</span></div>
  <div class="card-row"><span class="muted">13 May</span><span class="pill ghost">Supplier average</span></div>
</div>
<div class="card transaction" style="margin-top:8px">
  <div class="card-row"><span class="muted">Sunrise Bakery POS</span><span class="amount">+₹42,150</span></div>
  <div class="card-row"><span class="muted">10 May</span><span class="pill primary">Daily takings</span></div>
</div>`,
        },
        {
          type: "cta",
          label: "Open the held payment with Aria",
          openStage: "p-serv-final",
        },
      ],
    },

    plan: {
      title: "Plan",
      subtitle: "Looking ahead 6 months",
      blocks: [
        {
          type: "chart",
          title: "Projected cash position · next 6 months",
          bars: [
            { width: 78, color: "linear-gradient(90deg,#7C5CFF,#B66DFF)", label: "May · ₹8.4L" },
            { width: 70, color: "linear-gradient(90deg,#7C5CFF,#B66DFF)", label: "Jun · ₹7.5L (monsoon)" },
            { width: 62, color: "linear-gradient(90deg,#F59E0B,#FFB341)", label: "Jul · ₹6.6L (deepest)" },
            { width: 74, color: "linear-gradient(90deg,#7C5CFF,#B66DFF)", label: "Aug · ₹7.9L" },
            { width: 86, color: "linear-gradient(90deg,#22C8B2,#36E2C8)", label: "Sep · ₹9.2L (recovery)" },
            { width: 92, color: "linear-gradient(90deg,#22C8B2,#36E2C8)", label: "Oct · ₹9.8L (festive)" },
          ],
        },
        {
          type: "insight",
          icon: "💡",
          title: "If you finance the new oven now, here's the picture",
          body: "An <b>₹8L SME Equipment Loan over 30 months</b> at 10.40% APR adds <b>~₹24,700/month EMI</b>. Even at the July low, you'd stay above ₹4.2L in your current account — well clear of trouble.",
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>SME Equipment Loan · pre-qualified</b><span class="pill primary">Pre-qualified</span></div>
  <div class="kfs">
    <div><span class="muted">Limit</span><b>up to ₹8,00,000</b></div>
    <div><span class="muted">Rate (APR)</span><b>10.40% p.a.</b></div>
    <div><span class="muted">Tenure</span><b>24–36 months</b></div>
    <div><span class="muted">Processing fee</span><b>1.0% + GST</b></div>
    <div><span class="muted">Foreclosure</span><b>Nil after 6 months</b></div>
    <div><span class="muted">Cooling-off</span><b>3 days post-disbursal</b></div>
  </div>
  <p class="card-foot muted">Full Key Fact Statement is issued before sanction, per RBI Digital Lending Guidelines.</p>
</div>`,
        },
        {
          type: "narrative",
          body: "Vikram Iyer, your relationship banker, has three open slots this week if you'd rather walk through the projections together. He's seen your books for the last 4 years.",
        },
        {
          type: "cta",
          label: "Open loan options with Aria",
          openStage: "p-sales-final-eq",
        },
      ],
    },

    offers: {
      title: "Offers",
      subtitle: "Curated from our marketplace",
      blocks: [
        {
          type: "narrative",
          body: "I've matched these to your ticket size (₹620 average) and your card-acceptance mix. Both partners hold RBI Payment Aggregator authorisation, so settlement uses NPCI rails — your end-of-day reconciliation stays exactly as it is.",
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Pine Labs SmartPOS Mini</b><span class="pill primary">Best fit</span></div>
  <p class="muted">Zero device fee for 6 months · UPI + cards + BBPS · settles to your business account T+1.</p>
  <div class="kfs compact">
    <div><span class="muted">Effective blended MDR</span><b>0.42%</b></div>
    <div><span class="muted">Est. annual saving</span><b>~₹18,600</b></div>
    <div><span class="muted">Bonus</span><b>3% statement cashback on first ₹2L</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Mswipe QR-First</b><span class="pill ghost">Lighter setup</span></div>
  <p class="muted">No device · UPI-only QR with audio confirmation speaker. Best if 80%+ of customers already pay UPI.</p>
  <div class="kfs compact">
    <div><span class="muted">Monthly fee</span><b>₹0</b></div>
    <div><span class="muted">Bonus</span><b>₹1,500 statement credit after ₹50k processed</b></div>
  </div>
</div>`,
        },
        {
          type: "insight",
          icon: "📉",
          title: "April MDR breakdown — where you're actually paying",
          body: "On ₹12.8L processed last month, you paid ~₹3,470. The Visa/Mastercard credit slice alone was ₹1,420. The Pine Labs offer would shift most of that.",
        },
        {
          type: "cta",
          label: "Compare side-by-side with Aria",
          openStage: "p-growth-final-mdr",
        },
      ],
    },

  },

  // ════════════════ Arjun — salaried professional ════════════════
  arjun: {

    today: {
      title: "Today",
      subtitle: "Wednesday · 17 May",
      blocks: [
        {
          type: "nba-card",
          tone: "default",
          triggerLabel: "Trigger detected · life moment",
          levers: ["sales-nba"],
          title: "₹20K salary increment landed — let's allocate it intentionally",
          signals: [
            "Salary credit ₹1.85L → ₹2.05L on 2 May",
            "15% of new bandwidth still in current account",
            "SIP cushion holding at ₹15K/mo · last reviewed 6 months ago",
          ],
          body: "Three options: <b>bump SIP by ₹3K/mo</b> (compound effect ₹4.2L over 10y) · <b>top up term-life cover</b> (₹50L → ₹1Cr for ~₹400/mo more) · <b>split 50/50</b>. Each is drafted; you tap to choose.",
          actionLabel: "Walk me through the 3 options",
          secondaryLabel: "Not now",
          openStage: "a-growth-salary-bump-final",
          handledByPlans: ["arjun:salary-1", "arjun:salary-2", "arjun:salary-3-approved"],
        },
        {
          type: "nba-card",
          tone: "violet",
          triggerLabel: "Trigger detected · purchase intent",
          levers: ["sales-nba"],
          title: "Looking at used cars? Three signals say you're close",
          signals: [
            "Salary credit ₹2.05L · stable 4 months",
            "2 CarWale searches in the last 7 days",
            "₹4.2L corpus headroom over your buffer",
          ],
          body: "I found the Honda City you viewed and 4 similar cars that fit your safe EMI band of ~₹17k/mo. Your i20 trade-in (₹4.85L–₹4.92L) is already netted into every listing.",
          actionLabel: "Open car workspace",
          secondaryLabel: "Continue Honda City",
          openFeature: "carbuy-market",
          secondaryOpenFeature: "carbuy-deal-honda",
          handledByPlans: ["arjun:car-purchase"],
        },
        {
          type: "alert",
          tone: "warn",
          icon: "⚠",
          title: "Dispute on ₹3,499 charge is still under review",
          body: "QUICKSTREAM MEDIA · 12 May. Provisional credit of ₹3,499 already posted while we investigate. RBI Customer Liability Framework — zero liability for you.",
          actionLabel: "Open the case with Aria",
          openStage: "a-serv-final",
        },
        {
          type: "overnight",
          headline: "Done overnight while you slept",
          subline: "4 actions completed against your standing rules · audit trail available",
          receipts: [
            { action: "Cancelled AppGym Premium (₹799/month)",        rule: "L3 · Subscription hygiene", time: "03:18", reversible: true,  detail: "Last used 92 days ago. Saved ₹9,588 over 12 months." },
            { action: "Allocated 15% of salary (₹27,750) to SIP queue", rule: "L2 · Auto-save",           time: "09:02", reversible: true,  detail: "Queued for 1 Jun debit · Equity-Hybrid Direct." },
            { action: "Auto-paid Tata Play DTH (₹699)",                 rule: "L2 · Bill pay",             time: "07:00", reversible: false, detail: "Recurring biller · within ₹1,000 monthly envelope." },
            { action: "Muted 18 May statement reminder · paid in full", rule: "L1 · Notification hygiene", time: "02:00", reversible: false, detail: "Full payment already cleared on 16 May." },
          ],
        },
        {
          type: "kpi",
          label: "Savings balance",
          value: "₹3,12,480",
          delta: "+ ₹1,85,000 (salary, 2 May)",
          deltaTone: "up",
          context: "•• 7731",
        },
        {
          type: "kpi",
          label: "Credit card statement",
          value: "₹41,220",
          delta: "Due in 1 day · 18 May",
          deltaTone: "warn",
          context: "16% of your ₹2,50,000 limit",
        },
        {
          type: "insight",
          icon: "🍽",
          title: "Dining is +18% YoY",
          body: "You've added four new restaurants to your regulars list. Your dining spend is now <b>32% of your card volume</b> — worth knowing for our card-upgrade conversation.",
        },
        {
          type: "narrative",
          body: "Your SIP debited on the 1st as planned. Equity-Hybrid is up 4.2% MTD. Three subscriptions look unused — together they're costing you ₹2,400/month. I can cancel them on your nod.",
        },
        {
          type: "cta",
          label: "Cancel unused subscriptions with Aria",
          openStage: "a-sales-final-review",
        },
      ],
    },

    money: {
      title: "Money",
      subtitle: "Your full picture",
      blocks: [
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Savings</b><span class="pill ghost">•• 7731</span></div>
  <div class="kfs compact">
    <div><span class="muted">Balance</span><b>₹3,12,480</b></div>
    <div><span class="muted">Last credit</span><b>₹1,85,000 · 2 May</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Visa Signature Credit</b><span class="pill warn">Due 18 May</span></div>
  <div class="kfs compact">
    <div><span class="muted">Outstanding</span><b>₹41,220</b></div>
    <div><span class="muted">Limit</span><b>₹2,50,000</b></div>
    <div><span class="muted">Minimum due</span><b>₹2,062</b></div>
    <div><span class="muted">Tokenised on file</span><b>7 merchants</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Mutual Fund SIP</b><span class="pill primary">+4.2% MTD</span></div>
  <div class="kfs compact">
    <div><span class="muted">Equity-Hybrid</span><b>₹2,18,460</b></div>
    <div><span class="muted">SIP</span><b>₹15,000 / month</b></div>
  </div>
</div>`,
        },
        {
          type: "insight",
          icon: "🔎",
          title: "I tagged your recent activity",
          body: "Each transaction has a quick read so you don't have to scan the list — anomalies are flagged in pink.",
        },
        {
          type: "card",
          html: `
<div class="card transaction alert">
  <div class="card-row"><span class="muted">QUICKSTREAM MEDIA</span><span class="amount">−₹3,499</span></div>
  <div class="card-row"><span class="muted">12 May · CNP · GB</span><span class="pill warn">Disputed</span></div>
</div>
<div class="card transaction" style="margin-top:8px">
  <div class="card-row"><span class="muted">Swiggy</span><span class="amount">−₹742</span></div>
  <div class="card-row"><span class="muted">11 May</span><span class="pill ghost">Matches your usual</span></div>
</div>
<div class="card transaction" style="margin-top:8px">
  <div class="card-row"><span class="muted">Amazon India</span><span class="amount">−₹2,890</span></div>
  <div class="card-row"><span class="muted">10 May</span><span class="pill ghost">Within typical range</span></div>
</div>
<div class="card transaction" style="margin-top:8px">
  <div class="card-row"><span class="muted">Salary credit</span><span class="amount">+₹1,85,000</span></div>
  <div class="card-row"><span class="muted">2 May · As expected</span><span class="pill primary">On schedule</span></div>
</div>`,
        },
        {
          type: "cta",
          label: "Open the disputed charge with Aria",
          openStage: "a-serv-final",
        },
      ],
    },

    plan: {
      title: "Plan",
      subtitle: "Where your money is heading",
      blocks: [
        {
          type: "chart",
          title: "Last 6 months · spend by category",
          bars: [
            { width: 64, color: "linear-gradient(90deg,#7C5CFF,#B66DFF)", label: "Dining · 32%" },
            { width: 48, color: "linear-gradient(90deg,#22C8B2,#36E2C8)", label: "Online shopping · 24%" },
            { width: 36, color: "linear-gradient(90deg,#F472B6,#FB7299)", label: "Travel · 18%" },
            { width: 22, color: "linear-gradient(90deg,#94A3B8,#CBD5E1)", label: "Everything else · 26%" },
          ],
        },
        {
          type: "insight",
          icon: "💡",
          title: "Your current card is leaving money on the table",
          body: "Your dining + online + travel = <b>74% of your spend</b>, but your card pays a flat 1× across the board. A targeted card would yield <b>+₹14,800/year</b> net of fees.",
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Platinum Travel Card · pre-approved</b><span class="pill primary">Best yield</span></div>
  <div class="kfs compact">
    <div><span class="muted">Annual fee</span><b>₹2,500 (waived above ₹4L)</b></div>
    <div><span class="muted">Rewards</span><b>4× travel · 2× dining · 1× rest</b></div>
    <div><span class="muted">Perks</span><b>8 lounges · zero forex intl.</b></div>
    <div><span class="muted">Net benefit</span><b>+₹14,800 / year</b></div>
  </div>
  <p class="card-foot muted">Pre-approved — no fresh CIBIL pull needed. Full MITC presented before acceptance.</p>
</div>`,
        },
        {
          type: "insight",
          icon: "🧹",
          title: "Subscription leakage worth fixing",
          body: "Three services you haven't opened in 60+ days are auto-debiting <b>₹2,400/month</b>. That's ₹28,800/year — roughly the upgrade fee waiver target on its own.",
        },
        {
          type: "cta",
          label: "Compare card options with Aria",
          openStage: "a-sales-final-up",
        },
      ],
    },

    offers: {
      title: "Offers",
      subtitle: "Picked for what you're planning",
      blocks: [
        {
          type: "narrative",
          body: "I noticed two flight searches to Goa in the last week. These three offers are live this week and integrated under RBI's Payment Aggregator framework — settlement, refund and dispute rails sit on the same protections as a direct bank purchase.",
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Taj Holiday Village · 4 nights</b><span class="pill primary">22% off</span></div>
  <p class="muted">Sea-view, breakfast included. ₹3,000 dining credit when paid with your bank card. Free cancellation till 7 days before check-in.</p>
  <div class="kfs compact">
    <div><span class="muted">Total</span><b>₹38,400 → ₹29,950</b></div>
    <div><span class="muted">Cashback</span><b>5% to card · ₹1,498</b></div>
  </div>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>IndiGo · BLR → GOI return</b><span class="pill ghost">Pay with points</span></div>
  <p class="muted">Your 18,400 reward points cover roughly <b>70% of a return ticket</b> next month. Balance billed to your card.</p>
</div>`,
        },
        {
          type: "card",
          html: `
<div class="card option">
  <div class="card-head"><b>Zero-FX Multi-Currency Forex Card</b><span class="pill warn">Recommended</span></div>
  <p class="muted">Issued digitally in two minutes. Zero markup on USD, EUR, THB swipes. Reload up to USD 2,50,000 in a financial year under FEMA's Liberalised Remittance Scheme.</p>
  <div class="kfs compact">
    <div><span class="muted">Card fee</span><b>Waived if loaded ≥ ₹50,000</b></div>
    <div><span class="muted">vs your card</span><b>Saves 3.5% per overseas swipe</b></div>
  </div>
</div>`,
        },
        {
          type: "cta",
          label: "Plan the trip with Aria",
          openStage: "a-growth-final-trip",
        },

        {
          type: "narrative",
          body: "I also noticed you've been browsing used Honda Citys on Spinny last week. Here's what I've staged in the background — full pre-approval and trade-in valuation already in hand.",
        },
        {
          type: "card",
          html: `
<div class="card option used-car">
  <div class="card-head">
    <b>Honda City · 2022 · CVT · 28,400 km</b>
    <span class="pill primary">Pre-approved</span>
  </div>
  <div class="kfs compact">
    <div><span class="muted">Listed at</span><b>₹9,80,000</b></div>
    <div><span class="muted">Spinny valuation</span><b>₹9,65,000</b></div>
    <div><span class="muted">Cars24 valuation</span><b>₹9,82,000</b></div>
    <div><span class="muted">Your CIBIL band</span><b>812 · prime+</b></div>
  </div>
  <p class="card-foot muted">Trade-in: your existing Hyundai i20 is valued at ₹4.85L on Spinny, ₹4.92L on Cars24. I've front-run the valuations so you don't lose time.</p>
</div>`,
        },
        {
          type: "cta",
          label: "Walk me through the 3 financing options",
          openStage: "a-growth-used-car-final",
        },
      ],
    },

  },
};

// ════════════════════════════════════════════════════════════════════════
// Feature screens — the destinations you reach from the Classic dashboard
// quick-action tiles. Per-persona, 6 screens each. Each screen is a stack
// of typed blocks similar to PERSONALISED_PAGES, with form-style additions:
//   field      — labelled input row (decorative — not wired to anything)
//   recipients — recent-recipient avatar tiles
//   row        — list item with title, sub, amount/status pill, action chevron
//   cardItem   — payment-card display with quick actions
//   summary    — KPI-style headline
//   text       — informational paragraph
//   note       — compliance / informational footnote
//   divider    — section label
// Each screen also has a primaryAction (sticky button at bottom).
// ════════════════════════════════════════════════════════════════════════
const FEATURE_SCREENS = {

  // ═════════════════ Priya ═════════════════
  priya: {

    "pay-vendor": {
      title: "Pay a vendor",
      subtitle: "Settle supplier invoices",
      blocks: [
        { type: "divider", label: "Recent vendors" },
        { type: "recipients", items: [
          { initials: "MF", name: "Mehta Flour", colour: "linear-gradient(135deg,#F472B6,#FB7299)" },
          { initials: "AS", name: "ABC Sugar",   colour: "linear-gradient(135deg,#7C5CFF,#B66DFF)" },
          { initials: "SD", name: "Sunrise Dairy", colour: "linear-gradient(135deg,#2DD4BF,#36E2C8)" },
          { initials: "+",  name: "New",          colour: "rgba(255,255,255,0.06)", ghost: true },
        ]},
        { type: "field", label: "Beneficiary", placeholder: "Pick a vendor or paste account no.", icon: "🏷️" },
        { type: "field", label: "Amount", placeholder: "0.00", prefix: "₹", big: true },
        { type: "field", label: "Pay via", placeholder: "UPI / NEFT / RTGS", icon: "🔁" },
        { type: "field", label: "Note (optional)", placeholder: "GRN reference, PO number, etc." },
        { type: "note", body: "Transactions above ₹2,00,000 to a new vendor trigger an AML check (RBI PMLA monitoring). I'll flag and explain if anything's held." },
      ],
      primaryAction: { label: "Continue", sub: "Review before authorising" },
    },

    "gst-taxes": {
      title: "GST & taxes",
      subtitle: "Filing status, reconciliation, AR",
      blocks: [
        { type: "summary", label: "Input Tax Credit available", value: "₹14,200", delta: "Set off against your June liability", tone: "up" },
        { type: "divider", label: "Filing status · current quarter" },
        { type: "row", icon: "✓", title: "GSTR-1", sub: "Filed 11 May", pill: { text: "On time", tone: "primary" } },
        { type: "row", icon: "✓", title: "GSTR-3B", sub: "Filed 11 May", pill: { text: "On time", tone: "primary" } },
        { type: "row", icon: "🗓", title: "GSTR-1 · June", sub: "Due by 11 Jul", pill: { text: "Upcoming", tone: "ghost" } },
        { type: "row", icon: "🗓", title: "GSTR-3B · June", sub: "Due by 20 Jul", pill: { text: "Upcoming", tone: "ghost" } },

        { type: "divider", label: "GSTR-2B reconciliation · April" },
        { type: "summary", label: "Match rate", value: "88%", delta: "23 of 26 invoices reconciled overnight", tone: "up" },
        { type: "row", icon: "✓", title: "23 invoices matched",                sub: "Auto-tagged to your purchase register", pill: { text: "Done", tone: "primary" } },
        { type: "row", icon: "⚠", title: "2 mismatches · ₹4,820",              sub: "ABC Sugar invoice no. mismatch · Pine Labs GSTIN typo", pill: { text: "Review", tone: "warn" } },
        { type: "row", icon: "❓", title: "1 invoice in 2B you haven't booked", sub: "Karnataka Spices · ₹3,200 · 28 Apr",          pill: { text: "Add to books", tone: "ghost" } },

        { type: "divider", label: "Liabilities" },
        { type: "row", icon: "₹", title: "Pay output tax", sub: "Estimated ₹38,200 for May", pill: { text: "Pay now", tone: "warn" } },

        { type: "divider", label: "AR · drafted vendor chases" },
        { type: "chase", tone: "gentle", vendor: "Sunrise Dairy",     amount_inr: 18200, days_overdue: 3,
          draft: "Hi Sunrise Dairy team, just a friendly reminder that invoice #SD-204 for ₹18,200 was due on 14 May. Could you please confirm the payment status when you get a moment? Thanks for the continued partnership." },
        { type: "chase", tone: "firm",    vendor: "Mehta Flour Mills", amount_inr: 52000, days_overdue: 8,
          draft: "Dear Mehta Flour, our records show invoice #MF-1142 for ₹52,000 has been outstanding since 9 May (8 days past due). Please process payment by 22 May to avoid late-payment charges per our agreed terms. Reply to this email if any clarification is needed." },
        { type: "chase", tone: "plan",    vendor: "Karnataka Spices",  amount_inr: 14000, days_overdue: 12,
          draft: "Hello Karnataka Spices, we see invoice #KS-87 for ₹14,000 is 12 days overdue. Would a 30-day payment plan in two tranches (₹7,000 each) work for you? I can have our accounts team confirm the schedule today." },

        { type: "note", body: "GST data is mirrored from your GSTN profile via consented API. Your CA gets read-only access if you've enabled it under Settings → Data sharing. Chase drafts use templates approved by your AR policy — Aria never sends without your tap." },
      ],
      primaryAction: { label: "Send all 3 chases", sub: "Each on its own thread · BCC: ar@sunrisebakery.in" },
    },

    "statements": {
      title: "Statements",
      subtitle: "Account, card and tax-ready exports",
      blocks: [
        { type: "field", label: "Account", placeholder: "Current · Business · •• 4421", icon: "🏦" },
        { type: "field", label: "Period", placeholder: "This month · 1 May – 18 May", icon: "📅" },
        { type: "divider", label: "Format" },
        { type: "row", icon: "📄", title: "PDF · standard statement", sub: "Bank-signed, includes IFSC + MICR" },
        { type: "row", icon: "📊", title: "Excel · with categorisation", sub: "Tagged for accounting software" },
        { type: "row", icon: "🧾", title: "Tally-compatible CSV", sub: "Direct import to Tally Prime / Tally.ERP 9" },
        { type: "row", icon: "📝", title: "GST-aware CSV", sub: "Vendor-wise outflows for GSTR reconciliation" },
        { type: "note", body: "Statements are digitally signed under the IT Act § 5. Forward to your CA directly from this screen." },
      ],
      primaryAction: { label: "Generate statement", sub: "Delivered to your registered email" },
    },

    "cards": {
      title: "Business cards",
      subtitle: "Issued cards and corporate controls",
      blocks: [
        { type: "cardItem",
          name: "Business Visa Corporate",
          number: "•• 8214",
          tone: "linear-gradient(135deg,#7C5CFF,#B66DFF)",
          rows: [
            { label: "Limit", value: "₹5,00,000" },
            { label: "Used",  value: "₹84,200" },
            { label: "Cycle", value: "Closes 28 May" },
          ],
          actions: ["View statement", "Pay", "Lock", "Limits"],
        },
        { type: "divider", label: "Issued to employees" },
        { type: "row", icon: "👤", title: "Anita Devi · Baker", sub: "Sub-card •• 8235 · Limit ₹50,000", pill: { text: "Active", tone: "primary" } },
        { type: "row", icon: "👤", title: "Kishore Kumar · Counter", sub: "Sub-card •• 8242 · Limit ₹30,000", pill: { text: "Active", tone: "primary" } },
        { type: "note", body: "Sub-cards inherit AML monitoring and MITC of the primary. You can freeze, set MCC controls, or change limits at any time." },
      ],
      primaryAction: { label: "Issue a new sub-card", sub: "Photo ID + employment proof needed" },
    },

    "payroll": {
      title: "Payroll",
      subtitle: "May cycle · ₹55,000 total",
      blocks: [
        { type: "summary", label: "Run by", value: "30 May", delta: "12 days from now", tone: "warn" },
        { type: "divider", label: "Employees" },
        { type: "row", icon: "👤", title: "Anita Devi", sub: "Baker · joined Jun 2022", pill: { text: "₹22,000", tone: "ghost" } },
        { type: "row", icon: "👤", title: "Kishore Kumar", sub: "Counter staff · joined Aug 2023", pill: { text: "₹18,000", tone: "ghost" } },
        { type: "row", icon: "👤", title: "Raju Yadav", sub: "Delivery · joined Feb 2024", pill: { text: "₹15,000", tone: "ghost" } },
        { type: "note", body: "TDS, PF and ESIC contributions are computed automatically based on each employee's CTC structure. Compliance reports are generated for the next quarter." },
      ],
      primaryAction: { label: "Schedule May payroll", sub: "Funds debit on 30 May, 09:00 IST" },
    },

    "more": {
      title: "Settings & support",
      subtitle: "Manage your business banking",
      blocks: [
        { type: "summary", label: "Aria's autonomy", value: "8 rules running", delta: "Within the scope you've set · pause any at any time", tone: "up" },

        { type: "divider", label: "Standing rules" },
        { type: "rule-row", name: "Auto-file GST returns",          level: 3, desc: "File GSTR-1 and GSTR-3B 4 days before deadline · within your auto-file consent", lastFired: "11 May · 02:14",            monthCount: 1,   paused: false },
        { type: "rule-row", name: "GSTR-2B nightly reconciliation",   level: 3, desc: "Match supplier invoices to your purchase register every night",                  lastFired: "18 May · 02:14",            monthCount: 18,  paused: false },
        { type: "rule-row", name: "Auto-pay routine vendors",         level: 3, desc: "Pay whitelisted vendors within ₹1L envelope · regular cadence only",            lastFired: "16 May · 09:14",            monthCount: 8,   paused: false },
        { type: "rule-row", name: "Auto-categorise transactions",     level: 1, desc: "Tag every inflow/outflow to your chart of accounts",                            lastFired: "18 May · continuous",        monthCount: 142, paused: false },
        { type: "rule-row", name: "Draft AR chases",                  level: 2, desc: "At 3, 7, 12 days overdue · gentle / firm / payment-plan ladder · never sent without your tap", lastFired: "18 May · 06:30", monthCount: 3, paused: false },
        { type: "rule-row", name: "Run monthly payroll",              level: 3, desc: "Debit ₹55,000 on the 30th · auto-compute TDS, PF and ESIC",                      lastFired: "Scheduled · 30 May",        monthCount: 0,   paused: false },
        { type: "rule-row", name: "Calculate TDS challan",            level: 2, desc: "Prepare 194Q + salary TDS 48 h before deadline · queue for your approval",      lastFired: "Scheduled · 5 Jun",         monthCount: 0,   paused: false },
        { type: "rule-row", name: "Flag suspect merchant tokens",     level: 4, desc: "Refuse card-on-file requests from MCCs outside your usual list · always reversible", lastFired: "17 May · 23:18",     monthCount: 1,   paused: false },

        { type: "divider", label: "Account" },
        { type: "row", icon: "🪪", title: "Business KYB", sub: "Verified · refresh due 2028", chev: true },
        { type: "row", icon: "✍️", title: "Authorised signatories", sub: "2 active · 1 dormant", chev: true },
        { type: "row", icon: "🔐", title: "Transaction limits", sub: "Per-channel · per-beneficiary", chev: true },
        { type: "row", icon: "📑", title: "GST profile", sub: "PAN linked · GSTIN active", chev: true },
        { type: "row", icon: "📱", title: "Linked devices", sub: "2 active sessions", chev: true },
        { type: "row", icon: "🎧", title: "Help & support", sub: "Speak to your relationship banker", chev: true },
        { type: "row", icon: "↩", title: "Sign out", sub: "", chev: true, tone: "danger" },
      ],
      primaryAction: null,
    },

  },

  // ═════════════════ Arjun ═════════════════
  arjun: {

    // ──────────── Car-buying marketplace · workspace, not a chat reply ────────────
    "carbuy-market": {
      title: "Car workspace",
      subtitle: "5 cars matched to your budget",
      blocks: [
        { type: "buying-setup",
          rows: [
            { label: "Safe EMI band",      value: "Up to ₹17,000/mo",            tone: "ok"   },
            { label: "Loan status",        value: "Pre-approved · 9.85% PSL",    tone: "ok"   },
            { label: "i20 trade-in",       value: "₹4.85L–₹4.92L estimate",      tone: "info" },
            { label: "Location",           value: "Whitefield + nearby",         tone: "neutral" },
          ],
        },
        { type: "chip-row",
          chips: [
            "Under ₹17k EMI",
            "Sedan",
            "Under 30k km",
            "A+ inspection",
            "Whitefield",
            "Gold verified",
            "Single owner",
          ],
        },
        { type: "car-card",
          recommended: true,
          model: "Honda City N-Line N8 CVT",
          year: "2022",
          km: "28,400 km",
          seller: "Spinny Whitefield",
          ownership: "Single owner",
          listed: "₹9,80,000",
          netAfterTradeIn: "₹4,88,000",
          emi: "₹16,100",
          tenure: "36 mo",
          inspection: "A+",
          tags: ["RC clean", "Service history"],
          aria: "Best match · keeps EMI inside your safe band, no corpus withdrawal needed.",
          openDeal: "carbuy-deal-honda",
        },
        { type: "car-card",
          model: "Maruti Ciaz Alpha SHVS",
          year: "2022",
          km: "24,100 km",
          seller: "Cars24",
          ownership: "Single owner",
          listed: "₹9,30,000",
          netAfterTradeIn: "₹4,38,000",
          emi: "₹14,450",
          tenure: "36 mo",
          inspection: "A",
          tags: ["Best fuel economy", "Mild hybrid"],
          openDeal: "carbuy-market",
        },
        { type: "car-card",
          model: "Hyundai Verna SX(O)",
          year: "2021",
          km: "32,800 km",
          seller: "Spinny",
          ownership: "1 prior owner",
          listed: "₹10,20,000",
          netAfterTradeIn: "₹5,28,000",
          emi: "₹17,420",
          tenure: "36 mo",
          inspection: "A",
          tags: ["Top trim", "Sunroof"],
          openDeal: "carbuy-market",
        },
        { type: "car-card",
          model: "VW Vento Highline",
          year: "2021",
          km: "38,500 km",
          seller: "OLX Autos",
          ownership: "1 prior owner",
          listed: "₹8,60,000",
          netAfterTradeIn: "₹3,68,000",
          emi: "₹12,140",
          tenure: "36 mo",
          inspection: "B+",
          tags: ["Lowest EMI", "German build"],
          openDeal: "carbuy-market",
        },
        { type: "car-card",
          model: "Toyota Yaris VX",
          year: "2022",
          km: "22,200 km",
          seller: "CarDekho",
          ownership: "Single owner",
          listed: "₹9,95,000",
          netAfterTradeIn: "₹5,03,000",
          emi: "₹16,590",
          tenure: "36 mo",
          inspection: "A+",
          tags: ["7 airbags", "Safety pack"],
          openDeal: "carbuy-market",
        },
        { type: "note", body: "All EMIs use your i20 trade-in and your pre-approved 9.85% relationship rate. Real EMI is confirmed before any approval. Listings are partner-verified under our marketplace integrations." },
      ],
      primaryAction: { label: "Open Honda City deal room", sub: "Recommended match", openFeature: "carbuy-deal-honda" },
    },

    // ──────────── Honda City deal room · the reconciled deal sheet ────────────
    "carbuy-deal-honda": {
      title: "Honda City · deal room",
      subtitle: "Spinny Whitefield · 2022 · A+ inspection",
      blocks: [
        { type: "deal-summary",
          stack: [
            { label: "Listed price",        value: "₹9,80,000", sign: "+" },
            { label: "i20 trade-in",        value: "₹4,92,000", sign: "-" },
            { label: "Net vehicle cost",    value: "₹4,88,000", total: true },
          ],
          financing: [
            { label: "Loan needed",         value: "₹5,00,000" },
            { label: "Tenure",              value: "36 months" },
            { label: "APR",                 value: "9.85%" },
            { label: "Estimated EMI",       value: "₹16,100/mo", highlight: true },
            { label: "Total interest",      value: "~₹79,600" },
          ],
        },
        { type: "divider", label: "Car details" },
        { type: "row", icon: "✓", title: "Inspection · A+",            sub: "210-point check · Spinny gold standard",            pill: { text: "Verified", tone: "primary" } },
        { type: "row", icon: "👤", title: "Ownership · single owner",   sub: "Purchased new May 2022 · in-warranty until May 2027" },
        { type: "row", icon: "📄", title: "RC status · clean",          sub: "RC verified · no hypothecation pending" },
        { type: "row", icon: "🔧", title: "Service history · complete", sub: "All services at Honda-authorised centres" },
        { type: "row", icon: "🏬", title: "Seller · Spinny Whitefield", sub: "Gold-verified partner · 7-day return policy", pill: { text: "Partner", tone: "primary" } },
        { type: "note", body: "Aria's note · This is the best match among your viewed cars because it keeps EMI inside your safe band, has A+ inspection, and does not require touching your investments. No corpus withdrawal needed." },
        { type: "deal-actions",
          actions: [
            { label: "Choose financing",   icon: "🏦", goStage: "a-carbuy-finance-pick", tone: "primary" },
            { label: "Schedule test drive", icon: "🚗", goStage: "a-carbuy-testdrive-ack" },
            { label: "Reserve car",        icon: "🔒", goStage: "a-carbuy-reserve-ack" },
            { label: "Compare similar",    icon: "↔",  openFeature: "carbuy-market" },
          ],
        },
      ],
      primaryAction: { label: "Choose financing", sub: "Pre-approved · ₹16,100/mo · 36 months", openStage: "a-carbuy-finance-pick" },
    },

    "send-money": {
      title: "Send money",
      subtitle: "Pay anyone — UPI, IMPS or NEFT",
      blocks: [
        { type: "divider", label: "Recent" },
        { type: "recipients", items: [
          { initials: "RS", name: "Rohan",  colour: "linear-gradient(135deg,#7C5CFF,#B66DFF)" },
          { initials: "SN", name: "Sneha",  colour: "linear-gradient(135deg,#F472B6,#FB7299)" },
          { initials: "AM", name: "Mom",    colour: "linear-gradient(135deg,#2DD4BF,#36E2C8)" },
          { initials: "LL", name: "Landlord", colour: "linear-gradient(135deg,#F59E0B,#FFB341)" },
          { initials: "+",  name: "New",    colour: "rgba(255,255,255,0.06)", ghost: true },
        ]},
        { type: "field", label: "To", placeholder: "UPI ID, phone or account no.", icon: "🔍" },
        { type: "field", label: "Amount", placeholder: "0.00", prefix: "₹", big: true },
        { type: "field", label: "Rail", placeholder: "UPI · instant · ₹1,00,000 daily limit", icon: "🔁" },
        { type: "field", label: "Note", placeholder: "What's this for?" },
        { type: "note", body: "UPI transfers are governed by NPCI and protected under the RBI Customer Liability Framework. You'll get an SMS + push for every debit." },
      ],
      primaryAction: { label: "Review and pay", sub: "Aadhaar OTP on amounts above ₹50,000" },
    },

    "pay-bills": {
      title: "Pay bills",
      subtitle: "All your billers in one place",
      blocks: [
        { type: "divider", label: "Due in the next 10 days" },
        { type: "row", icon: "💡", title: "BESCOM Electricity",   sub: "Bill ref · 110-2245-998 · Due 22 May", pill: { text: "₹2,840", tone: "warn" } },
        { type: "row", icon: "📱", title: "Vodafone Postpaid",    sub: "Mobile · +91 98xxxxxx · Due 25 May", pill: { text: "₹1,499", tone: "warn" } },
        { type: "row", icon: "📺", title: "Tata Play",            sub: "DTH · 1080·xxxx·xxxx · Due 24 May",   pill: { text: "₹699", tone: "warn" } },
        { type: "divider", label: "Auto-pay" },
        { type: "row", icon: "🔁", title: "Indane LPG",           sub: "Connection 9982-xxxx · auto-pay on delivery", pill: { text: "Auto", tone: "ghost" } },
        { type: "row", icon: "🔁", title: "Bajaj Allianz · Term",  sub: "Premium · auto-debit on 5th",          pill: { text: "Auto", tone: "ghost" } },
        { type: "note", body: "All billers are onboarded under BBPS (Bharat Bill Payment System), regulated by RBI. You get a single, reconciled biller history." },
      ],
      primaryAction: { label: "Pay BESCOM ₹2,840", sub: "First in queue · due 22 May" },
    },

    "cards": {
      title: "Your cards",
      subtitle: "Credit, debit, virtual",
      blocks: [
        { type: "cardItem",
          name: "Visa Signature Credit",
          number: "•• 4108",
          tone: "linear-gradient(135deg,#F472B6,#FB7299)",
          rows: [
            { label: "Outstanding", value: "₹41,220" },
            { label: "Limit", value: "₹2,50,000" },
            { label: "Due", value: "18 May · Tomorrow" },
          ],
          actions: ["View statement", "Pay now", "Lock", "Limits"],
        },
        { type: "cardItem",
          name: "Debit · Savings",
          number: "•• 7731",
          tone: "linear-gradient(135deg,#7C5CFF,#B66DFF)",
          rows: [
            { label: "Daily limit · ATM",  value: "₹40,000" },
            { label: "Daily limit · POS",  value: "₹2,00,000" },
            { label: "Daily limit · Online", value: "₹2,00,000" },
          ],
          actions: ["View", "Lock", "Limits", "Replace"],
        },
        { type: "note", body: "Card-on-file at 7 merchants is tokenised under the RBI tokenisation mandate. If you replace a card, tokens auto-update — your saved payments don't break." },
      ],
      primaryAction: { label: "Pay credit card statement", sub: "₹41,220 due tomorrow · 1-tap UPI" },
    },

    "investments": {
      title: "Investments",
      subtitle: "Your wealth at a glance",
      blocks: [
        { type: "summary", label: "Total portfolio", value: "₹2,18,460", delta: "+ 4.2% MTD", tone: "up" },
        { type: "divider", label: "Active SIPs" },
        { type: "row", icon: "📈", title: "Equity-Hybrid Fund · Direct", sub: "Next debit · 1 Jun · ₹15,000", pill: { text: "+4.2% MTD", tone: "primary" } },
        { type: "divider", label: "Suggestions" },
        { type: "row", icon: "🌱", title: "ELSS · tax saver", sub: "₹46,800 of your 80C limit unused this FY", pill: { text: "Explore", tone: "ghost" } },
        { type: "row", icon: "🏦", title: "Sovereign Gold Bond · Tranche 1 FY27", sub: "Open till 24 May · 2.5% annual interest + price appreciation", pill: { text: "Subscribe", tone: "ghost" } },
        { type: "note", body: "Mutual fund investments are subject to market risk. Read all scheme-related documents carefully. SEBI-registered distributor: ARN 19xxxx." },
      ],
      primaryAction: { label: "Start a new SIP", sub: "From ₹500/month · paperless KYC" },
    },

    "statements": {
      title: "Statements",
      subtitle: "Account, card, and tax-ready exports",
      blocks: [
        { type: "field", label: "Account", placeholder: "Savings · •• 7731", icon: "🏦" },
        { type: "field", label: "Period", placeholder: "Last 30 days · 18 Apr – 18 May", icon: "📅" },
        { type: "divider", label: "Format" },
        { type: "row", icon: "📄", title: "PDF · official statement", sub: "Bank-signed for visa / loan applications" },
        { type: "row", icon: "📊", title: "Excel · categorised", sub: "Auto-tagged for Money apps & spreadsheets" },
        { type: "row", icon: "🧾", title: "Tax CSV · for ITR", sub: "Interest, capital gains, TDS — pre-formatted" },
        { type: "row", icon: "💳", title: "Credit card statement", sub: "April cycle · ₹38,420 spends" },
        { type: "note", body: "Statements are digitally signed under the IT Act § 5. Acceptable as KYC-equivalent at most other institutions." },
      ],
      primaryAction: { label: "Email me the statement", sub: "PDF + Excel · to your registered email" },
    },

    "more": {
      title: "Settings & support",
      subtitle: "Manage your account",
      blocks: [
        { type: "summary", label: "Aria's autonomy", value: "7 rules running", delta: "Within the scope you've set · pause any at any time", tone: "up" },

        { type: "divider", label: "Standing rules" },
        { type: "rule-row", name: "Auto-categorise & tag transactions", level: 1, desc: "Spend categorisation · merchant tagging across all your accounts", lastFired: "18 May · continuous", monthCount: 86, paused: false },
        { type: "rule-row", name: "Suppress redundant notifications",   level: 1, desc: "Mute reminders for bills already paid in full",                       lastFired: "18 May · 02:00",     monthCount: 14, paused: false },
        { type: "rule-row", name: "Statement-due reminder",             level: 1, desc: "Push 3 days before any card statement date",                          lastFired: "15 May · 09:00",     monthCount: 1,  paused: false },
        { type: "rule-row", name: "Bill autopay (BBPS)",                level: 3, desc: "Pay recurring billers within ₹1k envelope each · skip if amount spikes", lastFired: "17 May · 07:00",   monthCount: 4,  paused: false },
        { type: "rule-row", name: "Auto-allocate salary",               level: 2, desc: "Queue 15% to SIP + 10% to savings buffer on every credit · never sent without tap", lastFired: "2 May · 09:02", monthCount: 1, paused: false },
        { type: "rule-row", name: "Cancel dormant subscriptions",       level: 3, desc: "Cancel under-₹1k subs unused for 60+ days · 7-day grace if you want it back", lastFired: "18 May · 03:18",  monthCount: 1,  paused: false },
        { type: "rule-row", name: "Block off-pattern card charges",     level: 4, desc: "Hold geo / MCC / amount outliers · push for your confirm · always reversible", lastFired: "12 May · 23:42",  monthCount: 1,  paused: false },

        { type: "divider", label: "Account" },
        { type: "row", icon: "🪪", title: "Profile & KYC", sub: "Verified · re-verify by 2027", chev: true },
        { type: "row", icon: "🔐", title: "Limits & controls", sub: "Daily UPI ₹1,00,000 · raise if needed", chev: true },
        { type: "row", icon: "🛡", title: "Security · 2FA", sub: "App lock + transaction OTP active", chev: true },
        { type: "row", icon: "🔔", title: "Notifications", sub: "SMS · push · email", chev: true },
        { type: "row", icon: "📱", title: "Linked devices", sub: "2 active sessions", chev: true },
        { type: "row", icon: "🎯", title: "Goals & nicknames", sub: "Tag accounts for clarity", chev: true },
        { type: "row", icon: "🎧", title: "Help & support", sub: "Chat · call · branch finder", chev: true },
        { type: "row", icon: "↩", title: "Sign out", sub: "", chev: true, tone: "danger" },
      ],
      primaryAction: null,
    },

  },
};
