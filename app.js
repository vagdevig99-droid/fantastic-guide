// ════════════════════════════════════════════════════════════════════════
// Aria · runtime
//
// Screens: intro → hero → page (today/money/plan/offers) → chat
//          classic is a top-level toggle.
// Bottom tabbar drives page + chat. Aria/Classic header toggle keeps the
// Classic single-dashboard fallback intact.
// ════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════
// Icon registry · Lucide-style monochrome stroke SVGs · 24×24 viewBox
// Used for the formal banking aesthetic across tiles, chips, nav, etc.
// stroke="currentColor" + fill="none" → inherits colour from parent tile.
// ════════════════════════════════════════════════════════════════════════
const ICONS = {
  // payments & money movement
  send:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  receipt:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
  card:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  chart:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>',
  document:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  grid:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  wallet:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  loan:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 2 8 22 8 12 2"/></svg>',
  trending:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
  building:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="3" y1="9" x2="3" y2="22"/><line x1="21" y1="9" x2="21" y2="22"/><polyline points="3 9 12 3 21 9"/><line x1="8" y1="14" x2="8" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="16" y1="14" x2="16" y2="18"/></svg>',
  users:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  calculator:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16" y2="18"/></svg>',
  vendor:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 16 12"/><polyline points="13 8 17 12 13 16"/></svg>',
  home:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  package:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  spark:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.39 7.36L22 12l-7.61 2.64L12 22l-2.39-7.36L2 12l7.61-2.64Z"/></svg>',
  target:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  shield:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 6v6c0 5 4 9 8 10 4-1 8-5 8-10V6z"/></svg>',
  globe:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

function iconSvg(name) {
  return ICONS[name] || "";
}

function renderIcon(value) {
  if (!value) return "";
  if (ICONS[value]) return iconSvg(value);
  return value;   /* emoji passthrough — backward-compat for un-migrated data */
}

/* Live-mode indicator · subtle green dot in the status bar · presenter-only */
function setLiveIndicator(on) {
  const el = document.getElementById("liveDot");
  if (!el) return;
  el.hidden = !on;
}

/* Graceful error bubble for live-mode failures · friendly tone + retry chip */
function renderLiveError(message, lastUserText) {
  const wrap = document.createElement("div");
  wrap.className = "msg aria error-bubble";
  wrap.innerHTML = `
    <div class="bubble">
      <p>${message}</p>
      <button type="button" class="error-retry">↻ Try again</button>
    </div>`;
  if (els.chat) {
    els.chat.appendChild(wrap);
    scrollChat();
    const btn = wrap.querySelector(".error-retry");
    if (btn && lastUserText) {
      btn.addEventListener("click", () => {
        wrap.remove();
        handleFreeText(lastUserText);
      });
    }
  }
}

const els = {
  phone: document.querySelector(".phone"),
  // header
  personaName: document.getElementById("personaName"),
  personaTag: document.getElementById("personaTag"),
  personaAvatar: document.getElementById("personaAvatar"),
  personaSelect: document.getElementById("personaSelect"),
  viewToggle: document.getElementById("viewToggle"),
  hero: document.getElementById("hero"),
  ariaState: document.getElementById("ariaState"),
  // screens
  screenIntro: document.getElementById("screenIntro"),
  screenHero: document.getElementById("screenHero"),
  screenPage: document.getElementById("screenPage"),
  screenChat: document.getElementById("screenChat"),
  screenClassic: document.getElementById("screenClassic"),
  // hero
  heroGreeting: document.getElementById("heroGreeting"),
  heroChips: document.getElementById("heroChips"),
  heroQuickbox: document.getElementById("heroQuickbox"),
  heroInput: document.getElementById("heroInput"),
  heroSkip: document.getElementById("heroSkip"),
  // page
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  pageBlocks: document.getElementById("pageBlocks"),
  // chat
  chat: document.getElementById("chat"),
  chipsWrap: document.getElementById("chipsWrap"),
  chips: document.getElementById("chips"),
  composer: document.getElementById("composer"),
  composerInput: document.getElementById("composerInput"),
  micBtn: document.getElementById("micBtn"),
  // classic
  classicGreet: document.getElementById("classicGreet"),
  accountCards: document.getElementById("accountCards"),
  quickActions: document.getElementById("quickActions"),
  txList: document.getElementById("txList"),
  ariaFab: document.getElementById("ariaFab"),
  // voice
  voiceOverlay: document.getElementById("voiceOverlay"),
  voiceState: document.getElementById("voiceState"),
  voiceWaveform: document.getElementById("voiceWaveform"),
  voiceTranscription: document.getElementById("voiceTranscription"),
  voiceCancel: document.getElementById("voiceCancel"),
  // feature
  screenFeature: document.getElementById("screenFeature"),
  featureBack: document.getElementById("featureBack"),
  featureTitle: document.getElementById("featureTitle"),
  featureSubtitle: document.getElementById("featureSubtitle"),
  featureScroll: document.getElementById("featureScroll"),
  featureActionWrap: document.getElementById("featureActionWrap"),
  featureAction: document.getElementById("featureAction"),
  featureActionLabel: document.getElementById("featureActionLabel"),
  featureActionSub: document.getElementById("featureActionSub"),
  featureFab: document.getElementById("featureFab"),
  // tabbar
  tabbar: document.getElementById("tabbar"),
};

const state = {
  personaId: "priya",
  screen: "intro",   // intro | hero | page | chat | classic | feature
  viewMode: "aria",  // "aria" | "classic" · controls feature-screen back behaviour
  activeTab: null,
  busy: false,
  // The hybrid is invisible to the audience. If the backend is reachable
  // with a key, we silently engage Live mode; otherwise we stay Scripted.
  // A URL param `?mode=scripted` forces scripted regardless.
  mode: "scripted",
  liveReady: false,
  // Track which terminal stages this session has completed so the chips
  // at the chat bottom can adapt to what the customer just did.
  completedStages: new Set(),
  // Active plans Aria has kicked off this session — keyed by persona:plan-id
  // (e.g. "arjun:salary-3"). Surface on Today via renderBlockActivePlan.
  activePlans: new Set(),
};

// Map · which stage-id activates which plan-key in state.activePlans
// When runStage lands on a stage in this map, the plan is added/upgraded.
// Selecting an option goes straight to the active state — no intermediate
// "Approval pending" step (friction-reduced demo flow).
const STAGE_TO_PLAN = {
  // Phase 1 · salary-bump showcase (immediate-active)
  "a-salary-plan-1":             "arjun:salary-1",
  "a-salary-plan-2":             "arjun:salary-2",
  "a-salary-plan-3":             "arjun:salary-3-approved",
  // Phase 2 · other action CTAs
  "a-orig-disbursal-active":     "arjun:car-purchase",
  "a-cardapp-platinum-active":   "arjun:platinum-card",
  "a-growth-taj-booking":        "arjun:taj-booking",
  "a-growth-forex-active":       "arjun:forex-card",
  "p-serv-release-active":       "priya:release",
  "p-serv-compliance-active":    "priya:compliance",
  "p-sales-aa-consent-sent":     "priya:aa-consent-sent",
  "p-sales-application-drafted": "priya:sme-eq-application",
};
const PLAN_SUPERSEDES = {
  // The 3 salary options are mutually exclusive — picking one supersedes the others
  "arjun:salary-3-approved": ["arjun:salary-1", "arjun:salary-2"],
  "arjun:salary-1":          ["arjun:salary-2", "arjun:salary-3-approved"],
  "arjun:salary-2":          ["arjun:salary-1", "arjun:salary-3-approved"],
  // Compliance review replaces quick-release (alternative branches for the same hold)
  "priya:compliance": ["priya:release"],
  "priya:release":    ["priya:compliance"],
};

// Where the live backend lives. When you double-click index.html the server
// (if running) is on http://localhost:8000. When served by the server itself
// (http://localhost:8000/) we just use same-origin.
const LIVE_HOST = (location.origin && location.origin.startsWith("http"))
  ? location.origin
  : "http://localhost:8000";

// ────────────────────────────────────────────────────────────────────────
// Utility
// ────────────────────────────────────────────────────────────────────────
const persona = () => PERSONAS[state.personaId];
const categories = () => CATEGORIES[state.personaId] || [];
const classic = () => CLASSIC_VIEW[state.personaId];
const pageData = (id) => (PERSONALISED_PAGES[state.personaId] || {})[id];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const scrollChat = () => { els.chat.scrollTop = els.chat.scrollHeight; };

function agentColorClass(agentName) {
  if (/servicing/i.test(agentName)) return "servicing";
  if (/sales|advisory/i.test(agentName)) return "sales";
  if (/growth|marketplace/i.test(agentName)) return "growth";
  if (/origination|onboarding|decisioning/i.test(agentName)) return "origination";
  return "frontdoor";
}
function agentInitial(agentName) {
  if (/servicing/i.test(agentName)) return "SV";
  if (/sales|advisory/i.test(agentName)) return "SA";
  if (/growth|marketplace/i.test(agentName)) return "GR";
  if (/origination|onboarding|decisioning/i.test(agentName)) return "OR";
  return "AR";
}

// ────────────────────────────────────────────────────────────────────────
// Value-tree lever badges
// Each new screen built for the methodology-first framing carries one.
// 6 lever tokens across the 3 in-scope hotspots:
//   4 × Origination · 1 × Sales & Advisory · 1 × Growth & Loyalty
// Hotspot class drives colour:
//   origination=indigo · sales=violet · growth=teal
// ────────────────────────────────────────────────────────────────────────
const LEVERS = {
  "orig-app":     { hotspot: "origination", label: "Simplify application" },
  "orig-kyc":     { hotspot: "origination", label: "Automate KYC/KYB" },
  "orig-dec":     { hotspot: "origination", label: "Accelerate decisioning" },
  "orig-aud":     { hotspot: "origination", label: "Strengthen audit trail" },
  "sales-nba":    { hotspot: "sales",       label: "Improve lead conversion" },
  "growth-well":  { hotspot: "growth",      label: "Build wellness journeys" },
  "growth-eco":   { hotspot: "growth",      label: "Ecosystem expansion" },
};

const HOTSPOT_LABELS = {
  origination: "Origination",
  sales:       "Sales & Advisory",
  growth:      "Growth · Loyalty",
};

// Inline HTML for embedding inside responseHtml strings or block templates.
// Accepts a single lever key or an array of keys (for dual-lever cases).
function leverBadgeHtml(keys) {
  const arr = Array.isArray(keys) ? keys : [keys];
  return arr.map((k) => {
    const l = LEVERS[k];
    if (!l) return "";
    return `<span class="lever-badge lever-${l.hotspot}" title="${HOTSPOT_LABELS[l.hotspot]} · ${l.label}">
      <svg class="lever-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v8M12 14v8M5 7l7 7 7-7M5 17l7-7 7 7"/></svg>
      <span class="lever-hotspot">${HOTSPOT_LABELS[l.hotspot]}</span>
      <span class="lever-dot">·</span>
      <span class="lever-label">${l.label}</span>
    </span>`;
  }).join("");
}
function setAriaState(text, busy = false) {
  els.ariaState.textContent = text;
  els.phone.classList.toggle("thinking", busy);
}

// ────────────────────────────────────────────────────────────────────────
// Screen / view state
// ────────────────────────────────────────────────────────────────────────
const SCREEN_NODES = {
  intro:   "screenIntro",
  hero:    "screenHero",
  page:    "screenPage",
  chat:    "screenChat",
  classic: "screenClassic",
  feature: "screenFeature",
};

function showScreen(name) {
  state.screen = name;

  // Toggle visibility
  for (const key of Object.keys(SCREEN_NODES)) {
    els[SCREEN_NODES[key]].hidden = (key !== name);
  }

  // Phone view-* class drives CSS for header hero / borders
  const VIEW_CLASSES = ["view-intro","view-hero","view-page","view-chat","view-classic","view-feature"];
  els.phone.classList.remove(...VIEW_CLASSES);
  els.phone.classList.add("view-" + name);

  // Tabbar visible on page + chat
  els.tabbar.hidden = !(name === "page" || name === "chat");

  // Aria/Classic header toggle — feature screens count as Classic mode
  const onClassic = (name === "classic" || name === "feature");
  els.viewToggle.querySelectorAll(".view-btn").forEach((b) => {
    const isActive =
      (b.dataset.view === "agent" && !onClassic) ||
      (b.dataset.view === "classic" && onClassic);
    b.classList.toggle("active", isActive);
  });

  // Tab highlight
  syncTabbarHighlight();

  // Set Aria header state
  if (name === "chat") {
    setAriaState("Listening", false);
  } else if (name === "page" || name === "hero") {
    setAriaState("Ready", false);
  }
}

function syncTabbarHighlight() {
  els.tabbar.querySelectorAll(".tab-item").forEach((b) => {
    const tab = b.dataset.tab;
    const active =
      (state.screen === "chat" && tab === "chat") ||
      (state.screen === "page" && tab === state.activeTab);
    b.classList.toggle("active", active);
  });
}

// ────────────────────────────────────────────────────────────────────────
// Persona / header
// ────────────────────────────────────────────────────────────────────────
function renderPersonaHeader() {
  const p = persona();
  // Split "First Last" → first name on line 1, surname on line 2
  const parts = (p.name || "").trim().split(/\s+/);
  const first = parts.shift() || "";
  const last = parts.join(" ");
  els.personaName.innerHTML = last
    ? `<span class="pn-first">${first}</span><span class="pn-last">${last}</span>`
    : first;
  els.personaTag.textContent = "";
  els.personaAvatar.textContent = p.avatar;
  els.personaSelect.value = p.id;
}

// ────────────────────────────────────────────────────────────────────────
// Intro splash → hero
// ────────────────────────────────────────────────────────────────────────
function runIntro() {
  showScreen("intro");
  setTimeout(() => {
    showScreen("hero");
    renderHero();
  }, 1900);
}

// ────────────────────────────────────────────────────────────────────────
// Hero screen
// ────────────────────────────────────────────────────────────────────────
function renderHero() {
  const p = persona();
  els.heroGreeting.innerHTML =
    `Hello, <b>${p.name.split(" ")[0]}</b>. ${stripGreetingLead(p.homeGreeting)}`;

  els.heroChips.innerHTML = "";
  categories().forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hero-chip";
    btn.style.setProperty("--chip-grad", cat.gradient);
    btn.innerHTML = `
      <div class="chip-icon">${renderIcon(cat.icon)}</div>
      <div class="chip-text">${cat.label}</div>
      <svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    `;
    btn.addEventListener("click", () => startFromCategory(cat));
    els.heroChips.appendChild(btn);
  });
}

