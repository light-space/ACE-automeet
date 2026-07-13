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
    prompt = (
        f"Run the engagement. note_id={note_id!r}."
        if note_id
        else "Run the engagement using the latest transcript."
    )
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
