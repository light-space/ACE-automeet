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