// Trim the greeting prefix ("Good morning, Priya. ..." / "Hey Arjun. ...")
// so we can prepend our own "Hello, Priya." in the hero.
function stripGreetingLead(g) {
  return g.replace(/^(good morning,|good afternoon,|good evening,|hello,|hey),?\s*\w+\.?\s*/i, "");
}

// ────────────────────────────────────────────────────────────────────────
// Personalised pages
// ────────────────────────────────────────────────────────────────────────
function selectTab(tabId) {
  state.activeTab = tabId;
  if (tabId === "chat") {
    if (els.chat.innerHTML === "") {
      appendAriaPlain(persona().chatOpening);
      renderBrowseStrip();
    }
    showScreen("chat");
    return;
  }
  showScreen("page");
  renderPage(tabId);
}

// Browse-via-conversation strip appended below Aria's opening greeting.
// Removes itself on first interaction so it doesn't clutter the thread.
function renderBrowseStrip() {
  const verticals = BROWSE_VERTICALS[state.personaId] || [];
  if (!verticals.length) return;
  const wrap = document.createElement("div");
  wrap.className = "browse-strip";
  wrap.innerHTML = `
    <div class="browse-strip-label">Or browse</div>
    <div class="browse-strip-row">
      ${verticals.map((v, i) => `
        <button type="button" class="browse-chip" data-idx="${i}">
          <span class="browse-icon">${v.icon}</span>
          <span class="browse-label">${v.label}</span>
        </button>
      `).join("")}
    </div>
  `;
  els.chat.appendChild(wrap);
  scrollChat();
  wrap.querySelectorAll(".browse-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = +btn.dataset.idx;
      const v = verticals[idx];
      wrap.remove();
      if (state.mode === "live" && state.liveReady) {
        runLiveTurn(v.userMessage);
      } else {
        appendUserMessage(v.userMessage);
        setTimeout(() => runStage(v.goTo), 200);
      }
    });
  });
}

function renderPage(pageId) {
  const data = pageData(pageId);
  if (!data) return;
  els.pageTitle.textContent = data.title;
  els.pageSubtitle.textContent = data.subtitle;

  els.pageBlocks.innerHTML = "";

  // Surface any active plans Aria has kicked off this session — only on Today
  // and only for the current persona (plan keys are prefixed "arjun:" / "priya:").
  if (pageId === "today" && state.activePlans && state.activePlans.size > 0
      && typeof ACTIVE_PLANS !== "undefined") {
    const personaPrefix = state.personaId + ":";
    Array.from(state.activePlans)
      .filter(k => k.startsWith(personaPrefix))
      .forEach((planKey) => {
        const planBlock = ACTIVE_PLANS[planKey];
        if (planBlock) {
          const node = renderBlock(planBlock);
          if (node) {
            node.dataset.planKey = planKey;
            els.pageBlocks.appendChild(node);
          }
        }
      });
  }

  // Partition the page's static blocks into "live" and "handled" buckets.
  // A block is "handled" if any of its handledByPlans is already an active plan.
  const liveBlocks = [];
  const handledBlocks = [];
  (data.blocks || []).forEach((block) => {
    if (pageId === "today" && block.handledByPlans && state.activePlans
        && block.handledByPlans.some(p => state.activePlans.has(p))) {
      handledBlocks.push(block);
    } else {
      liveBlocks.push(block);
    }
  });

  liveBlocks.forEach((block) => {
    const node = renderBlock(block);
    if (node) els.pageBlocks.appendChild(node);
  });

  if (handledBlocks.length > 0) {
    els.pageBlocks.appendChild(renderHandledTriggers(handledBlocks));
  }
}

