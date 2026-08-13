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
