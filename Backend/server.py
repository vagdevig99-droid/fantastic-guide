"""FastAPI server that powers the Live-agent mode.

Endpoints
─────────
GET  /api/health       → 200 OK with config status (does the server have a key?)
POST /api/chat/stream  → Server-Sent Events stream of an agent turn:
                            event: reasoning   data: {"step": "..."}
                            event: route       data: {"agent": "...", "reason": "..."}
                            event: tool_call   data: {"name": "...", "input": {...}}
                            event: tool_result data: {"name": "...", "result": {...}}
                            event: text        data: {"delta": "..."}
                            event: done        data: {}

The server also serves the static files (index.html, styles.css, app.js,
scenarios.js) so the page can be opened at http://localhost:8000/.

Run:
    pip install -r requirements.txt
    cp .env.example .env   # then add your ANTHROPIC_API_KEY
    python server.py
"""

import asyncio
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import anthropic

from data import get_persona
from agents import FRONTDOOR_SYSTEM, AGENT_PROMPTS
from tools import tools_for_agent, call_tool

# ─────────────────────────────────────────────────────────────────────────
# Boot
# ─────────────────────────────────────────────────────────────────────────
load_dotenv()
API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()
MODEL = os.getenv("MODEL", "claude-haiku-4-5-20251001").strip() or "claude-haiku-4-5-20251001"
PORT = int(os.getenv("PORT", "8000"))

client = anthropic.Anthropic(api_key=API_KEY) if API_KEY else None

app = FastAPI(title="Aria · live agent backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────
# Static files — serve the demo-app folder so http://localhost:8000/
# opens the same UI as double-clicking index.html.
# ─────────────────────────────────────────────────────────────────────────
DEMO_APP_DIR = Path(__file__).resolve().parent.parent
app.mount("/static", StaticFiles(directory=str(DEMO_APP_DIR)), name="static")


@app.get("/")
async def root():
    """Serve index.html as the root page."""
    index = DEMO_APP_DIR / "index.html"
    if not index.exists():
        return JSONResponse({"error": "index.html missing"}, status_code=500)
    return StreamingResponse(_file_iter(index), media_type="text/html")


@app.get("/styles.css")
async def css():
    return StreamingResponse(_file_iter(DEMO_APP_DIR / "styles.css"), media_type="text/css")


@app.get("/app.js")
async def js_app():
    return StreamingResponse(_file_iter(DEMO_APP_DIR / "app.js"), media_type="application/javascript")


@app.get("/scenarios.js")
async def js_scen():
    return StreamingResponse(_file_iter(DEMO_APP_DIR / "scenarios.js"), media_type="application/javascript")


def _file_iter(path: Path, chunk: int = 65536):
    with open(path, "rb") as f:
        while True:
            data = f.read(chunk)
            if not data:
                break
            yield data


# ─────────────────────────────────────────────────────────────────────────
# Health
# ─────────────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "ok": True,
        "live_ready": bool(client),
        "model": MODEL if client else None,
        "key_configured": bool(API_KEY),
    }


# ─────────────────────────────────────────────────────────────────────────
# Chat stream
# ─────────────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    persona_id: str
    message: str
    history: list = []   # optional list of {role:"user|assistant", content:"..."}


def _sse(event: str, data: dict) -> bytes:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode("utf-8")


def _persona_context_block(persona_id: str) -> str:
    p = get_persona(persona_id)
    if not p:
        return "Unknown persona."
    return (
        f"Customer profile:\n"
        f"- Name: {p.get('name')}\n"
        f"- Background: {p.get('profile')}\n\n"
        f"Use tools to look up specific numbers (balances, transactions, offers, etc.) before quoting them."
    )


async def _classify_intent(message: str, persona_id: str) -> dict:
    """Use a small Claude call to decide which specialist to hand off to."""
    if not client:
        return {"agent": "general", "reason": "no key configured"}
    persona = get_persona(persona_id)
    user_block = (
        f"Customer ({persona.get('name', persona_id)}): \"{message}\"\n\n"
        f"Profile: {persona.get('profile', '')}"
    )
    resp = await asyncio.to_thread(
        client.messages.create,
        model=MODEL,
        max_tokens=120,
        system=FRONTDOOR_SYSTEM,
        messages=[{"role": "user", "content": user_block}],
    )
    text = "".join(b.text for b in resp.content if hasattr(b, "text")).strip()
    # Extract the first JSON object on a line
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            parsed = json.loads(match.group(0))
            agent = parsed.get("agent", "general")
            if agent not in AGENT_PROMPTS:
                agent = "general"
            return {"agent": agent, "reason": parsed.get("reason", "routing")}
        except json.JSONDecodeError:
            pass
    return {"agent": "general", "reason": "could not classify"}