// Compact "Handled triggers (N) ▾" row at the bottom of Today · expands to
// show faded versions of trigger NBAs/alerts the user has already acted on.
// The tracker card above is the live source of truth.
function renderHandledTriggers(blocks) {
  const wrap = document.createElement("div");
  wrap.className = "handled-triggers";
  const itemsHtml = `<div class="handled-triggers-items"></div>`;
  wrap.innerHTML = `
    <button type="button" class="handled-triggers-toggle">
      <span class="handled-triggers-label">Handled triggers (${blocks.length})</span>
      <svg class="handled-triggers-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    ${itemsHtml}
  `;
  const items = wrap.querySelector(".handled-triggers-items");
  blocks.forEach((block) => {
    const node = renderBlock(block);
    if (!node) return;
    node.classList.add("handled");
    // Hard-disable clicks on the faded card · the tracker above is the live thing
    node.querySelectorAll("button, .nba-cta, .nba-secondary, .alert-cta").forEach(b => {
      b.disabled = true;
      b.style.pointerEvents = "none";
    });
    const footer = document.createElement("div");
    footer.className = "handled-footer";
    footer.textContent = "Handled · see tracker above";
    node.appendChild(footer);
    items.appendChild(node);
  });
  wrap.querySelector(".handled-triggers-toggle").addEventListener("click", () => {
    wrap.classList.toggle("expanded");
  });
  return wrap;
}

function renderBlock(block) {
  switch (block.type) {
    case "alert":       return renderBlockAlert(block);
    case "overnight":   return renderBlockOvernight(block);
    case "nba-card":    return renderBlockNba(block);
    case "kpi":         return renderBlockKpi(block);
    case "insight":     return renderBlockInsight(block);
    case "narrative":   return renderBlockNarrative(block);
    case "chart":       return renderBlockChart(block);
    case "card":        return renderBlockCard(block);
    case "cta":         return renderBlockCta(block);
    case "goal-card":   return renderBlockGoal(block);
    case "active-plan":  return renderBlockActivePlan(block);
    case "buying-setup": return renderBlockBuyingSetup(block);
    case "chip-row":     return renderBlockChipRow(block);
    case "car-card":     return renderBlockCarCard(block);
    case "deal-summary": return renderBlockDealSummary(block);
    case "deal-actions": return renderBlockDealActions(block);
    default:            return null;
  }
}

// ─── Car workspace · block renderers ──────────────────────────────────
// Buying-setup header on the marketplace · shows EMI band, pre-approval,
// trade-in estimate, location — all the pre-computed intelligence Aria
// brings to every car card.
function renderBlockBuyingSetup(b) {
  const node = document.createElement("div");
  node.className = "buying-setup";
  const rowsHtml = (b.rows || []).map(r => `
    <div class="buying-setup-row tone-${r.tone || "neutral"}">
      <div class="buying-setup-label">${r.label}</div>
      <div class="buying-setup-value">${r.value}</div>
    </div>`).join("");
  node.innerHTML = `
    <div class="buying-setup-head">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      <span>Your buying setup</span>
    </div>
    <div class="buying-setup-rows">${rowsHtml}</div>`;
  return node;
}

// Visual filter-chip strip on the marketplace · decorative for the demo
function renderBlockChipRow(b) {
  const node = document.createElement("div");
  node.className = "chip-row";
  node.innerHTML = (b.chips || []).map(c => `<span class="chip">${c}</span>`).join("");
  return node;
}

// Car card · one row per matched car. Carries EMI/trade-in/inspection
// pre-computed. "View deal" opens the deal-room feature for that car.
function renderBlockCarCard(b) {
  const node = document.createElement("div");
  node.className = "car-card" + (b.recommended ? " recommended" : "");
  const tagsHtml = (b.tags || []).map(t => `<span class="car-tag">${t}</span>`).join("");
  node.innerHTML = `
    ${b.recommended ? `<span class="car-rec-pill">Recommended</span>` : ""}
    <div class="car-card-head">
      <div class="car-card-title">
        <b>${b.model}</b>
        <span class="car-card-meta">${b.year} · ${b.km} · ${b.ownership || ""}</span>
      </div>
      <div class="car-card-seller">${b.seller || ""}</div>
    </div>
    <div class="car-card-pricerow">
      <div class="car-card-listed"><span class="muted">Listed</span><b>${b.listed}</b></div>
      <div class="car-card-net"><span class="muted">After trade-in</span><b>~${b.netAfterTradeIn}</b></div>
      <div class="car-card-emi"><span class="muted">Est. EMI</span><b>${b.emi}<span class="emi-tenure">/${b.tenure || "mo"}</span></b></div>
    </div>
    <div class="car-card-tags">
      <span class="car-tag inspection-${(b.inspection || "").replace("+","-plus").toLowerCase()}">${b.inspection || "—"} inspection</span>
      ${tagsHtml}
    </div>
    ${b.aria ? `<div class="car-aria">${b.aria}</div>` : ""}
    <div class="car-card-actions">
      <button type="button" class="car-card-cta">View deal
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>`;
  node.querySelector(".car-card-cta").addEventListener("click", () => {
    if (b.openDeal && b.openDeal !== "carbuy-market") {
      openFeature(b.openDeal);
    } else {
      // Alternative car — surface a brief toast and stay on marketplace
      showToast("Honda City stays the active deal. Tap that card to switch.");
    }
  });
  return node;
}

// Deal-summary block · reconciled cost stack + financing summary
// inside the deal room. The math IS the trust.
function renderBlockDealSummary(b) {
  const node = document.createElement("div");
  node.className = "deal-summary";
  const stackHtml = (b.stack || []).map(s => `
    <div class="deal-stack-row ${s.total ? "total" : ""}">
      <span class="deal-stack-label">${s.label}</span>
      <span class="deal-stack-value">${s.sign === "-" ? "−" : ""}${s.value}</span>
    </div>`).join("");
  const financeHtml = (b.financing || []).map(f => `
    <div class="deal-finance-row ${f.highlight ? "highlight" : ""}">
      <span class="deal-finance-label">${f.label}</span>
      <span class="deal-finance-value">${f.value}</span>
    </div>`).join("");
  node.innerHTML = `
    <div class="deal-stack">${stackHtml}</div>
    <div class="deal-finance">
      <div class="deal-finance-head">Financing</div>
      ${financeHtml}
    </div>`;
  return node;
}

// Deal-actions row · 4 buttons on the deal room (Choose financing /
// Test drive / Reserve / Compare similar)
function renderBlockDealActions(b) {
  const node = document.createElement("div");
  node.className = "deal-actions";
  (b.actions || []).forEach(a => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "deal-action" + (a.tone === "primary" ? " primary" : "");
    btn.innerHTML = `<span class="deal-action-icon">${a.icon || ""}</span><span>${a.label}</span>`;
    btn.addEventListener("click", () => {
      if (a.openFeature) {
        openFeature(a.openFeature);
      } else if (a.goStage) {
        selectTab("chat");
        runStage(a.goStage);
      }
    });
    node.appendChild(btn);
  });
  return node;
}

// Open Today with the freshest active plan scrolled into view + briefly pulsed
function openTodayWithActivePlan() {
  selectTab("today");
  setTimeout(() => {
    const node = els.pageBlocks.querySelector(".block-active-plan");
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
      node.classList.add("pulse-in");
      setTimeout(() => node.classList.remove("pulse-in"), 1400);
    }
  }, 80);
}

