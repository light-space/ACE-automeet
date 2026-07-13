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
