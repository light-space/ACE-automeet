# Orchestrator Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Press a button → pull a real meeting transcript → an `asis_mapper` subagent turns it into a structured process model → render it as a live Mermaid map on a web page the client recognizes.

**Architecture:** A thin FastAPI trigger page kicks off a Claude Agent SDK run. The orchestrator loop runs three stations in sequence: `pull_transcript` (tool, reads latest `.txt`), `asis_mapper` (subagent, transcript → process-model JSON), `render_asis` (tool, JSON → Mermaid string written to shared in-memory state). The page short-polls `/state` and renders the Mermaid with mermaid.js. Reasoning lives in subagents; side effects (file read, rendering, state writes) live in tools. Downstream stations are scaffolded as `NotImplementedError` stubs.

**Tech Stack:** Python 3.10+, `claude-agent-sdk`, FastAPI + uvicorn, `pytest`, mermaid.js (CDN in the page).

## Global Constraints

- Python 3.10+ (use `X | Y` unions, `dict[...]` generics).
- SDK package: `claude-agent-sdk`. Model id for `asis_mapper`: `claude-opus-4-8`.
- Orchestrator `permission_mode="default"`.
- In-process MCP tool names follow `mcp__pipeline__<tool>`. Subagent-invocation tool is named `"Agent"` (not `"Task"`).
- SDK tool handler signature: `async def handler(args: dict[str, Any]) -> dict[str, Any]`, returning `{"content": [{"type": "text", "text": str}], "is_error": bool}`. In-process tools return text content only (no `structuredContent`).
- `session_id` is read from a `ResultMessage.session_id` in the streamed messages.
- No pptx / deck output anywhere in Phase 1 (explicitly cut).
- Keep pure logic (mermaid generation, schema validation, transcript file selection) in `_core` modules separate from the SDK `@tool` wrappers, so it is unit-testable without an API key.
- TDD: failing test first. Commit after each green task. DRY, YAGNI.

---

### Task 1: Project scaffold

**Files:**
- Create: `requirements.txt`
- Create: `.env.example`
- Create: `orchestrator/__init__.py`, `orchestrator/tools/__init__.py`, `trigger/__init__.py`, `tests/__init__.py`
- Create: `transcript_in/sample.txt`
- Create: `web/.gitkeep`, `knowledge_base/.gitkeep`, `prototypes/.gitkeep`, `outputs/.gitkeep`
- Test: `tests/test_scaffold.py`

**Interfaces:**
- Consumes: nothing.
- Produces: importable `orchestrator` and `trigger` packages; installed deps.

- [ ] **Step 1: Write the failing test**

```python
# tests/test_scaffold.py
import importlib


def test_packages_import():
    assert importlib.import_module("orchestrator")
    assert importlib.import_module("orchestrator.tools")
    assert importlib.import_module("trigger")


def test_sample_transcript_present():
    from pathlib import Path
    assert Path("transcript_in/sample.txt").read_text().strip()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m pytest tests/test_scaffold.py -v`
Expected: FAIL (ModuleNotFoundError: No module named 'orchestrator').

- [ ] **Step 3: Create the package files**

`requirements.txt`:
```
claude-agent-sdk
fastapi
uvicorn[standard]
pytest
httpx
```

`.env.example`:
```
ANTHROPIC_API_KEY=
GRANOLA_API_KEY=
```

Create empty `orchestrator/__init__.py`, `orchestrator/tools/__init__.py`, `trigger/__init__.py`, `tests/__init__.py`.

Create the `.gitkeep` files (empty) under `web/`, `knowledge_base/`, `prototypes/`, `outputs/`.

`transcript_in/sample.txt` — a short realistic messy transcript (~15 lines) describing an invoice-approval process with at least two actors and one clear pain point. Example:
```
Facilitator: Walk me through how an invoice gets paid today.
Maria (AP): So the invoice comes in by email to our shared inbox.
Maria: I download the PDF and re-key the amounts into the spreadsheet by hand. That's honestly the worst part, takes me a couple hours a day.
Maria: Then I email it to Dev, our manager, for approval.
Dev (Manager): Right, I get a lot of these. I eyeball it and reply "approved" usually same day, sometimes it sits a day if I'm travelling.
Maria: Once Dev approves I enter it into the accounting system and schedule the payment.
Facilitator: Who catches errors?
Maria: Nobody really until the vendor calls asking where their money is.
```

- [ ] **Step 4: Install deps and run tests**