// Active-plan tracker card on Today — shows the in-flight financial mission
// Aria is running, with row-by-row status and a "continue setup" CTA.
function renderBlockActivePlan(b) {
  const node = document.createElement("div");
  node.className = "block-active-plan";
  const rowsHtml = (b.rows || []).map(r => `
    <div class="plan-row tone-${r.tone || "neutral"}">
      <div class="plan-row-label">${r.label}</div>
      <div class="plan-row-status">${r.status}</div>
    </div>`).join("");
  node.innerHTML = `
    <div class="plan-head">
      <div class="plan-head-title">
        <svg class="plan-head-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>${b.title}</span>
      </div>
      <span class="plan-status-pill">${b.statusPill || "Active"}</span>
    </div>
    ${b.selectedSummary ? `<div class="plan-summary">${b.selectedSummary}</div>` : ""}
    <div class="plan-rows">${rowsHtml}</div>
    ${b.primaryAction ? `
      <button type="button" class="plan-cta">${b.primaryAction.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>` : ""}
    ${b.secondaryAction ? `
      <button type="button" class="plan-cta-secondary">${b.secondaryAction.label}</button>` : ""}
  `;
  if (b.primaryAction && b.primaryAction.openStage) {
    node.querySelector(".plan-cta").addEventListener("click", () => {
      selectTab("chat");
      runStage(b.primaryAction.openStage);
    });
  }
  if (b.secondaryAction && b.secondaryAction.openStage) {
    node.querySelector(".plan-cta-secondary").addEventListener("click", () => {
      selectTab("chat");
      runStage(b.secondaryAction.openStage);
    });
  }
  return node;
}

// NBA (next-best-action) trigger card on Today.
// Used by the car-buying moment, salary-increment moment, pre-trip activation,
// and TReDS for Priya. Carries a lever badge for methodology-first attribution.
function renderBlockNba(b) {
  const node = document.createElement("div");
  node.className = "block-nba" + (b.tone ? ` tone-${b.tone}` : "");
  const signalsHtml = (b.signals || []).map(s =>
    `<span class="nba-signal">${s}</span>`
  ).join("<span class=\"nba-signal-dot\">·</span>");
  node.innerHTML = `
    <div class="nba-header">
      <div class="nba-trigger">
        <svg class="nba-sparkle" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
        <span>${b.triggerLabel || "Trigger detected"}</span>
      </div>
      ${b.levers ? leverBadgeHtml(b.levers) : ""}
    </div>
    <div class="nba-title">${b.title}</div>
    ${b.signals && b.signals.length ? `<div class="nba-signals">${signalsHtml}</div>` : ""}
    ${b.body ? `<div class="nba-body">${b.body}</div>` : ""}
    <div class="nba-actions">
      <button type="button" class="nba-cta">${b.actionLabel || "Open with Aria"}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      ${b.secondaryLabel ? `<button type="button" class="nba-secondary">${b.secondaryLabel}</button>` : ""}
    </div>
  `;
  if (b.openFeature) {
    node.querySelector(".nba-cta").addEventListener("click", () => openFeature(b.openFeature));
  } else if (b.openStage) {
    node.querySelector(".nba-cta").addEventListener("click", () => goToChatStage(b.openStage));
  }
  if (b.secondaryLabel) {
    const sec = node.querySelector(".nba-secondary");
    if (sec) {
      if (b.secondaryOpenFeature) {
        sec.addEventListener("click", () => openFeature(b.secondaryOpenFeature));
      } else if (b.secondaryOpenStage) {
        sec.addEventListener("click", () => goToChatStage(b.secondaryOpenStage));
      } else {
        sec.addEventListener("click", () => showToast("Saved · I'll bring it back when timing's better"));
      }
    }
  }
  return node;
}

// Goal card on Plan tab — Home Down-Payment with BEHIND/ON TRACK status.
// Tappable → opens goal-detail feature screen with trajectory + what-if simulator.
function renderBlockGoal(b) {
  const node = document.createElement("div");
  node.className = "block-goal" + (b.status ? ` status-${b.status}` : "");
  const pct = Math.max(0, Math.min(100, b.percentFunded || 0));
  node.innerHTML = `
    <div class="goal-header">
      <div class="goal-meta">
        <div class="goal-name">${b.name}</div>
        <div class="goal-sub">${b.subtitle || ""}</div>
      </div>
      <span class="goal-status pill-${b.status || "neutral"}">${b.statusLabel || (b.status || "").toUpperCase()}</span>
    </div>
    <div class="goal-amounts">
      <span class="goal-current">${b.current}</span>
      <span class="goal-of">of</span>
      <span class="goal-target">${b.target}</span>
      <span class="goal-percent">${pct}%</span>
    </div>
    <div class="goal-bar">
      <div class="goal-fill status-${b.status || "neutral"}" style="width:${pct}%"></div>
    </div>
    <div class="goal-footer">
      <div class="goal-monthly">
        <span class="muted">Contributing</span>
        <b>${b.monthly}</b>
        <span class="muted">/ mo</span>
      </div>
      ${b.levers ? leverBadgeHtml(b.levers) : ""}
    </div>
    ${b.aria ? `<div class="goal-aria">${b.aria}</div>` : ""}
    <button type="button" class="goal-open">Open simulator
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `;
  if (b.openFeature) {
    node.querySelector(".goal-open").addEventListener("click", () => openFeature(b.openFeature));
  }
  return node;
}

function renderBlockOvernight(b) {
  const node = document.createElement("div");
  node.className = "block-overnight";
  const receiptHtml = (b.receipts || []).map((r, i) => `
    <div class="ov-receipt" data-receipt-index="${i}">
      <div class="ov-receipt-row">
        <span class="ov-tick">${r.reversible ? "" : "·"}</span>
        <div class="ov-receipt-body">
          <div class="ov-action">${r.action}</div>
          <div class="ov-meta">
            <span class="ov-rule">${r.rule}</span>
            <span class="ov-dot">·</span>
            <span class="ov-time">${r.time}</span>
            ${r.reversible ? `<span class="ov-dot">·</span><button type="button" class="ov-reverse" data-receipt-index="${i}">Reverse</button>` : ""}
          </div>
          ${r.detail ? `<div class="ov-detail">${r.detail}</div>` : ""}
        </div>
      </div>
    </div>
  `).join("");
  node.innerHTML = `
    <button type="button" class="ov-header" aria-expanded="false">
      <div class="ov-header-icon">🌙</div>
      <div class="ov-header-body">
        <div class="ov-headline">${b.headline}</div>
        <div class="ov-subline">${b.subline}</div>
      </div>
      <svg class="ov-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="ov-list" hidden>${receiptHtml}</div>
  `;
  // Toggle expand
  const header = node.querySelector(".ov-header");
  const list = node.querySelector(".ov-list");
  header.addEventListener("click", () => {
    const isOpen = !list.hidden;
    list.hidden = isOpen;
    header.setAttribute("aria-expanded", String(!isOpen));
    node.classList.toggle("expanded", !isOpen);
  });
  // Reverse buttons
  node.querySelectorAll(".ov-reverse").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = +btn.dataset.receiptIndex;
      const receipt = node.querySelector(`.ov-receipt[data-receipt-index="${idx}"]`);
      if (receipt) {
        receipt.classList.add("reversed");
        btn.textContent = "Reversed";
        btn.disabled = true;
        showToast("Reversed · this action will not repeat for 30 days");
      }
    });
  });
  return node;
}

