# Process-Magic Orchestrator — Phase 1 Design

Date: 2026-07-13
Source brief: `orchestrator-build-brief.md`
Scope: Phase 1 only. Later phases stubbed, structured, not built.

## 1. Goal

Prove the riskiest assumption: a real, messy meeting transcript yields an as-is
process map the client recognizes as correct.

Success test: press the button → a real transcript file → an as-is process map
renders live on screen, good enough that a client would say "yes, that's how it
works." No pptx in Phase 1.

## 2. Scope

In scope (the one working link, end to end):

- Button web page (run-1 kickoff).
- `pull_transcript` tool — Phase 1 reads a `.txt` from `transcript_in/`; Granola
  poll-until-ready sits behind the same interface as a stubbed adapter.
- `asis_mapper` subagent — transcript → structured process model (JSON).
- `render_asis` tool — process model → Mermaid flowchart text.
- Live Mermaid canvas in the browser page.
- Orchestrator loop wiring all of the above via the Agent SDK.

Out of scope (Phase 1) — scaffolded but not implemented:

- pptx / any deck output (explicitly cut).
- `tobe_designer`, `demo_builder`, `spec_writer`, `build_action_list`,
  `ship_to_sunrise`.
- `knowledge_base/` retrieval.
- Facilitator checkpoints as active gates (wiring present, gate set empty in P1).
- Feedback beat / session resume (run 2).
- Real Granola API calls.

## 3. Decisions (locked)

| Decision | Choice | Why |
|---|---|---|
| Language | Python 3.10+ | Brief default; SDK first-class. |
| Button form factor | One-button local web page (FastAPI) | Same surface shows the live canvas; best room feel. |
| Renderer | Mermaid (live HTML canvas) | Fastest; alive on screen; brief default. |
| Leave-behind (pptx) | **Removed from Phase 1** | Low ROI before the map is validated. Revisit later. |
| Model (asis_mapper) | `claude-opus-4-8` | Best reasoning for faithful extraction. Verify id against live docs at build time. |
| Transcript input (P1) | Latest `.txt` in `transcript_in/` | Simplest real input; adapter interface hides it. |
| Canvas transport | Server holds state; page short-polls `/state` | Simplest; SSE/stream is a later upgrade. |

## 4. Architecture

```
web page [BUTTON] --POST /run--> trigger/button.py
    orchestrator.run.run_engagement()
        |-- pull_transcript   (tool)     transcript_in/*.txt -> transcript text
        |-- asis_mapper       (subagent) transcript -> process model JSON
        |-- render_asis       (tool)     model JSON -> Mermaid string -> server state
web page --GET /state (poll)--> Mermaid string --> mermaid.js renders live
```

Design principle carried from the brief: **reasoning to subagents, side effects
(API calls, rendering, file writes) to tools.** Each unit does one thing and is
testable alone.

### Trigger layer (thin)

- `trigger/button.py` — FastAPI app. Serves `web/index.html`, exposes
  `POST /run` (kick off an engagement) and `GET /state` (current Mermaid + status
  for the canvas to poll). Captures `session_id` from the run for the later
  feedback beat (stored, unused in P1).

### Orchestrator

- `orchestrator/run.py` — `run_engagement(...)`. Builds `ClaudeAgentOptions`
  (system prompt, in-process MCP server, agents, allowed tools, `can_use_tool`
  gate, model), drives `ClaudeSDKClient`, streams messages to server state.
- `orchestrator/agents.py` — `AgentDefinition` set. P1: `asis_mapper` real;
  `tobe_designer`, `demo_builder` defined as structure with prompts, unreferenced
  by the P1 allowed-tools path.
- `orchestrator/system_prompts.py` — `ORCHESTRATOR_SYSTEM_PROMPT` + subagent
  prompts. Orchestrator instructed to run exactly: pull_transcript → asis_mapper
  → render_asis, then stop.
- `orchestrator/checkpoints.py` — `facilitator_gate(tool_name, input, ctx)`.
  Wired into options via `can_use_tool`. `CHECKPOINT_TOOLS` empty in P1 so the
  single link runs clean; Phase 2 populates it.

### Tools (side effects)

- `orchestrator/tools/transcript.py` — `pull_transcript`. Reads latest
  `transcript_in/*.txt`. Contains a `granola_fetch_with_retry` stub (poll-until-
  ready shape) behind the same call site, raising `NotImplementedError` until
  credentials exist. Which path runs is a config flag; P1 = file path.
- `orchestrator/tools/render.py` — `render_asis`. Deterministic. Parses the
  process model JSON, emits a Mermaid `flowchart TD`, pushes it to server state.
  No LLM. `render_tobe` present as a `NotImplementedError` stub.

### Stubs (structure only)