Run: `pip install -r requirements.txt && python -m pytest tests/test_scaffold.py -v`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add requirements.txt .env.example orchestrator trigger tests transcript_in web knowledge_base prototypes outputs
git commit -m "feat: project scaffold and sample transcript"
```

---

### Task 2: Process-model schema validator

**Files:**
- Create: `orchestrator/model.py`
- Test: `tests/test_model.py`

**Interfaces:**
- Consumes: nothing.
- Produces: `validate_process_model(data: dict) -> tuple[bool, str]` — returns `(True, "")` on a valid model, `(False, "<reason>")` otherwise. `parse_process_model(raw: str) -> dict` — strips markdown fences, `json.loads`, raises `ValueError` with a clear message on bad JSON.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_model.py
import pytest
from orchestrator.model import validate_process_model, parse_process_model

VALID = {
    "process_name": "Invoice approval",
    "steps": [
        {"id": "s1", "label": "Receive invoice", "actor": "AP clerk"},
        {"id": "s2", "label": "Approve", "actor": "Manager"},
    ],
    "handoffs": [{"from": "s1", "to": "s2", "label": "email"}],
    "pain_points": [{"step_id": "s1", "note": "manual re-keying"}],
}


def test_valid_model_passes():
    ok, err = validate_process_model(VALID)
    assert ok and err == ""


def test_missing_steps_fails():
    ok, err = validate_process_model({"process_name": "x", "handoffs": [], "pain_points": []})
    assert not ok and "steps" in err


def test_step_missing_id_fails():
    bad = {**VALID, "steps": [{"label": "no id", "actor": "x"}]}
    ok, err = validate_process_model(bad)
    assert not ok and "id" in err


def test_handoff_references_unknown_step_fails():
    bad = {**VALID, "handoffs": [{"from": "s1", "to": "s99", "label": "x"}]}
    ok, err = validate_process_model(bad)
    assert not ok and "s99" in err


def test_empty_steps_is_valid():
    # off-topic transcript → zero steps is allowed (page shows "no process detected")
    ok, err = validate_process_model({"process_name": "", "steps": [], "handoffs": [], "pain_points": []})
    assert ok


def test_parse_strips_markdown_fence():
    raw = '```json\n{"process_name":"x","steps":[],"handoffs":[],"pain_points":[]}\n```'
    assert parse_process_model(raw)["process_name"] == "x"


def test_parse_bad_json_raises():
    with pytest.raises(ValueError):
        parse_process_model("not json at all")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_model.py -v`
Expected: FAIL (ModuleNotFoundError: orchestrator.model).

- [ ] **Step 3: Implement `orchestrator/model.py`**