// Tiny toast helper (used by overnight Reverse + future moments)
function showToast(text) {
  let toast = document.getElementById("ariaToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ariaToast";
    toast.className = "aria-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("visible");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function renderBlockAlert(b) {
  const node = document.createElement("div");
  node.className = "block-alert" + (b.tone ? ` tone-${b.tone}` : "");
  node.innerHTML = `
    <div class="alert-icon">${b.icon || "⚠"}</div>
    <div class="alert-body">
      <div class="alert-title">${b.title}</div>
      <div class="alert-text">${b.body}</div>
      ${b.actionLabel
        ? `<button class="alert-action">${b.actionLabel}
             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
           </button>`
        : ""}
    </div>
  `;
  if (b.openStage) {
    const btn = node.querySelector(".alert-action");
    if (btn) btn.addEventListener("click", () => goToChatStage(b.openStage));
  }
  return node;
}

function renderBlockKpi(b) {
  const node = document.createElement("div");
  node.className = "block-kpi";
  node.innerHTML = `
    <div class="kpi-label">${b.label}</div>
    <div class="kpi-value">${b.value}</div>
    ${b.delta ? `<div class="kpi-delta ${b.deltaTone || "neutral"}">${b.delta}</div>` : ""}
    ${b.context ? `<div class="kpi-context">${b.context}</div>` : ""}
  `;
  return node;
}

function renderBlockInsight(b) {
  const node = document.createElement("div");
  node.className = "block-insight";
  node.innerHTML = `
    <div class="insight-icon">${b.icon || "💡"}</div>
    <div class="insight-body">
      <div class="insight-title">${b.title}</div>
      ${b.body ? `<div class="insight-text">${b.body}</div>` : ""}
    </div>
  `;
  return node;
}

function renderBlockNarrative(b) {
  const node = document.createElement("div");
  node.className = "block-narrative";
  node.innerHTML = `
    <div class="narrative-dot"></div>
    <div class="narrative-text">${b.body}</div>
  `;
  return node;
}

function renderBlockChart(b) {
  const node = document.createElement("div");
  node.className = "block-chart";
  node.innerHTML = `
    ${b.title ? `<div class="chart-title">${b.title}</div>` : ""}
    ${(b.bars || []).map((bar) => `
      <div class="bar">
        <div class="bar-fill" style="width:${bar.width}%;background:${bar.color}"></div>
        <span>${bar.label}</span>
      </div>
    `).join("")}
  `;
  return node;
}

function renderBlockCard(b) {
  const node = document.createElement("div");
  node.className = "block-card";
  node.innerHTML = b.html || "";
  return node;
}

function renderBlockCta(b) {
  const node = document.createElement("div");
  node.className = "block-cta";
  node.innerHTML = `
    <button>
      <span>${b.label}</span>
      <span class="cta-arrow">Open chat
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </span>
    </button>
  `;
  if (b.openStage) {
    node.querySelector("button").addEventListener("click", () => goToChatStage(b.openStage));
  }
  return node;
}

// ────────────────────────────────────────────────────────────────────────
// Chat — rendering primitives
// ────────────────────────────────────────────────────────────────────────
function appendUserMessage(text) {
  const node = document.createElement("div");
  node.className = "msg user";
  node.innerHTML = `<div class="bubble"></div>`;
  node.querySelector(".bubble").textContent = text;
  els.chat.appendChild(node);
  scrollChat();
}

function appendAriaPlain(html) {
  const node = document.createElement("div");
  node.className = "msg aria";
  node.innerHTML = `<div class="bubble">${html}</div>`;
  els.chat.appendChild(node);
  scrollChat();
  return node;
}

function appendRouteBadge(agentName, reason) {
  const node = document.createElement("div");
  node.className = "route";
  node.innerHTML = `
    <span class="badge-dot ${agentColorClass(agentName)}">${agentInitial(agentName)}</span>
    <span class="agent-name">${agentName}</span>
    <span class="reason">· ${reason}</span>
  `;
  els.chat.appendChild(node);
  scrollChat();
}

function appendReasoningBlock(steps, tools) {
  const node = document.createElement("div");
  node.className = "reasoning";
  node.innerHTML = `
    <div class="reasoning-head"><span class="pulse"></span> Working on it</div>
    <div class="reasoning-steps">
      ${steps.map((s) => `
        <div class="reasoning-step"><span class="tick"></span><span class="step-label">${s}</span></div>
      `).join("")}
    </div>
    ${tools && tools.length
      ? `<div class="tools" hidden>${tools.map((t) =>
          `<span class="tool-chip">${t.icon} ${t.label}</span>`
        ).join("")}</div>`
      : ""}
  `;
  els.chat.appendChild(node);
  scrollChat();
  return node;
}

async function animateReasoning(node) {
  const stepEls = node.querySelectorAll(".reasoning-step");
  for (let i = 0; i < stepEls.length; i++) {
    const el = stepEls[i];
    el.classList.add("visible", "active");
    scrollChat();
    await delay(500 + Math.random() * 300);
    el.classList.remove("active");
    el.classList.add("done");
  }
  const head = node.querySelector(".reasoning-head");
  head.classList.add("done");
  head.innerHTML = `<span class="pulse"></span> Context ready`;

  const tools = node.querySelector(".tools");
  if (tools) {
    tools.hidden = false;
    tools.querySelectorAll(".tool-chip").forEach((c, i) => {
      c.style.animationDelay = `${i * 70}ms`;
    });
    scrollChat();
    await delay(tools.children.length * 80 + 200);
  }
}

function appendTypingIndicator() {
  const node = document.createElement("div");
  node.className = "typing";
  node.id = "typingIndicator";
  node.innerHTML = "<span></span><span></span><span></span>";
  els.chat.appendChild(node);
  scrollChat();
  return node;
}
function removeTypingIndicator() {
  const t = document.getElementById("typingIndicator");
  if (t) t.remove();
}

function streamHtmlIntoBubble(bubble, html, wordsPerTick = 4) {
  return new Promise((resolve) => {
    const tokens = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === "<") {
        const end = html.indexOf(">", i);
        if (end === -1) { tokens.push(html.slice(i)); break; }
        tokens.push(html.slice(i, end + 1));
        i = end + 1;
      } else {
        const next = html.indexOf("<", i);
        const chunk = next === -1 ? html.slice(i) : html.slice(i, next);
        chunk.split(/(\s+)/).forEach((p) => { if (p.length) tokens.push(p); });
        i = next === -1 ? html.length : next;
      }
    }
    let cursor = 0;
    const tick = () => {
      cursor = Math.min(tokens.length, cursor + wordsPerTick);
      bubble.innerHTML = tokens.slice(0, cursor).join("");
      scrollChat();
      if (cursor < tokens.length) setTimeout(tick, 22 + Math.random() * 25);
      else resolve();
    };
    tick();
  });
}

async function appendAriaStreamed(html) {
  const node = appendAriaPlain("");
  const bubble = node.querySelector(".bubble");
  await streamHtmlIntoBubble(bubble, html);
  return node;
}

function appendInlineOptions(options, onPick) {
  const wrap = document.createElement("div");
  wrap.className = "inline-options";
  options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "inline-option";
    btn.style.animationDelay = `${i * 60}ms`;
    btn.innerHTML = `<span>${opt.label}</span>
      <svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".inline-option").forEach((b) => { b.disabled = true; });
      onPick(opt);
    });
    wrap.appendChild(btn);
  });
  els.chat.appendChild(wrap);
  scrollChat();
}

// ────────────────────────────────────────────────────────────────────────
// Stage runner
// ────────────────────────────────────────────────────────────────────────
async function runStage(stageId) {
  // Sentinel · "View plan tracker" CTA opens Today with the active plan highlighted
  if (stageId === "__open-today-tracker__") {
    state.busy = false;
    openTodayWithActivePlan();
    return;
  }

  // Sentinel · "Back to deal room" CTA in the car-buying chat stages
  if (stageId === "__open-carbuy-deal__") {
    state.busy = false;
    openFeature("carbuy-deal-honda");
    return;
  }

  const stage = STAGES[stageId];
  if (!stage) return;
  if (state.busy) return;
  state.busy = true;

  // Activate matching plan if this stage represents a kicked-off execution
  if (typeof STAGE_TO_PLAN !== "undefined" && STAGE_TO_PLAN[stageId]) {
    const planKey = STAGE_TO_PLAN[stageId];
    const supersedes = PLAN_SUPERSEDES[planKey] || [];
    supersedes.forEach(k => state.activePlans.delete(k));
    state.activePlans.add(planKey);
  }

  if (stage.type === "clarify") {
    setAriaState("Thinking", true);
    const reasoning = appendReasoningBlock(stage.thinking || ["Listening"], stage.tools || []);
    await animateReasoning(reasoning);
    await delay(150);

    if (stage.agent && stage.routingReason) {
      appendRouteBadge(stage.agent, stage.routingReason);
      await delay(120);
    }

    setAriaState("Asking a follow-up", false);
    appendTypingIndicator();
    await delay(450);
    removeTypingIndicator();
    await appendAriaStreamed(stage.responseHtml);

    appendInlineOptions(stage.options || [], (opt) => {
      appendUserMessage(opt.label);
      setTimeout(() => runStage(opt.goTo), 200);
    });

    setAriaState("Listening", false);
    state.busy = false;
    return;
  }

  // FINAL stage
  setAriaState("Thinking", true);
  const reasoning = appendReasoningBlock(stage.thinking || [], stage.tools || []);
  await animateReasoning(reasoning);
  await delay(180);

  appendRouteBadge(stage.agent, stage.routingReason);
  await delay(160);

  setAriaState("Drafting reply", true);
  appendTypingIndicator();
  await delay(520);
  removeTypingIndicator();
  await appendAriaStreamed(stage.responseHtml);

  // Friction-reduced flow · auto-navigate to the Today tracker so the user
  // doesn't have to tap through an in-motion card + approval. The reasoning
  // trace + one-line ack in chat is enough storytelling; the tracker is the work.
  if (stage.autoOpenTracker) {
    state.completedStages.add(stageId);
    setAriaState("Listening", false);
    state.busy = false;
    await delay(1600);
    openTodayWithActivePlan();
    return;
  }

  if (stage.options && stage.options.length) {
    appendInlineOptions(stage.options, (opt) => {
      appendUserMessage(opt.label);
      setTimeout(async () => {
        // Sentinel · open Today with the active plan highlighted
        if (opt.goTo === "__open-today-tracker__") {
          openTodayWithActivePlan();
          return;
        }
        // Sentinel · open the Honda City deal-room feature
        if (opt.goTo === "__open-carbuy-deal__") {
          openFeature("carbuy-deal-honda");
          return;
        }
        // Distinct, real stage target → navigate (back-nav, branching, etc.)
        if (opt.goTo && opt.goTo !== stageId && STAGES[opt.goTo]) {
          runStage(opt.goTo);
          return;
        }
        // Self-loop or undefined target → generic action acknowledgement
        state.busy = true;
        setAriaState("Working", true);
        appendTypingIndicator();
        await delay(700);
        removeTypingIndicator();
        await appendAriaStreamed(
          `<p>On it — I'll keep you posted. You can flip back to your dashboard tabs anytime below.</p>`
        );
        setAriaState("Listening", false);
        state.busy = false;
      }, 200);
    });
  }

  // Mark as completed and surface adaptive next-best chips
  state.completedStages.add(stageId);
  renderNextBestChips(stageId);

  setAriaState("Listening", false);
  state.busy = false;
}

