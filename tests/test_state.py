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
