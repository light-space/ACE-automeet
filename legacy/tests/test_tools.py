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