// Adaptive suggestion chips at the chat bottom — change with the flow
// the customer just finished.
function renderNextBestChips(stageId) {
  const suggestions = (typeof NEXT_BEST_SUGGESTIONS !== "undefined" && NEXT_BEST_SUGGESTIONS[stageId]) || [];
  if (!suggestions.length) {
    els.chipsWrap.hidden = true;
    els.chips.innerHTML = "";
    return;
  }
  els.chipsWrap.hidden = false;
  els.chips.innerHTML = "";
  suggestions.forEach((sug) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = sug.label;
    btn.addEventListener("click", () => {
      els.chipsWrap.hidden = true;
      els.chips.innerHTML = "";
      if (state.mode === "live" && state.liveReady) {
        runLiveTurn(sug.userMessage);
      } else {
        appendUserMessage(sug.userMessage);
        setTimeout(() => runStage(sug.goTo), 200);
      }
    });
    els.chips.appendChild(btn);
  });
}

// Deep-link from a personalised page block into a specific dialog stage
function goToChatStage(stageId) {
  els.chat.innerHTML = "";
  appendAriaPlain(persona().chatOpening);
  state.activeTab = "chat";
  showScreen("chat");
  setTimeout(() => runStage(stageId), 250);
}

// Start a fresh conversation from a category (hero-chip entry point)
function startFromCategory(cat) {
  // In live mode, treat the chip as the customer's first message.
  if (state.mode === "live" && state.liveReady) {
    runLiveTurn(cat.label);
    return;
  }
  els.chat.innerHTML = "";
  appendAriaPlain(persona().chatOpening);
  state.activeTab = "chat";
  showScreen("chat");
  setTimeout(() => runStage(cat.startStage), 250);
}

// ────────────────────────────────────────────────────────────────────────
// Free-text matching → start at the best stage
// ────────────────────────────────────────────────────────────────────────
function matchFreeText(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const cat of categories()) {
    const hits = (cat.triggers || []).filter((kw) => lower.includes(kw)).length;
    if (hits > bestScore) { best = { type: "category", cat }; bestScore = hits; }
  }
  for (const cat of categories()) {
    const startStage = STAGES[cat.startStage];
    if (!startStage || !startStage.options) continue;
    for (const opt of startStage.options) {
      const trigs = opt.triggers || [];
      const hits = trigs.filter((kw) => lower.includes(kw)).length;
      if (hits > bestScore) { best = { type: "jump", goTo: opt.goTo, cat, opt }; bestScore = hits; }
    }
  }
  return best;
}

async function runFallback() {
  state.busy = true;
  setAriaState("Thinking", true);
  const r = appendReasoningBlock(FALLBACK_STAGE.thinking, []);
  await animateReasoning(r);
  await delay(120);
  appendRouteBadge(FALLBACK_STAGE.agent, FALLBACK_STAGE.routingReason);
  await delay(120);
  appendTypingIndicator();
  await delay(450);
  removeTypingIndicator();
  await appendAriaStreamed(FALLBACK_STAGE.responseHtml);
  appendInlineOptions(
    categories().map((c) => ({ label: c.label, goTo: c.startStage })),
    (opt) => {
      appendUserMessage(opt.label);
      setTimeout(() => runStage(opt.goTo), 200);
    }
  );
  setAriaState("Listening", false);
  state.busy = false;
}

