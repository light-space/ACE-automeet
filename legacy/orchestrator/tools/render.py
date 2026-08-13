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