`tobe_designer`, `demo_builder`, `spec_writer`, `build_action_list`,
`ship_to_sunrise` — signatures / AgentDefinitions present so the chain shape is
visible; bodies raise `NotImplementedError`. Proves the pipeline skeleton without
doing the downstream work.

## 5. Data contract — the process model

The single interface between `asis_mapper` (producer) and `render_asis`
(consumer). `asis_mapper` is prompted to emit exactly this shape; `render_asis`
walks it.

```json
{
  "process_name": "string",
  "steps": [
    {"id": "s1", "label": "Receive invoice", "actor": "AP clerk"}
  ],
  "handoffs": [
    {"from": "s1", "to": "s2", "label": "email"}
  ],
  "pain_points": [
    {"step_id": "s1", "note": "manual re-keying, ~2h/day"}
  ]
}
```

Rendering rules (render_asis):
- Each `step` → a Mermaid node `id["label\n(actor)"]`.
- Each `handoff` → an edge `from -->|label| to`.
- Steps referenced by a `pain_point` → styled (class) so pain is visible on the
  map.
- Ordering: follow `handoffs`; steps with no incoming edge are entry points.

Failure mode guard (brief §10): the mapper must build the model strictly from
what was said. Plausible-but-invented steps are the primary failure. Prompt
enforces "only what the transcript supports; omit rather than guess."

## 6. Repo layout (Phase-1 subset of brief §7)

```
.
├── orchestrator-build-brief.md
├── docs/superpowers/specs/2026-07-13-orchestrator-phase1-design.md
├── orchestrator/
│   ├── __init__.py
│   ├── run.py
│   ├── system_prompts.py
│   ├── agents.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── transcript.py      # pull_transcript (+ granola stub)
│   │   └── render.py          # render_asis (+ render_tobe stub)
│   └── checkpoints.py
├── trigger/
│   ├── __init__.py
│   ├── button.py              # FastAPI page + /run + /state
│   └── feedback.py            # run-2 endpoint, stub
├── web/
│   └── index.html             # button + Mermaid live canvas (CDN)
├── transcript_in/             # drop real .txt here (sample committed)
│   └── sample.txt
├── knowledge_base/            # empty, Phase 2
├── prototypes/                # empty, Phase 3
├── outputs/                   # empty, later
├── .env.example               # ANTHROPIC_API_KEY, GRANOLA_API_KEY
└── requirements.txt
```

## 7. Error handling

- No transcript file present → `/run` returns a clear message; page shows it.
- `asis_mapper` returns non-conforming JSON → `render_asis` validates, returns an
  error string the orchestrator surfaces to the page (does not crash the run).
- Empty / off-topic transcript → mapper may emit zero steps; page shows "no
  process detected" rather than a broken diagram.
- Granola stub path invoked without creds → `NotImplementedError` with a message
  pointing at the file input flag.

## 8. Testing

- `render_asis` — pure function, unit tests: known model JSON → expected Mermaid;
  pain-point styling; missing-edge entry detection; malformed JSON → error.
- `pull_transcript` — reads latest file; empty dir → clear error.
- Process-model schema — a validator function with tests for the required shape.
- Manual acceptance: real transcript in `transcript_in/`, press button, eyeball
  the map. This is the true Phase-1 gate (recognizability is a human call).

## 9. Verify-at-build (brief §0, §6)

SDK surface drifts. At build time, confirm against live Agent SDK docs before
relying on: `tool` / `create_sdk_mcp_server`, `AgentDefinition` fields,
`ClaudeAgentOptions` (`can_use_tool` signature + return types, `permission_mode`
values, `mcp_servers`, `agents`, `allowed_tools`), `ClaudeSDKClient`
query/receive, and the current model id string. Use the context7 / claude-code
docs tools during the plan.

## Phase 2 notes

### Checkpoint gate can be shadowed by `allowed_tools`

The Agent SDK auto-approves any tool that is listed by its whole-tool name in
`allowed_tools` *before* `can_use_tool` ever runs — it emits a
`CanUseToolShadowedWarning` when this happens. That means `facilitator_gate`
(§4, `orchestrator/checkpoints.py`) is only consulted for tools that are *not*
already whitelisted in `allowed_tools`.

Concretely: if Phase 2 adds `mcp__pipeline__render_asis` to `CHECKPOINT_TOOLS`
while `render_asis` remains in `allowed_tools`, the gate will not fire for that
tool — the SDK approves it via the allowed-tools shortcut first, and the
`PermissionResultDeny` path in `facilitator_gate` silently never triggers.

Phase 2 must do one of:
- (a) remove `render_asis` from `allowed_tools` so calls to it fall through to
  `can_use_tool` and reach `facilitator_gate`, or
- (b) gate it via a `PreToolUse` hook instead of relying on `can_use_tool`.

Phase 1 is unaffected: `CHECKPOINT_TOOLS` is empty in P1, so there is nothing
for `allowed_tools` to shadow.