function handleFreeText(text) {
  if (!text.trim()) return;
  /* Remove the "Or browse" chip strip if it's still visible — the user
     has chosen to type free-text and doesn't need the alternative */
  const strip = document.querySelector(".browse-strip");
  if (strip) strip.remove();
  // Live mode: route to the real backend.
  if (state.mode === "live" && state.liveReady) {
    runLiveTurn(text);
    return;
  }
  // Scripted (offline) path
  if (state.screen !== "chat") {
    els.chat.innerHTML = "";
    appendAriaPlain(persona().chatOpening);
    state.activeTab = "chat";
    showScreen("chat");
  }
  appendUserMessage(text);
  const match = matchFreeText(text);
  if (match && match.type === "category") {
    setTimeout(() => runStage(match.cat.startStage), 250);
  } else if (match && match.type === "jump") {
    setTimeout(() => runStage(match.goTo), 250);
  } else {
    setTimeout(() => runFallback(), 250);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Classic view
// ────────────────────────────────────────────────────────────────────────
function renderClassic() {
  const c = classic();
  const p = persona();
  els.classicGreet.innerHTML = `Hello, <b>${p.name.split(" ")[0]}</b>. Here's your dashboard.`;

  els.accountCards.innerHTML = "";
  c.cards.forEach((card) => {
    const node = document.createElement("div");
    node.className = "acct-card";
    node.style.setProperty("--acct-grad", card.accent);
    node.innerHTML = `
      <div class="acct-type">${card.type}</div>
      <div class="acct-number">${card.number}</div>
      <div class="acct-balance">${card.balance}</div>
    `;
    els.accountCards.appendChild(node);
  });

  els.quickActions.innerHTML = "";
  c.quickActions.forEach((qa) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "qa-tile";
    node.innerHTML = `<span class="qa-icon">${renderIcon(qa.icon)}</span><span class="qa-label">${qa.label}</span>`;
    if (qa.id) node.addEventListener("click", () => openFeature(qa.id));
    els.quickActions.appendChild(node);
  });

  els.txList.innerHTML = "";
  c.transactions.forEach((tx) => {
    const node = document.createElement("div");
    node.className = "tx-row" + (tx.state ? ` ${tx.state}` : "");
    node.innerHTML = `
      <div class="tx-info">
        <div class="tx-merchant">${tx.merchant}</div>
        <div class="tx-date">${tx.date}</div>
      </div>
      <div class="tx-amount">${tx.amount}</div>
    `;
    els.txList.appendChild(node);
  });
}

// ────────────────────────────────────────────────────────────────────────
// Feature screens (quick-action destinations)
// ────────────────────────────────────────────────────────────────────────
function openFeature(featureId) {
  const data = (FEATURE_SCREENS[state.personaId] || {})[featureId];
  if (!data) return;
  renderFeature(data, featureId);
  showScreen("feature");
}

function renderFeature(data, featureId) {
  els.featureTitle.textContent = data.title || "";
  els.featureSubtitle.textContent = data.subtitle || "";
  els.featureScroll.innerHTML = "";
  (data.blocks || []).forEach((block) => {
    const node = renderFeatureBlock(block);
    if (node) els.featureScroll.appendChild(node);
  });
  if (data.primaryAction) {
    els.featureActionWrap.hidden = false;
    els.featureActionLabel.textContent = data.primaryAction.label || "Continue";
    els.featureActionSub.textContent = data.primaryAction.sub || "";
    /* Remember the action for the click handler */
    state.activeFeaturePrimary = data.primaryAction;
  } else {
    els.featureActionWrap.hidden = true;
    state.activeFeaturePrimary = null;
  }
  els.featureScroll.scrollTop = 0;
  state.activeFeature = featureId;
}

function renderFeatureBlock(block) {
  switch (block.type) {
    case "divider":      return f_divider(block);
    case "field":        return f_field(block);
    case "recipients":   return f_recipients(block);
    case "row":          return f_row(block);
    case "cardItem":     return f_card(block);
    case "summary":      return f_summary(block);
    case "note":         return f_note(block);
    case "text":         return f_text(block);
    case "chase":        return f_chase(block);
    case "rule-row":     return f_rule(block);
    // Car-workspace block types · reuse the generic renderers from renderBlock()
    case "buying-setup": return renderBlockBuyingSetup(block);
    case "chip-row":     return renderBlockChipRow(block);
    case "car-card":     return renderBlockCarCard(block);
    case "deal-summary": return renderBlockDealSummary(block);
    case "deal-actions": return renderBlockDealActions(block);
    default:             return null;
  }
}

function f_rule(b) {
  const n = document.createElement("div");
  const level = b.level || 1;
  n.className = `f-rule level-${level}` + (b.paused ? " paused" : "");
  const levelLabel = `L${level}`;
  const lastBit = b.lastFired ? `Last fired ${b.lastFired}` : "";
  const countBit = b.monthCount === 0
    ? "Not yet fired this month"
    : `${b.monthCount} time${b.monthCount === 1 ? "" : "s"} this month`;
  n.innerHTML = `
    <div class="f-rule-head">
      <span class="f-rule-level">${levelLabel}</span>
      <div class="f-rule-name">${b.name || ""}</div>
      <button type="button" class="f-rule-toggle" role="switch" aria-checked="${b.paused ? "false" : "true"}">
        <span class="f-rule-knob"></span>
      </button>
    </div>
    ${b.desc ? `<div class="f-rule-desc">${b.desc}</div>` : ""}
    <div class="f-rule-meta">
      <span>${lastBit}</span>
      ${lastBit && countBit ? `<span class="f-rule-dot">·</span>` : ""}
      <span>${countBit}</span>
      <span class="f-rule-spacer"></span>
      <button type="button" class="f-rule-audit">Audit log</button>
    </div>
  `;
  // Pause toggle — decorative
  const toggle = n.querySelector(".f-rule-toggle");
  toggle.addEventListener("click", () => {
    const paused = n.classList.toggle("paused");
    toggle.setAttribute("aria-checked", paused ? "false" : "true");
    showToast(paused
      ? `Paused · "${b.name}" won't fire until you re-enable it`
      : `Re-enabled · "${b.name}" is running again`);
  });
  // Audit log — decorative
  n.querySelector(".f-rule-audit").addEventListener("click", () => {
    showToast("Audit log is encrypted · shared with your relationship banker on request");
  });
  return n;
}

function f_chase(b) {
  const n = document.createElement("div");
  n.className = `f-chase tone-${b.tone || "gentle"}`;
  const amount = (b.amount_inr || 0).toLocaleString("en-IN");
  const toneLabel = { gentle: "Gentle", firm: "Firm", plan: "Payment plan" }[b.tone] || "Draft";
  n.innerHTML = `
    <div class="f-chase-head">
      <div class="f-chase-vendor">
        <div class="f-chase-vendor-name">${b.vendor || ""}</div>
        <div class="f-chase-vendor-meta">₹${amount} · ${b.days_overdue || 0} days overdue</div>
      </div>
      <span class="pill ${b.tone === "firm" ? "warn" : b.tone === "plan" ? "primary" : "ghost"}">${toneLabel}</span>
    </div>
    <div class="f-chase-draft">${b.draft || ""}</div>
    <div class="f-chase-actions">
      <button type="button" class="f-chase-btn primary">Send draft</button>
      <button type="button" class="f-chase-btn ghost">Edit</button>
    </div>
  `;
  // Decorative — flash a toast on Send
  n.querySelector(".f-chase-btn.primary").addEventListener("click", () => {
    showToast(`Sent · ${b.vendor} will see it within seconds`);
  });
  return n;
}

function f_divider(b) {
  const n = document.createElement("div");
  n.className = "f-divider";
  n.textContent = b.label || "";
  return n;
}
function f_field(b) {
  const n = document.createElement("div");
  n.className = "f-field" + (b.big ? " big" : "");
  n.innerHTML = `
    <div class="f-field-label">${b.label || ""}</div>
    <div class="f-field-row">
      ${b.prefix ? `<span class="f-field-prefix">${b.prefix}</span>` : ""}
      <input type="text" class="f-field-input" placeholder="${b.placeholder || ""}" />
      ${b.icon ? `<span class="f-field-icon">${b.icon}</span>` : ""}
    </div>
  `;
  return n;
}
function f_recipients(b) {
  const n = document.createElement("div");
  n.className = "f-recipients";
  (b.items || []).forEach((r) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "f-recipient" + (r.ghost ? " ghost" : "");
    btn.innerHTML = `
      <span class="f-recipient-avatar" style="--rec-grad:${r.colour || ""}">${r.initials || ""}</span>
      <span class="f-recipient-name">${r.name || ""}</span>
    `;
    n.appendChild(btn);
  });
  return n;
}
function f_row(b) {
  const n = document.createElement("div");
  n.className = "f-row" + (b.tone ? ` tone-${b.tone}` : "");
  n.innerHTML = `
    <div class="f-row-icon">${renderIcon(b.icon) || "•"}</div>
    <div class="f-row-body">
      <div class="f-row-title">${b.title || ""}</div>
      ${b.sub ? `<div class="f-row-sub">${b.sub}</div>` : ""}
    </div>
    ${b.pill ? `<span class="f-row-pill pill ${b.pill.tone || "ghost"}">${b.pill.text}</span>` : ""}
    ${b.chev ? `<svg class="f-row-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>` : ""}
  `;
  return n;
}
function f_card(b) {
  const n = document.createElement("div");
  n.className = "f-card";
  n.style.setProperty("--card-grad", b.tone || "");
  n.innerHTML = `
    <div class="f-card-name">${b.name || ""}</div>
    <div class="f-card-number">${b.number || ""}</div>
    <div class="f-card-rows">
      ${(b.rows || []).map((r) => `
        <div><span class="label">${r.label}</span><span class="value">${r.value}</span></div>
      `).join("")}
    </div>
    ${b.actions && b.actions.length
      ? `<div class="f-card-actions">${b.actions.map((a) => `<button type="button">${a}</button>`).join("")}</div>`
      : ""}
  `;
  return n;
}
function f_summary(b) {
  const n = document.createElement("div");
  n.className = "f-summary";
  n.innerHTML = `
    <div class="f-summary-label">${b.label || ""}</div>
    <div class="f-summary-value">${b.value || ""}</div>
    ${b.delta ? `<div class="f-summary-delta ${b.tone || "neutral"}">${b.delta}</div>` : ""}
  `;
  return n;
}
function f_note(b) {
  const n = document.createElement("div");
  n.className = "f-note";
  n.innerHTML = b.body || "";
  return n;
}
function f_text(b) {
  const n = document.createElement("div");
  n.className = "f-note";
  n.style.background = "transparent";
  n.style.borderLeft = "none";
  n.style.border = "none";
  n.style.padding = "4px 2px";
  n.style.color = "var(--text-mute)";
  n.innerHTML = b.body || "";
  return n;
}

// ────────────────────────────────────────────────────────────────────────
// Live mode — real Claude calls via the local FastAPI backend
// ────────────────────────────────────────────────────────────────────────
async function probeLiveBackend() {
  // Allow `?mode=scripted` to force scripted mode even when the server is up.
  try {
    const params = new URLSearchParams(location.search);
    if (params.get("mode") === "scripted") return;
  } catch (e) { /* ignore */ }

  try {
    const resp = await fetch(LIVE_HOST + "/api/health", { method: "GET" });
    if (!resp.ok) return;
    const data = await resp.json();
    if (data.ok && data.live_ready) {
      state.liveReady = true;
      state.mode = "live";
      setLiveIndicator(true);
      // Visible only to the presenter — a small green dot in the status bar.
      // The audience can't tell the difference from scripted mode.
    }
  } catch (e) {
    // Server isn't running — silently stay in Scripted mode.
  }
}

async function runLiveTurn(userText) {
  if (state.busy) return;
  state.busy = true;

  // Ensure we're on the chat screen
  if (state.screen !== "chat") {
    if (els.chat.innerHTML === "") {
      appendAriaPlain(persona().chatOpening);
    }
    state.activeTab = "chat";
    showScreen("chat");
  }

  appendUserMessage(userText);
  setAriaState("Thinking", true);

  // Set up the reasoning + tool block we'll progressively populate
  const reasoningNode = appendReasoningBlock([], []);
  const stepsContainer = reasoningNode.querySelector(".reasoning-steps");
  let routeBadgeShown = false;
  let bubble = null;

  const markActiveStepDone = () => {
    const a = stepsContainer.querySelector(".reasoning-step.active");
    if (a) { a.classList.remove("active"); a.classList.add("done"); }
  };
  const addStep = (label) => {
    markActiveStepDone();
    const step = document.createElement("div");
    step.className = "reasoning-step visible active";
    step.innerHTML = `<span class="tick"></span><span class="step-label">${label}</span>`;
    stepsContainer.appendChild(step);
    scrollChat();
  };
  const finishReasoning = () => {
    markActiveStepDone();
    const head = reasoningNode.querySelector(".reasoning-head");
    if (head) {
      head.classList.add("done");
      head.innerHTML = `<span class="pulse"></span> Context ready`;
    }
  };
  const addToolChip = (name) => {
    let toolsWrap = reasoningNode.querySelector(".tools");
    if (!toolsWrap) {
      toolsWrap = document.createElement("div");
      toolsWrap.className = "tools";
      reasoningNode.appendChild(toolsWrap);
    }
    const chip = document.createElement("span");
    chip.className = "tool-chip";
    const pretty = name.replace(/_/g, " ");
    chip.textContent = `🛠 ${pretty}`;
    toolsWrap.appendChild(chip);
    scrollChat();
  };
  const ensureBubble = () => {
    if (!bubble) {
      const node = appendAriaPlain("");
      bubble = node.querySelector(".bubble");
    }
    return bubble;
  };

  try {
    const resp = await fetch(LIVE_HOST + "/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        persona_id: state.personaId,
        message: userText,
        history: [],
      }),
    });
    if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events delimited by blank lines
      let blankIdx;
      while ((blankIdx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, blankIdx);
        buffer = buffer.slice(blankIdx + 2);
        if (!raw.trim()) continue;

        const lines = raw.split("\n");
        let evt = "message";
        let dataStr = "";
        for (const line of lines) {
          if (line.startsWith("event:")) evt = line.slice(6).trim();
          else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
        }
        let data = {};
        try { data = JSON.parse(dataStr || "{}"); } catch (e) {}

        if (evt === "reasoning") {
          addStep(data.step || "Thinking");
        } else if (evt === "route") {
          finishReasoning();
          appendRouteBadge(data.agent, data.reason || "routing");
          routeBadgeShown = true;
          setAriaState("Drafting reply", true);
        } else if (evt === "tool_call_start" || evt === "tool_call") {
          if (data.name) addToolChip(data.name);
        } else if (evt === "tool_result") {
          // No-op; the tool chip already represents the call. We could
          // surface the result in future, but the agent's reply will
          // typically narrate it.
        } else if (evt === "text") {
          const delta = data.delta || "";
          if (delta) ensureBubble().insertAdjacentHTML("beforeend", delta);
          scrollChat();
        } else if (evt === "error") {
          renderLiveError(data.message || "I had trouble reaching one of my tools.", userText);
        } else if (evt === "done") {
          // close out below
        }
      }
    }
  } catch (e) {
    finishReasoning();
    renderLiveError("I lost connection to the live agent. Try again — or fall back to scripted mode if the server isn't running.", userText);
  }

  if (!routeBadgeShown) finishReasoning();
  setAriaState("Listening", false);
  state.busy = false;
}

// ────────────────────────────────────────────────────────────────────────
// Wire-up
// ────────────────────────────────────────────────────────────────────────
els.personaSelect.addEventListener("change", (e) => {
  state.personaId = e.target.value;
  renderPersonaHeader();
  els.chat.innerHTML = "";
  els.chipsWrap.hidden = true;
  els.chips.innerHTML = "";
  state.completedStages = new Set();
  runIntro();
});

els.viewToggle.addEventListener("click", (e) => {
  const target = e.target.closest(".view-btn");
  if (!target) return;
  const view = target.dataset.view;
  if (view === "classic") {
    state.viewMode = "classic";
    renderClassic();
    showScreen("classic");
  } else if (state.screen === "classic" || state.screen === "feature") {
    // Back to Aria — land on hero (skip the intro animation on return)
    state.viewMode = "aria";
    renderHero();
    showScreen("hero");
  } else {
    state.viewMode = "aria";
  }
});

// Hero chip → start a conversation
// Hero quickbox → free-text into chat
els.heroQuickbox.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.heroInput.value.trim();
  if (!text) return;
  els.heroInput.value = "";
  handleFreeText(text);
});

els.heroSkip.addEventListener("click", () => selectTab("today"));

// Tap the big welcome-screen orb to open the chat directly.
// Triggered from the hero screen — sends the user into chat with Aria's
// opening line, no preset stage, ready for free input or a chip tap.
{
  const heroOrbEl = document.querySelector(".screen-hero .hero-orb");
  if (heroOrbEl) {
    heroOrbEl.setAttribute("role", "button");
    heroOrbEl.setAttribute("tabindex", "0");
    heroOrbEl.setAttribute("aria-label", "Open chat with Aria");
    const openChatFromOrb = () => selectTab("chat");
    heroOrbEl.addEventListener("click", openChatFromOrb);
    heroOrbEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openChatFromOrb(); }
    });
  }
}

// Feature-screen primary action · routes to a stage if specified,
// opens a feature, or shows a confirmation toast tailored to the action.
els.featureAction.addEventListener("click", () => {
  const p = state.activeFeaturePrimary;
  if (!p) return;
  if (p.openStage) {
    selectTab("chat");
    runStage(p.openStage);
    return;
  }
  if (p.openFeature) {
    openFeature(p.openFeature);
    return;
  }
  /* Default · graceful acknowledgement toast */
  const label = (p.label || "Action").toLowerCase();
  let msg = "Done · " + (p.sub || p.label || "");
  if (label.includes("generate") && label.includes("statement")) {
    msg = "Statement queued · delivered to your registered email · audit ref STMT-" + Math.floor(Math.random()*9000+1000);
  } else if (label.includes("email")) {
    msg = "Email queued · check your inbox in a minute";
  } else if (label.includes("review and pay") || label.includes("pay")) {
    msg = "Routed for review · Aadhaar OTP sent to your registered mobile";
  } else if (label.includes("issue") || label.includes("new sub-card")) {
    msg = "Sub-card request sent · KYC + employment proof checklist queued";
  } else if (label.includes("send all")) {
    msg = "Sent · each thread audit-logged · BCC to ar@";
  } else if (label.includes("start a new sip") || label.includes("sip")) {
    msg = "SIP setup queued · KFS appears before the first auto-debit";
  } else if (label.includes("run payroll") || label.includes("payroll")) {
    msg = "Payroll batch staged · 1-tap release after Aadhaar OTP";
  }
  showToast(msg);
});

// Tabbar
els.tabbar.addEventListener("click", (e) => {
  const target = e.target.closest(".tab-item");
  if (!target) return;
  const tab = target.dataset.tab;
  selectTab(tab);
});

// ────────────────────────────────────────────────────────────────────────
// Classic-mode bottom nav · maps each tab to a feature screen per persona
// Home returns to the Classic dashboard; the others openFeature().
// ────────────────────────────────────────────────────────────────────────
const CLASSIC_NAV_TABS = [
  { tab: "home",   icon: "home",     label: "Home"   },
  { tab: "pay",    icon: "send",     label: "Pay"    },
  { tab: "cards",  icon: "card",     label: "Cards"  },
  { tab: "invest", icon: "chart",    label: "Invest" },
  { tab: "more",   icon: "grid",     label: "More"   },
];
const CLASSIC_TAB_TARGETS = {
  priya: { home: null, pay: "pay-vendor", cards: "cards", invest: "statements",  more: "more" },
  arjun: { home: null, pay: "send-money", cards: "cards", invest: "investments", more: "more" },
};
function renderClassicNav() {
  const wrap = document.getElementById("classicNav");
  if (!wrap) return;
  wrap.innerHTML = CLASSIC_NAV_TABS.map(t => `
    <button type="button" class="nav-item${t.tab === "home" ? " active" : ""}" data-classic-tab="${t.tab}">
      ${iconSvg(t.icon)}<span>${t.label}</span>
    </button>`).join("");
}
renderClassicNav();
document.getElementById("classicNav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-item");
  if (!btn) return;
  const tab = btn.dataset.classicTab;
  const target = (CLASSIC_TAB_TARGETS[state.personaId] || {})[tab];
  document.querySelectorAll("#classicNav .nav-item")
    .forEach(b => b.classList.toggle("active", b === btn));
  if (tab === "home" || !target) {
    renderClassic();
    showScreen("classic");
  } else {
    openFeature(target);
  }
});

// Chat composer
els.composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = els.composerInput.value.trim();
  if (!text || state.busy) return;
  els.composerInput.value = "";
  appendUserMessage(text);
  const match = matchFreeText(text);
  if (match && match.type === "category") {
    setTimeout(() => runStage(match.cat.startStage), 200);
  } else if (match && match.type === "jump") {
    setTimeout(() => runStage(match.goTo), 200);
  } else {
    setTimeout(() => runFallback(), 200);
  }
});

// Classic FAB → back to Aria (hero)
els.ariaFab.addEventListener("click", () => {
  renderHero();
  showScreen("hero");
});

// Feature screen back → respect current view mode (Aria's Today or Classic widgets)
els.featureBack.addEventListener("click", () => {
  if (state.viewMode === "classic") {
    renderClassic();
    showScreen("classic");
  } else {
    selectTab("today");
  }
});

// Feature screen "Ask Aria" pill → hero (Aria mode)
els.featureFab.addEventListener("click", () => {
  renderHero();
  showScreen("hero");
});

// Mic — opens a voice overlay with waveform + transcription.
// Cancellable. On natural completion, the transcribed text is sent
// through the normal chat path (which goes Live if the backend is up).
let voiceTimers = [];
let voiceCycleIndex = 0;
function clearVoiceTimers() { voiceTimers.forEach(clearTimeout); voiceTimers = []; }

els.micBtn.addEventListener("click", () => {
  if (state.busy) return;
  // Pick the next transcription for this persona, cycling
  const bank = VOICE_TRANSCRIPTIONS[state.personaId] || [];
  if (!bank.length) return;
  const text = bank[voiceCycleIndex % bank.length];
  voiceCycleIndex++;

  // Show overlay
  els.voiceTranscription.hidden = true;
  els.voiceTranscription.textContent = "";
  els.voiceWaveform.hidden = false;
  els.voiceState.textContent = "Listening";
  els.voiceOverlay.hidden = false;
  els.voiceOverlay.classList.add("active");
  setAriaState("Listening (voice)", true);

  // Phase 1 — waveform for ~1.4s
  voiceTimers.push(setTimeout(() => {
    els.voiceState.textContent = "I heard";
    els.voiceTranscription.textContent = `"${text}"`;
    els.voiceTranscription.hidden = false;
    els.voiceWaveform.hidden = true;
  }, 1400));

  // Phase 2 — close + submit at ~2.0s
  voiceTimers.push(setTimeout(() => {
    els.voiceOverlay.classList.remove("active");
    voiceTimers.push(setTimeout(() => { els.voiceOverlay.hidden = true; }, 250));
    setAriaState("Listening", false);
    handleFreeText(text);
  }, 2000));
});

els.voiceCancel.addEventListener("click", () => {
  clearVoiceTimers();
  els.voiceOverlay.classList.remove("active");
  setTimeout(() => { els.voiceOverlay.hidden = true; }, 250);
  setAriaState("Listening", false);
});

// ─── Initial boot ───────────────────────────────────────────────────────
renderPersonaHeader();
runIntro();
probeLiveBackend();
