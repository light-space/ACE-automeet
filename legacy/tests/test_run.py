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
