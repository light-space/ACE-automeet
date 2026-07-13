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
