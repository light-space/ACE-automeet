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