```python
import json
import re
from typing import Any

_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def parse_process_model(raw: str) -> dict[str, Any]:
    cleaned = _FENCE.sub("", raw).strip()
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"asis_mapper did not return valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise ValueError("process model must be a JSON object")
    return data


def validate_process_model(data: dict[str, Any]) -> tuple[bool, str]:
    for key in ("steps", "handoffs", "pain_points"):
        if not isinstance(data.get(key), list):
            return False, f"missing or non-list field: {key}"

    step_ids: set[str] = set()
    for i, step in enumerate(data["steps"]):
        if not isinstance(step, dict) or "id" not in step:
            return False, f"step {i} missing required field: id"
        if "label" not in step:
            return False, f"step {step.get('id')} missing required field: label"
        step_ids.add(step["id"])

    for i, h in enumerate(data["handoffs"]):
        for field in ("from", "to"):
            if h.get(field) not in step_ids:
                return False, f"handoff {i} references unknown step: {h.get(field)}"

    for i, p in enumerate(data["pain_points"]):
        if p.get("step_id") is not None and p["step_id"] not in step_ids:
            return False, f"pain_point {i} references unknown step: {p.get('step_id')}"

    return True, ""
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_model.py -v`
Expected: PASS (7 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/model.py tests/test_model.py
git commit -m "feat: process-model parse and validate"
```

---

### Task 3: Mermaid renderer (pure core)

**Files:**
- Create: `orchestrator/render_core.py`
- Test: `tests/test_render_core.py`

**Interfaces:**
- Consumes: `validate_process_model` from `orchestrator.model` (Task 2).
- Produces: `model_to_mermaid(model: dict) -> str`. Raises `ValueError` if the model fails validation (caller catches and surfaces). Empty steps → returns a valid single-node diagram reading "No process detected".

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_render_core.py
import pytest
from orchestrator.render_core import model_to_mermaid

MODEL = {
    "process_name": "Invoice approval",
    "steps": [
        {"id": "s1", "label": "Receive invoice", "actor": "AP clerk"},
        {"id": "s2", "label": "Approve", "actor": "Manager"},
    ],
    "handoffs": [{"from": "s1", "to": "s2", "label": "email"}],
    "pain_points": [{"step_id": "s1", "note": "manual re-keying"}],
}


def test_starts_with_flowchart():
    out = model_to_mermaid(MODEL)
    assert out.startswith("flowchart TD")


def test_contains_nodes_with_label_and_actor():
    out = model_to_mermaid(MODEL)
    assert "Receive invoice" in out and "AP clerk" in out
    assert "s1[" in out and "s2[" in out


def test_contains_edge_with_label():
    out = model_to_mermaid(MODEL)
    assert "s1 -->|email| s2" in out


def test_pain_point_step_is_styled():
    out = model_to_mermaid(MODEL)
    # painful steps get a class assignment and a classDef
    assert "classDef pain" in out
    assert "class s1 pain" in out


def test_quotes_and_newlines_are_sanitized():
    model = {
        "process_name": "x",
        "steps": [{"id": "s1", "label": 'He said "hi"\nthen left', "actor": ""}],
        "handoffs": [],
        "pain_points": [],
    }
    out = model_to_mermaid(model)
    assert "'hi'" in out            # inner double-quotes converted to single
    assert '"hi"' not in out        # no raw inner double-quotes left
    assert "'hi' then left" in out  # newline collapsed to a space


def test_empty_steps_returns_no_process_node():
    out = model_to_mermaid({"process_name": "", "steps": [], "handoffs": [], "pain_points": []})
    assert out.startswith("flowchart TD")
    assert "No process detected" in out


def test_invalid_model_raises():
    with pytest.raises(ValueError):
        model_to_mermaid({"steps": "nope"})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_render_core.py -v`
Expected: FAIL (ModuleNotFoundError: orchestrator.render_core).

- [ ] **Step 3: Implement `orchestrator/render_core.py`**

```python
from typing import Any

from orchestrator.model import validate_process_model


def _clean(text: str) -> str:
    # Mermaid node text: no double-quotes, no raw newlines, no brackets that break the shape.
    return (
        str(text)
        .replace('"', "'")
        .replace("\n", " ")
        .replace("\r", " ")
        .replace("[", "(")
        .replace("]", ")")
        .strip()
    )


def model_to_mermaid(model: dict[str, Any]) -> str:
    ok, err = validate_process_model(model)
    if not ok:
        raise ValueError(f"cannot render invalid process model: {err}")

    steps = model["steps"]
    if not steps:
        return 'flowchart TD\n    empty["No process detected in transcript"]'

    lines = ["flowchart TD"]
    for step in steps:
        label = _clean(step["label"])
        actor = _clean(step.get("actor", ""))
        text = f"{label}<br/>({actor})" if actor else label
        lines.append(f'    {step["id"]}["{text}"]')

    for h in model["handoffs"]:
        label = _clean(h.get("label", ""))
        if label:
            lines.append(f'    {h["from"]} -->|{label}| {h["to"]}')
        else:
            lines.append(f'    {h["from"]} --> {h["to"]}')

    painful = {p["step_id"] for p in model["pain_points"] if p.get("step_id")}
    if painful:
        lines.append("    classDef pain fill:#ffe0e0,stroke:#d33,stroke-width:2px;")
        for sid in sorted(painful):
            lines.append(f"    class {sid} pain")

    return "\n".join(lines)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_render_core.py -v`
Expected: PASS (7 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/render_core.py tests/test_render_core.py
git commit -m "feat: process-model to Mermaid renderer"
```

---

### Task 4: Shared run state

**Files:**
- Create: `orchestrator/state.py`
- Test: `tests/test_state.py`

**Interfaces:**
- Consumes: nothing.
- Produces: a module-level singleton `STATE` plus helpers: `set_status(str) -> None`, `set_mermaid(str) -> None`, `append_log(str) -> None`, `set_session_id(str) -> None`, `snapshot() -> dict` (returns `{"status", "mermaid", "log": list[str], "session_id"}`), `reset() -> None`. This is the surface both `render_asis` (writer) and the FastAPI `/state` endpoint (reader) share.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_state.py
from orchestrator import state


def test_reset_gives_empty_snapshot():
    state.reset()
    snap = state.snapshot()
    assert snap["status"] == "idle"
    assert snap["mermaid"] == ""
    assert snap["log"] == []
    assert snap["session_id"] is None


def test_setters_update_snapshot():
    state.reset()
    state.set_status("running")
    state.set_mermaid("flowchart TD\n a-->b")
    state.append_log("pulled transcript")
    state.set_session_id("sess_123")
    snap = state.snapshot()
    assert snap["status"] == "running"
    assert "flowchart" in snap["mermaid"]
    assert snap["log"] == ["pulled transcript"]
    assert snap["session_id"] == "sess_123"


def test_snapshot_is_a_copy():
    state.reset()
    state.append_log("a")
    snap = state.snapshot()
    snap["log"].append("mutated")
    assert state.snapshot()["log"] == ["a"]
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_state.py -v`
Expected: FAIL (ModuleNotFoundError: orchestrator.state).

- [ ] **Step 3: Implement `orchestrator/state.py`**

```python
import threading
from typing import Any

_lock = threading.Lock()
STATE: dict[str, Any] = {"status": "idle", "mermaid": "", "log": [], "session_id": None}


def reset() -> None:
    with _lock:
        STATE.update(status="idle", mermaid="", log=[], session_id=None)


def set_status(value: str) -> None:
    with _lock:
        STATE["status"] = value


def set_mermaid(value: str) -> None:
    with _lock:
        STATE["mermaid"] = value


def append_log(line: str) -> None:
    with _lock:
        STATE["log"].append(line)


def set_session_id(value: str) -> None:
    with _lock:
        STATE["session_id"] = value


def snapshot() -> dict[str, Any]:
    with _lock:
        return {
            "status": STATE["status"],
            "mermaid": STATE["mermaid"],
            "log": list(STATE["log"]),
            "session_id": STATE["session_id"],
        }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_state.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/state.py tests/test_state.py
git commit -m "feat: shared run state for live canvas"
```

---

### Task 5: Transcript source (pure core + Granola stub)

**Files:**
- Create: `orchestrator/tools/transcript_core.py`
- Test: `tests/test_transcript_core.py`

**Interfaces:**
- Consumes: nothing.
- Produces: `read_latest_transcript(dir_path: str = "transcript_in") -> str` — returns text of the most-recently-modified `.txt`; raises `FileNotFoundError` with a clear message if none. `granola_fetch_with_retry(note_id: str | None) -> str` — stub, raises `NotImplementedError` pointing at the file-input flag.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_transcript_core.py
import os
import time
import pytest
from orchestrator.tools.transcript_core import read_latest_transcript, granola_fetch_with_retry


def test_reads_latest_txt(tmp_path):
    (tmp_path / "old.txt").write_text("old content")
    time.sleep(0.01)
    newer = tmp_path / "new.txt"
    newer.write_text("new content")
    os.utime(newer, None)
    assert read_latest_transcript(str(tmp_path)) == "new content"


def test_empty_dir_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        read_latest_transcript(str(tmp_path))


def test_granola_stub_raises():
    with pytest.raises(NotImplementedError):
        granola_fetch_with_retry("note_123")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_transcript_core.py -v`
Expected: FAIL (ModuleNotFoundError).

- [ ] **Step 3: Implement `orchestrator/tools/transcript_core.py`**

```python
from pathlib import Path


def read_latest_transcript(dir_path: str = "transcript_in") -> str:
    d = Path(dir_path)
    txts = sorted(d.glob("*.txt"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not txts:
        raise FileNotFoundError(
            f"no .txt transcript found in {dir_path}/ — drop a transcript file there and press the button again"
        )
    return txts[0].read_text()


def granola_fetch_with_retry(note_id: str | None) -> str:
    raise NotImplementedError(
        "Granola API not wired yet. Phase 1 uses the file path: drop a .txt in transcript_in/. "
        "Set the transcript source flag to 'granola' once GRANOLA_API_KEY and the note endpoint are confirmed."
    )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_transcript_core.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/tools/transcript_core.py tests/test_transcript_core.py
git commit -m "feat: transcript file reader and Granola stub"
```

---

### Task 6: SDK tool wrappers

**Files:**
- Create: `orchestrator/tools/transcript.py`
- Create: `orchestrator/tools/render.py`
- Test: `tests/test_tools.py`

**Interfaces:**
- Consumes: `read_latest_transcript` (Task 5), `model_to_mermaid` (Task 3), `parse_process_model` (Task 2), `state` helpers (Task 4).
- Produces:
  - `orchestrator/tools/transcript.py`: `pull_transcript` (an SDK `@tool` named `"pull_transcript"`, input `{"note_id": str}`) and `_pull_transcript_impl(note_id: str | None) -> str` (the testable core it wraps).
  - `orchestrator/tools/render.py`: `render_asis` (an SDK `@tool` named `"render_asis"`, input `{"model_json": str}`), `render_tobe` (stub `@tool` raising `NotImplementedError` inside its impl), and `_render_asis_impl(model_json: str) -> str` (testable core).
- Note: the `@tool`-decorated objects are SDK wrappers registered later in the MCP server; the `_impl` functions hold the logic and are what the tests exercise. Handlers return `{"content": [{"type": "text", "text": ...}], "is_error": bool}`.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_tools.py
from orchestrator import state
from orchestrator.tools.transcript import _pull_transcript_impl
from orchestrator.tools.render import _render_asis_impl

GOOD_JSON = (
    '{"process_name":"P","steps":[{"id":"s1","label":"A","actor":"X"}],'
    '"handoffs":[],"pain_points":[]}'
)


def test_pull_impl_reads_file(tmp_path, monkeypatch):
    (tmp_path / "t.txt").write_text("hello process")
    monkeypatch.chdir(tmp_path)
    (tmp_path / "transcript_in").mkdir()
    (tmp_path / "transcript_in" / "a.txt").write_text("the real transcript")
    assert "real transcript" in _pull_transcript_impl(None)


def test_render_impl_writes_state_and_returns_confirmation():
    state.reset()
    result = _render_asis_impl(GOOD_JSON)
    assert "flowchart TD" in state.snapshot()["mermaid"]
    assert "render" in result.lower()


def test_render_impl_bad_json_returns_error_text_not_crash():
    state.reset()
    result = _render_asis_impl("not json")
    assert "valid json" in result.lower() or "error" in result.lower()
    # state mermaid stays empty on failure
    assert state.snapshot()["mermaid"] == ""
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_tools.py -v`
Expected: FAIL (ModuleNotFoundError).

- [ ] **Step 3: Implement the wrappers**

`orchestrator/tools/transcript.py`:
```python
from typing import Any

from claude_agent_sdk import tool

from orchestrator import state
from orchestrator.tools.transcript_core import read_latest_transcript


def _pull_transcript_impl(note_id: str | None) -> str:
    # Phase 1: file path. (Granola adapter selected here in a later phase.)
    text = read_latest_transcript()
    state.append_log("pulled transcript")
    return text


@tool("pull_transcript", "Fetch the latest meeting transcript text", {"note_id": str})
async def pull_transcript(args: dict[str, Any]) -> dict[str, Any]:
    try:
        text = _pull_transcript_impl(args.get("note_id"))
        return {"content": [{"type": "text", "text": text}], "is_error": False}
    except FileNotFoundError as e:
        return {"content": [{"type": "text", "text": str(e)}], "is_error": True}
```

`orchestrator/tools/render.py`:
```python
from typing import Any

from claude_agent_sdk import tool

from orchestrator import state
from orchestrator.model import parse_process_model
from orchestrator.render_core import model_to_mermaid


def _render_asis_impl(model_json: str) -> str:
    try:
        model = parse_process_model(model_json)
        mermaid = model_to_mermaid(model)
    except ValueError as e:
        state.append_log(f"render failed: {e}")
        return f"render error: {e}"
    state.set_mermaid(mermaid)
    state.append_log("rendered as-is map")
    return "Rendered as-is map to the live canvas."


@tool("render_asis", "Render a process model (JSON) to the live Mermaid canvas", {"model_json": str})
async def render_asis(args: dict[str, Any]) -> dict[str, Any]:
    result = _render_asis_impl(args["model_json"])
    is_error = result.startswith("render error")
    return {"content": [{"type": "text", "text": result}], "is_error": is_error}


@tool("render_tobe", "Render the to-be deck (Phase 4 stub)", {"model_json": str})
async def render_tobe(args: dict[str, Any]) -> dict[str, Any]:
    raise NotImplementedError("render_tobe arrives in a later phase")
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_tools.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/tools/transcript.py orchestrator/tools/render.py tests/test_tools.py
git commit -m "feat: SDK tool wrappers for pull_transcript and render_asis"
```

---

### Task 7: Agents and system prompts

**Files:**
- Create: `orchestrator/system_prompts.py`
- Create: `orchestrator/agents.py`
- Test: `tests/test_agents.py`

**Interfaces:**
- Consumes: `AgentDefinition` from `claude_agent_sdk`.
- Produces:
  - `orchestrator/system_prompts.py`: `ORCHESTRATOR_SYSTEM_PROMPT: str`, `ASIS_MAPPER_PROMPT: str`, `TOBE_DESIGNER_PROMPT: str`, `DEMO_BUILDER_PROMPT: str`.
  - `orchestrator/agents.py`: `AGENTS: dict[str, AgentDefinition]` with key `"asis_mapper"` (real, `model="claude-opus-4-8"`, `tools=[]`) and structural stubs `"tobe_designer"`, `"demo_builder"`.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_agents.py
from orchestrator.agents import AGENTS
from orchestrator.system_prompts import ORCHESTRATOR_SYSTEM_PROMPT, ASIS_MAPPER_PROMPT


def test_asis_mapper_defined_pure_reasoning():
    a = AGENTS["asis_mapper"]
    assert a.tools == []
    assert a.model == "claude-opus-4-8"


def test_asis_mapper_prompt_forbids_inventing_steps():
    assert "invent" in ASIS_MAPPER_PROMPT.lower()
    # must emit the exact JSON contract keys
    for key in ("steps", "handoffs", "pain_points"):
        assert key in ASIS_MAPPER_PROMPT


def test_orchestrator_prompt_names_the_three_stations_in_order():
    p = ORCHESTRATOR_SYSTEM_PROMPT
    assert p.index("pull_transcript") < p.index("asis_mapper") < p.index("render_asis")


def test_downstream_stub_agents_present():
    assert "tobe_designer" in AGENTS and "demo_builder" in AGENTS
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_agents.py -v`
Expected: FAIL (ModuleNotFoundError).

- [ ] **Step 3: Implement the prompts and agents**

`orchestrator/system_prompts.py`:
```python
ORCHESTRATOR_SYSTEM_PROMPT = """You run a live process-mapping engagement. Execute exactly these stations in order, then stop:

1. Call the pull_transcript tool to get the meeting transcript.
2. Use the Agent tool to invoke the asis_mapper subagent, passing it the full transcript. It returns a JSON process model.
3. Call the render_asis tool with that JSON as model_json.

Do not skip, reorder, or add stations. After render_asis succeeds, report one short sentence and stop. Do not invent content; the transcript is the only ground truth."""

ASIS_MAPPER_PROMPT = """You turn a meeting transcript into the real current-state (as-is) process.

Extract ONLY what the transcript supports. Never invent steps, actors, or handoffs. If something is unclear, omit it rather than guess. A plausible-but-wrong map is the worst outcome.

Return ONLY a JSON object (no prose, no markdown fence) with this exact shape:
{
  "process_name": "<short name of the process>",
  "steps": [{"id": "s1", "label": "<what happens>", "actor": "<who does it>"}],
  "handoffs": [{"from": "<step id>", "to": "<step id>", "label": "<how it passes, e.g. email>"}],
  "pain_points": [{"step_id": "<step id>", "note": "<the problem stated in the meeting>"}]
}

Use sequential ids s1, s2, ... Every handoff from/to must reference a defined step id. If no process is described, return the shape with empty arrays."""

TOBE_DESIGNER_PROMPT = "Phase 2 stub."
DEMO_BUILDER_PROMPT = "Phase 3 stub."
```

`orchestrator/agents.py`:
```python
from claude_agent_sdk import AgentDefinition

from orchestrator.system_prompts import (
    ASIS_MAPPER_PROMPT,
    DEMO_BUILDER_PROMPT,
    TOBE_DESIGNER_PROMPT,
)

AGENTS: dict[str, AgentDefinition] = {
    "asis_mapper": AgentDefinition(
        description="Turn a meeting transcript into a structured as-is process model",
        prompt=ASIS_MAPPER_PROMPT,
        tools=[],
        model="claude-opus-4-8",
    ),
    # Structural stubs — defined so the pipeline shape is visible; not on the Phase 1 path.
    "tobe_designer": AgentDefinition(
        description="Propose an improved to-be process (Phase 2)",
        prompt=TOBE_DESIGNER_PROMPT,
        tools=["Read"],
    ),
    "demo_builder": AgentDefinition(
        description="Build a clickable HTML prototype of the to-be (Phase 3)",
        prompt=DEMO_BUILDER_PROMPT,
        tools=["Read", "Write"],
    ),
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_agents.py -v`
Expected: PASS (4 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/system_prompts.py orchestrator/agents.py tests/test_agents.py
git commit -m "feat: orchestrator and asis_mapper prompts plus agent definitions"
```

---

### Task 8: Facilitator checkpoint gate

**Files:**
- Create: `orchestrator/checkpoints.py`
- Test: `tests/test_checkpoints.py`

**Interfaces:**
- Consumes: `PermissionResultAllow`, `PermissionResultDeny` from `claude_agent_sdk`.
- Produces: `CHECKPOINT_TOOLS: set[str]` (empty in Phase 1) and `async facilitator_gate(tool_name: str, input_data: dict, context: Any) -> PermissionResultAllow | PermissionResultDeny`. Any tool not in `CHECKPOINT_TOOLS` is allowed unchanged. (Approval UI arrives in Phase 2; the gate structure exists now.)

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_checkpoints.py
import asyncio
from claude_agent_sdk import PermissionResultAllow, PermissionResultDeny
from orchestrator import checkpoints


def test_non_checkpoint_tool_is_allowed():
    res = asyncio.run(checkpoints.facilitator_gate("mcp__pipeline__render_asis", {}, None))
    assert isinstance(res, PermissionResultAllow)


def test_checkpoint_tools_empty_in_phase1():
    assert checkpoints.CHECKPOINT_TOOLS == set()


def test_gated_tool_is_denied_when_present(monkeypatch):
    monkeypatch.setattr(checkpoints, "CHECKPOINT_TOOLS", {"mcp__pipeline__ship_to_sunrise"})
    res = asyncio.run(checkpoints.facilitator_gate("mcp__pipeline__ship_to_sunrise", {}, None))
    assert isinstance(res, PermissionResultDeny)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_checkpoints.py -v`
Expected: FAIL (ModuleNotFoundError).

- [ ] **Step 3: Implement `orchestrator/checkpoints.py`**

```python
from typing import Any

from claude_agent_sdk import PermissionResultAllow, PermissionResultDeny

# Empty in Phase 1: the single as-is link runs clean. Phase 2 adds
# {"mcp__pipeline__render_asis", ...} and a real approval prompt.
CHECKPOINT_TOOLS: set[str] = set()


async def facilitator_gate(
    tool_name: str, input_data: dict[str, Any], context: Any
) -> PermissionResultAllow | PermissionResultDeny:
    if tool_name in CHECKPOINT_TOOLS:
        # Phase 2 replaces this with an interactive approval; deny-by-default until then.
        return PermissionResultDeny(
            behavior="deny",
            message=f"Facilitator approval required for {tool_name} (not yet wired).",
        )
    return PermissionResultAllow(behavior="allow", updated_input=input_data)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_checkpoints.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/checkpoints.py tests/test_checkpoints.py
git commit -m "feat: facilitator checkpoint gate scaffold"
```

---

### Task 9: Orchestrator run wiring

**Files:**
- Create: `orchestrator/run.py`
- Test: `tests/test_run.py`

**Interfaces:**
- Consumes: `pull_transcript`, `render_asis`, `render_tobe` (Task 6); `AGENTS` (Task 7); `facilitator_gate` (Task 8); `ORCHESTRATOR_SYSTEM_PROMPT` (Task 7); `state` (Task 4); `create_sdk_mcp_server`, `ClaudeSDKClient`, `ClaudeAgentOptions` from the SDK.
- Produces:
  - `build_pipeline_server()` -> the in-process MCP server config (`create_sdk_mcp_server(name="pipeline", version="1.0.0", tools=[pull_transcript, render_asis, render_tobe])`).
  - `build_options() -> ClaudeAgentOptions` — assembles system prompt, `mcp_servers={"pipeline": ...}`, `agents=AGENTS`, `allowed_tools=["mcp__pipeline__pull_transcript", "mcp__pipeline__render_asis", "Agent"]`, `permission_mode="default"`, `can_use_tool=facilitator_gate`, `model="claude-opus-4-8"`.
  - `async run_engagement(note_id: str | None = None) -> str | None` — resets state, sets status running, drives `ClaudeSDKClient`, captures `session_id` from any `ResultMessage`, sets status done/error, returns the session_id.
- Because a real run needs an API key, tests exercise `build_options`/`build_pipeline_server` construction only; `run_engagement` is covered by manual acceptance (Task 11).

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_run.py
from orchestrator.run import build_options, build_pipeline_server


def test_pipeline_server_builds():
    server = build_pipeline_server()
    assert server is not None


def test_options_wire_the_phase1_path():
    opts = build_options()
    assert "mcp__pipeline__pull_transcript" in opts.allowed_tools
    assert "mcp__pipeline__render_asis" in opts.allowed_tools
    assert "Agent" in opts.allowed_tools
    assert opts.permission_mode == "default"
    assert opts.model == "claude-opus-4-8"
    assert "asis_mapper" in opts.agents
    assert opts.can_use_tool is not None
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_run.py -v`
Expected: FAIL (ModuleNotFoundError).

- [ ] **Step 3: Implement `orchestrator/run.py`**

```python
from claude_agent_sdk import (
    ClaudeAgentOptions,
    ClaudeSDKClient,
    create_sdk_mcp_server,
)

from orchestrator import state
from orchestrator.agents import AGENTS
from orchestrator.checkpoints import facilitator_gate
from orchestrator.system_prompts import ORCHESTRATOR_SYSTEM_PROMPT
from orchestrator.tools.render import render_asis, render_tobe
from orchestrator.tools.transcript import pull_transcript


def build_pipeline_server():
    return create_sdk_mcp_server(
        name="pipeline",
        version="1.0.0",
        tools=[pull_transcript, render_asis, render_tobe],
    )


def build_options() -> ClaudeAgentOptions:
    return ClaudeAgentOptions(
        system_prompt=ORCHESTRATOR_SYSTEM_PROMPT,
        mcp_servers={"pipeline": build_pipeline_server()},
        agents=AGENTS,
        allowed_tools=[
            "mcp__pipeline__pull_transcript",
            "mcp__pipeline__render_asis",
            "Agent",
        ],
        permission_mode="default",
        can_use_tool=facilitator_gate,
        model="claude-opus-4-8",
    )


async def run_engagement(note_id: str | None = None) -> str | None:
    state.reset()
    state.set_status("running")
    session_id: str | None = None
    prompt = f"Run the engagement. note_id={note_id!r}." if note_id else "Run the engagement using the latest transcript."
    try:
        async with ClaudeSDKClient(options=build_options()) as client:
            await client.query(prompt)
            async for message in client.receive_response():
                sid = getattr(message, "session_id", None)
                if sid:
                    session_id = sid
        state.set_session_id(session_id)
        state.set_status("done")
    except Exception as e:  # surface, don't crash the server
        state.append_log(f"run error: {e}")
        state.set_status("error")
    return session_id
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_run.py -v`
Expected: PASS (2 passed).

- [ ] **Step 5: Commit**

```bash
git add orchestrator/run.py tests/test_run.py
git commit -m "feat: orchestrator run wiring and options"
```

---

### Task 10: Trigger web page (button + live canvas)

**Files:**
- Create: `trigger/button.py`
- Create: `trigger/feedback.py`
- Create: `web/index.html`
- Test: `tests/test_button.py`

**Interfaces:**
- Consumes: `run_engagement` (Task 9), `state` (Task 4).
- Produces: a FastAPI `app` in `trigger/button.py` with:
  - `GET /` → serves `web/index.html`.
  - `POST /run` → schedules `run_engagement` as a background task, returns `{"started": true}`.
  - `GET /state` → returns `state.snapshot()` as JSON.
  - `feedback.py`: a stub `POST /feedback` router returning `501` (Phase 4).
- The page: a big "Generate as-is map" button that POSTs `/run`, then polls `GET /state` every ~1.5s and renders `mermaid` into a `<div class="mermaid">` via mermaid.js from CDN; shows `status` and the `log`.

- [ ] **Step 1: Write the failing tests**

```python
# tests/test_button.py
from fastapi.testclient import TestClient
from orchestrator import state
import trigger.button as button


def test_index_served():
    client = TestClient(button.app)
    r = client.get("/")
    assert r.status_code == 200
    assert "mermaid" in r.text.lower()


def test_state_endpoint_returns_snapshot():
    state.reset()
    state.set_mermaid("flowchart TD\n a-->b")
    client = TestClient(button.app)
    r = client.get("/state")
    assert r.status_code == 200
    assert "flowchart" in r.json()["mermaid"]


def test_run_endpoint_starts(monkeypatch):
    called = {}

    async def fake_run(note_id=None):
        called["ran"] = True
        return "sess_x"

    monkeypatch.setattr(button, "run_engagement", fake_run)
    client = TestClient(button.app)
    r = client.post("/run", json={})
    assert r.status_code == 200
    assert r.json()["started"] is True
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python -m pytest tests/test_button.py -v`
Expected: FAIL (ModuleNotFoundError: trigger.button).

- [ ] **Step 3: Implement the page and endpoints**

`trigger/button.py`:
```python
from pathlib import Path

from fastapi import BackgroundTasks
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse

from orchestrator import state
from orchestrator.run import run_engagement
from trigger.feedback import router as feedback_router

app = FastAPI(title="Process-Magic Orchestrator — Phase 1")
app.include_router(feedback_router)

_INDEX = Path(__file__).resolve().parent.parent / "web" / "index.html"


@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    return _INDEX.read_text()


@app.post("/run")
async def run(background_tasks: BackgroundTasks, payload: dict | None = None) -> JSONResponse:
    note_id = (payload or {}).get("note_id")
    background_tasks.add_task(run_engagement, note_id)
    return JSONResponse({"started": True})


@app.get("/state")
async def get_state() -> JSONResponse:
    return JSONResponse(state.snapshot())
```

`trigger/feedback.py`:
```python
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/feedback")
async def feedback(payload: dict | None = None) -> JSONResponse:
    # Phase 4: resumes the session (resume=session_id) and runs the downstream stations.
    return JSONResponse({"error": "feedback beat not implemented (Phase 4)"}, status_code=501)
```

`web/index.html`:
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>As-Is Map</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    #go { font-size: 1.25rem; padding: 0.75rem 1.5rem; cursor: pointer; }
    #status { margin: 1rem 0; color: #555; }
    #log { color: #888; font-size: 0.85rem; white-space: pre-line; }
    .mermaid { margin-top: 1.5rem; }
  </style>
</head>
<body>
  <button id="go">Generate as-is map</button>
  <div id="status">idle</div>
  <div id="canvas" class="mermaid"></div>
  <div id="log"></div>
  <script>
    mermaid.initialize({ startOnLoad: false });
    let lastMermaid = "";

    document.getElementById("go").onclick = async () => {
      await fetch("/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    };

    async function poll() {
      try {
        const s = await (await fetch("/state")).json();
        document.getElementById("status").textContent = "status: " + s.status;
        document.getElementById("log").textContent = (s.log || []).join("\n");
        if (s.mermaid && s.mermaid !== lastMermaid) {
          lastMermaid = s.mermaid;
          const c = document.getElementById("canvas");
          c.removeAttribute("data-processed");
          c.innerHTML = s.mermaid;
          await mermaid.run({ nodes: [c] });
        }
      } catch (e) { /* transient */ }
    }
    setInterval(poll, 1500);
    poll();
  </script>
</body>
</html>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python -m pytest tests/test_button.py -v`
Expected: PASS (3 passed).

- [ ] **Step 5: Commit**

```bash
git add trigger/button.py trigger/feedback.py web/index.html tests/test_button.py
git commit -m "feat: trigger web page with button and live Mermaid canvas"
```

---

### Task 11: Full-suite green + README + manual acceptance

**Files:**
- Create: `README.md`
- Test: run the whole suite.

**Interfaces:**
- Consumes: everything above.
- Produces: run instructions and the documented manual acceptance procedure (the true Phase-1 gate — map recognizability is a human call).

- [ ] **Step 1: Run the full test suite**

Run: `python -m pytest -v`
Expected: PASS (all tasks' tests green, ~25 passed).

- [ ] **Step 2: Write `README.md`**

````markdown
# Process-Magic Orchestrator — Phase 1

Button → pull transcript → as-is process map (live Mermaid canvas).

## Setup
```bash
pip install -r requirements.txt
cp .env.example .env   # put your ANTHROPIC_API_KEY in .env
export $(grep -v '^#' .env | xargs)   # or use your own env loader
```

## Run
```bash
uvicorn trigger.button:app --reload --port 8000
```
Open http://localhost:8000. Drop a real transcript `.txt` into `transcript_in/`
(a `sample.txt` is included). Press **Generate as-is map**. The as-is map renders
live on the page.

## Tests
```bash
python -m pytest -v
```

## Phase 1 scope
Only the first link works end to end: button → `pull_transcript` → `asis_mapper`
→ `render_asis`. Downstream stations (`tobe_designer`, `demo_builder`,
`spec_writer`, `ship_to_sunrise`) and the feedback beat are scaffolded stubs.
No pptx in Phase 1.
````

- [ ] **Step 3: Manual acceptance (documented, run once by hand)**

1. `export ANTHROPIC_API_KEY=...`
2. `uvicorn trigger.button:app --port 8000`
3. Open http://localhost:8000, press the button.
4. Watch `status` go `running → done` and the map appear.
5. Read the map against `transcript_in/sample.txt`: every step and pain point
   must trace to something actually said. No invented steps. If the map is
   recognizable, Phase 1 passes.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: Phase 1 README and manual acceptance"
```

---

## Self-Review Notes

- **Spec coverage:** button page (T10), pull_transcript + Granola stub (T5/T6), asis_mapper (T7), render_asis + Mermaid live canvas (T3/T6/T10), process-model contract (T2), reasoning/side-effect split (subagent T7 vs tools T6), checkpoint scaffold with empty gate (T8), downstream + feedback stubs (T6/T7/T10), no pptx (absent by construction), verify-SDK-at-build (done before this plan; ids baked into Global Constraints). All spec sections map to a task.
- **Placeholder scan:** no TBD/TODO; every code step shows full code.
- **Type consistency:** `parse_process_model`/`validate_process_model` (T2) consumed by `model_to_mermaid` (T3) and `_render_asis_impl` (T6); `state` helpers (T4) used identically in T6/T9/T10; `run_engagement(note_id=None)` signature matches its call in T10; tool names `mcp__pipeline__pull_transcript` / `mcp__pipeline__render_asis` consistent across T9 allowed_tools and orchestrator prompt intent.