def _run_specialist_stream(agent: str, persona_id: str, message: str, history: list):
    """Run the specialist agent with a tool-use loop. Synchronous generator
    that yields SSE bytes."""
    system_prompt, agent_label = AGENT_PROMPTS[agent]
    full_system = system_prompt + "\n\n" + _persona_context_block(persona_id)
    tools_list = tools_for_agent(agent)

    # Build messages from history + this user turn
    msgs = []
    for h in (history or []):
        if h.get("role") in ("user", "assistant") and h.get("content"):
            msgs.append({"role": h["role"], "content": h["content"]})
    msgs.append({"role": "user", "content": message})

    # Tool-use loop. Max 4 cycles to be safe.
    for _cycle in range(4):
        # Stream this turn
        text_buffer = ""
        tool_uses = []
        with client.messages.stream(
            model=MODEL,
            max_tokens=2048,
            system=full_system,
            tools=tools_list,
            messages=msgs,
        ) as stream:
            for event in stream:
                etype = getattr(event, "type", None)
                if etype == "content_block_start":
                    cb = getattr(event, "content_block", None)
                    if cb and getattr(cb, "type", None) == "tool_use":
                        tool_uses.append({
                            "id": cb.id,
                            "name": cb.name,
                            "input": "",   # accumulate JSON below
                            "_input_obj": None,
                        })
                        yield _sse("tool_call_start", {"name": cb.name})
                elif etype == "content_block_delta":
                    delta = getattr(event, "delta", None)
                    dtype = getattr(delta, "type", None)
                    if dtype == "text_delta":
                        chunk = getattr(delta, "text", "") or ""
                        if chunk:
                            text_buffer += chunk
                            yield _sse("text", {"delta": chunk})
                    elif dtype == "input_json_delta":
                        if tool_uses:
                            tool_uses[-1]["input"] += getattr(delta, "partial_json", "") or ""
                elif etype == "content_block_stop":
                    if tool_uses and tool_uses[-1].get("_input_obj") is None:
                        raw = tool_uses[-1]["input"] or "{}"
                        try:
                            tool_uses[-1]["_input_obj"] = json.loads(raw) if raw.strip() else {}
                        except json.JSONDecodeError:
                            tool_uses[-1]["_input_obj"] = {}

            final_msg = stream.get_final_message()

        # If we got tool_use blocks, execute them and feed results back
        if final_msg.stop_reason == "tool_use" and tool_uses:
            # Append the assistant message (with tool_use blocks) to msgs
            msgs.append({"role": "assistant", "content": final_msg.content})
            tool_results_content = []
            for tu in tool_uses:
                args = tu.get("_input_obj") or {}
                yield _sse("tool_call", {"name": tu["name"], "input": args})
                result = call_tool(tu["name"], persona_id, **args)
                yield _sse("tool_result", {"name": tu["name"], "result": result})
                tool_results_content.append({
                    "type": "tool_result",
                    "tool_use_id": tu["id"],
                    "content": json.dumps(result, ensure_ascii=False),
                })
            msgs.append({"role": "user", "content": tool_results_content})
            # Continue the loop — let the model generate the final reply.
            continue
        # No more tool calls — we're done.
        break


@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest, request: Request):
    if not client:
        async def fail():
            yield _sse("error", {"message": "Server has no ANTHROPIC_API_KEY configured. Copy .env.example to .env and add your key."})
            yield _sse("done", {})
        return StreamingResponse(fail(), media_type="text/event-stream")

    async def event_stream():
        # 1. Reasoning hint
        yield _sse("reasoning", {"step": "Reading your message"})
        await asyncio.sleep(0.05)

        # 2. Classify intent
        try:
            yield _sse("reasoning", {"step": "Choosing the right specialist"})
            route = await _classify_intent(req.message, req.persona_id)
        except Exception as e:
            yield _sse("error", {"message": f"Routing failed: {e}"})
            yield _sse("done", {})
            return

        agent = route["agent"]
        _, agent_label = AGENT_PROMPTS[agent]
        yield _sse("route", {"agent": agent_label, "reason": route["reason"], "agent_key": agent})
        await asyncio.sleep(0.05)
        yield _sse("reasoning", {"step": f"Working with {agent_label}"})

        # 3. Run specialist
        try:
            for chunk in await asyncio.to_thread(
                lambda: list(_run_specialist_stream(agent, req.persona_id, req.message, req.history))
            ):
                yield chunk
                await asyncio.sleep(0)
        except Exception as e:
            yield _sse("error", {"message": f"Specialist failed: {e}"})

        yield _sse("done", {})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ─────────────────────────────────────────────────────────────────────────
# Entrypoint
# ─────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    print("─" * 60)
    print(" Aria · live agent backend")
    print("─" * 60)
    print(f" Key configured : {'yes' if API_KEY else 'NO — paste it into .env'}")
    print(f" Model          : {MODEL}")
    print(f" UI             : http://localhost:{PORT}/")
    print(f" Health         : http://localhost:{PORT}/api/health")
    print("─" * 60)
    uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="info")
