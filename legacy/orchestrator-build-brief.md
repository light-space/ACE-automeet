# Process-Magic Orchestrator — Build Brief

> Drop this file into an empty repo, open Claude Code in that directory, and say
> **"Read orchestrator-build-brief.md and build Phase 1."**
> This document is the plan; Claude Code is where the code gets written, run, and iterated.

---

## 0. Before you write any code

The SDK API surface drifts. **Verify every SDK call in this brief against the current docs before relying on it** — start at the Agent SDK reference (https://docs.claude.com → Agent SDK, and the Python reference). The snippets here are a faithful starting point captured recently, but treat the live docs as the source of truth for exact function/argument names and the current model identifier string.

Language: **Python** (3.10+). Swap to TypeScript only if it needs to share a stack with Sunrise.

---

## 1. What we're building

A live process-transformation pipeline for client workshops. In one meeting:

1. The client describes how a process works today (recorded in Granola).
2. We cut the recording at the end of the process discussion and **press a button**.
3. An orchestrator agent turns the transcript into an **as-is process map**, then a proposed **to-be process**, then a **clickable demo** of the to-be — each appearing during the later part of the same meeting for the "wow."
4. The client engages with the demo; their feedback triggers a **second run** that produces the final outputs: an action list (single owner each), the to-be deck, and implementation specs fed to Claude Code to ship changes into Sunrise.

The magic is the turnaround: messy conversation in, polished artifacts back within the same session.

### MVP scope for this build

Runnable orchestrator **skeleton** with all stations structured, but only the first link working end to end: **button → pull transcript → as-is map (live canvas + pptx)**. Everything downstream is stubbed and filled in later phases. Prove the riskiest assumption first — that a real transcript yields a map the client recognizes.

---

## 2. Architecture in one picture

```
        [ BUTTON ]  ← facilitator presses after cutting the Granola note
            │
            ▼
   ┌──────────────────┐
   │   ORCHESTRATOR    │  (Agent SDK main loop — the "engine")
   │   agent           │
   └──────────────────┘
      │  calls stations in sequence (this IS the event chain — free from the loop)
      │
      ├─▶ pull_transcript      (tool)      Granola API, poll until ready
      ├─▶ asis_mapper          (subagent)  transcript → structured process model
      ├─▶ render_asis          (tool)      model → live Mermaid canvas + .pptx
      │        ⏸ CHECKPOINT: facilitator confirms the map before proceeding
      ├─▶ tobe_designer        (subagent)  as-is + knowledge base → to-be + pain points
      │        ⏸ CHECKPOINT
      └─▶ demo_builder         (subagent)  to-be spec → clickable HTML prototype
               ⏸ CHECKPOINT before it's shown to the client

   ── later, second beat ──
        [ FEEDBACK SUBMITTED ] ← client clicks "submit feedback" on the demo
            │
            ▼
   ┌──────────────────┐
   │  ORCHESTRATOR     │  (resumes session)
   │  (run 2)          │
   └──────────────────┘
      ├─▶ spec_writer          (subagent)  to-be + feedback → implementation specs
      ├─▶ build action list    (tool)      owners assigned
      ├─▶ render to-be deck     (tool)      final .pptx
      └─▶ ship_to_sunrise      (tool)      hand specs to Claude Code
```

Two kinds of "trigger", kept separate:

- **External trigger (ignition):** the button (run 1) and the feedback submission (run 2). The SDK does *not* provide these — they're a thin layer you build around the agent.
- **Internal chaining (station → station):** the agent loop. Free. You don't build trigger plumbing for this.
- **Checkpoints:** the loop pauses for facilitator approval between stations, so nothing reaches the client unseen.

---

## 3. The trigger layer (thin — ~100 lines)

### Button kickoff (run 1)

A minimal entrypoint on the presenter's laptop — a CLI command or a one-button local web page. On press:

1. Fetch the just-cut note from Granola (`include=transcript`), retrying for a few seconds until Granola has finished processing it (the API only returns a note once its summary + transcript exist — no webhooks, so a short post-press poll is expected).
2. Start a fresh orchestrator run with that transcript, capturing the `session_id` for the second beat.
3. Stream progress to the screen (the as-is canvas is the live-materialization surface).

> Future upgrade: run your own streaming transcription alongside Granola. Then the transcript is in hand the instant you press, and the short Granola poll disappears.

### Feedback hook (run 2)

The clickable demo page has a "submit feedback" button that POSTs the client's notes to a small endpoint. That POST is the second ignition — it **resumes the same session** (`resume=session_id`) and runs the downstream stations.

---

## 4. Station specs

| Station | Type | Input | Output | Notes |
|---|---|---|---|---|
| `pull_transcript` | tool | note id (optional) | transcript text | Granola API, poll-until-ready |
| `asis_mapper` | subagent | transcript | structured process model (JSON: steps, actors, handoffs, pain points) | reasoning only; no side effects |
| `render_asis` | tool | process model | live Mermaid diagram + `.pptx` | deterministic rendering, not the LLM |
| `tobe_designer` | subagent | as-is model + knowledge base | to-be model + diagnosed pain points + improvements | reads KB files |
| `render_tobe` | tool | to-be model | `.pptx` | leave-behind deck |
| `demo_builder` | subagent | to-be spec | clickable HTML/React prototype | writes the prototype files |
| `spec_writer` | subagent | validated to-be + client feedback | implementation specs | input to Claude Code |
| `build_action_list` | tool | to-be + feedback | action list, one owner each | |
| `ship_to_sunrise` | tool | specs | changes/new agent in Sunrise | hands off to Claude Code |

Design principle: **reasoning → subagents, side effects (rendering, API calls, file writes) → tools.** Keeps each unit focused and testable.

---

## 5. The knowledge base (the actual moat)

This is what makes the to-be *your firm's* advice instead of generic best practice. Start simple:

- A `knowledge_base/` folder of markdown files — playbooks, past-engagement patterns, common pain points and fixes.
- `tobe_designer` gets `Read` access and pulls what's relevant.
- Graduate to a vector store (pgvector / Pinecone) only when the volume makes flat-file retrieval unreliable. Most engagements never need more than a well-organized folder.

Invest here. The pipeline is packaging; this is the product.

---

## 6. SDK reference (Python — verify against live docs)

Install & auth:

```bash
pip install claude-agent-sdk   # Python 3.10+
# export ANTHROPIC_API_KEY=...
```

Custom tools + an in-process MCP server:

```python
from claude_agent_sdk import tool, create_sdk_mcp_server

@tool("pull_transcript", "Fetch a finished Granola note transcript", {"note_id": str})
async def pull_transcript(args):
    text = await granola_fetch_with_retry(args.get("note_id"))
    return {"content": [{"type": "text", "text": text}]}

@tool("render_asis", "Render a process model to a Mermaid canvas and a pptx", {"model_json": str})
async def render_asis(args):
    paths = render_process_map(args["model_json"])   # your deterministic renderer
    return {"content": [{"type": "text", "text": f"Rendered: {paths}"}]}

pipeline_tools = create_sdk_mcp_server(
    name="pipeline", version="1.0.0",
    tools=[pull_transcript, render_asis],  # + the rest
)
```

Subagents (reasoning stations):

```python
from claude_agent_sdk import AgentDefinition

agents = {
    "asis_mapper": AgentDefinition(
        description="Turn a meeting transcript into a structured as-is process model",
        prompt="You extract the real current-state process — steps, actors, handoffs, "
               "and pain points — strictly from what was said. Do not invent steps.",
        tools=[],            # pure reasoning
        model="opus",
    ),
    "tobe_designer": AgentDefinition(
        description="Propose an improved to-be process from the as-is + knowledge base",
        prompt="Diagnose pain points and design a better process, grounded in the "
               "firm's playbooks in knowledge_base/.",
        tools=["Read"],
    ),
    "demo_builder": AgentDefinition(
        description="Build a clickable HTML prototype of the to-be process",
        prompt="Produce a self-contained, clickable prototype of the proposed process.",
        tools=["Read", "Write"],
    ),
}
```

Orchestrator loop + human checkpoints:

```python
import asyncio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from claude_agent_sdk.types import PermissionResultAllow, PermissionResultDeny

CHECKPOINT_TOOLS = {"mcp__pipeline__render_asis", "mcp__pipeline__ship_to_sunrise"}

async def facilitator_gate(tool_name, input_data, context):
    # Pause for approval before client-facing / irreversible steps.
    if tool_name in CHECKPOINT_TOOLS:
        approved = await ask_facilitator(tool_name, input_data)  # your UI/CLI prompt
        if not approved:
            return PermissionResultDeny(message="Facilitator held this step.")
    return PermissionResultAllow(updated_input=input_data)

async def run_engagement(transcript_note_id: str):
    options = ClaudeAgentOptions(
        system_prompt=ORCHESTRATOR_SYSTEM_PROMPT,
        mcp_servers={"pipeline": pipeline_tools},
        agents=agents,
        allowed_tools=[
            "mcp__pipeline__pull_transcript",
            "mcp__pipeline__render_asis",
            "Agent", "Read", "Write",
        ],
        permission_mode="default",
        can_use_tool=facilitator_gate,
        model="<current-model-id>",   # set from live docs
    )
    async with ClaudeSDKClient(options=options) as client:
        await client.query(f"Run the engagement for Granola note {transcript_note_id}.")
        session_id = None
        async for message in client.receive_response():
            session_id = capture_session_id(message) or session_id
            stream_to_screen(message)
        return session_id   # keep for the feedback beat (resume=session_id)

# asyncio.run(run_engagement("<note-id>"))
```

Key patterns to confirm in docs: `permission_mode` values, the `can_use_tool` callback signature and return types, `AgentDefinition` fields, `resume=`/`fork_session=` for the second beat, and session persistence adapters (Redis/Postgres/S3) if you host it.

---

## 7. Suggested repo structure

```
.
├── orchestrator-build-brief.md      ← this file
├── orchestrator/
│   ├── __init__.py
│   ├── run.py                # run_engagement() — the main loop
│   ├── system_prompts.py     # ORCHESTRATOR_SYSTEM_PROMPT + subagent prompts
│   ├── agents.py             # AgentDefinition set
│   ├── tools/
│   │   ├── granola.py        # pull_transcript + poll-until-ready
│   │   ├── render.py         # render_asis / render_tobe (Mermaid + python-pptx)
│   │   ├── outputs.py        # action list, specs
│   │   └── sunrise.py        # ship_to_sunrise (Claude Code hand-off)
│   └── checkpoints.py        # facilitator_gate
├── trigger/
│   ├── button.py             # run-1 kickoff (CLI or one-button web page)
│   └── feedback.py           # run-2 feedback endpoint
├── knowledge_base/           # markdown playbooks (the moat)
├── prototypes/               # demo_builder output lands here
├── outputs/                  # decks, action lists, specs
├── .env.example              # ANTHROPIC_API_KEY, GRANOLA_API_KEY
└── requirements.txt
```

---

## 8. Build order

**Phase 1 (this build):** repo skeleton + `pull_transcript` + `asis_mapper` + `render_asis`, wired into the orchestrator, kicked off by the button. Success = press button → real transcript → a process map on screen and a `.pptx`, good enough that a client would say "yes, that's how it works."

**Phase 2:** `tobe_designer` + the knowledge_base folder + checkpoints. Success = a defensible to-be that reflects the firm's playbooks.

**Phase 3:** `demo_builder` → clickable prototype from the to-be spec.

**Phase 4:** the feedback beat — `feedback.py` endpoint → resume session → `spec_writer`, action list, to-be deck, `ship_to_sunrise`.

**Phase 5 (productionize):** session persistence, hosting, job queue for concurrent engagements, optional own-STT for zero-lag triggers.

---

## 9. Open decisions / TODO

- [ ] Confirm language (Python assumed). Swap if Sunrise is TS.
- [ ] Granola API access + auth token; confirm the exact note-retrieval endpoint and processing latency (measure it before trusting the in-meeting timing).
- [ ] Current model identifier string (set from live docs).
- [ ] Choose the live-canvas renderer: Mermaid (fastest) vs React Flow/D3 (custom animation).
- [ ] What "ship to Sunrise" concretely means — repo, PR, or a new agent definition.
- [ ] Seed the knowledge_base with 3–5 real playbooks before Phase 2.
- [ ] Decide the button's form factor: CLI vs one-button local web page.

---

## 10. Guardrails carried over from the design conversation

- **Don't auto-run blind.** Keep the checkpoints; the meeting's back-half buffer is your window to catch a bad map before the client sees it.
- **As-is is the safe live centerpiece** — if it's slightly wrong the client corrects it in the room, and that participation *is* the wow. The demo is the artifact you least want to show unseen, so it always sits behind a checkpoint.
- **The transcript must be the ground truth** — the as-is mapper is instructed never to invent steps. A plausible-but-wrong map is the main failure mode.
- **Two beats, not one continuous auto-run:** button → run 1 (as-is, to-be, demo); feedback → run 2 (specs, actions, ship).
