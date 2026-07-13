from fastapi.testclient import TestClient
from orchestrator import state
import trigger.button as button


def test_index_served():
    client = TestClient(button.app)
    r = client.get("/")
    assert r.status_code == 200
    assert "mermaid" in r.text.lower()


def test_state_endpoint_returns_snapshot():
    state.reset()
    state.set_mermaid("flowchart TD\n a-->b")
    client = TestClient(button.app)
    r = client.get("/state")
    assert r.status_code == 200
    assert "flowchart" in r.json()["mermaid"]


def test_run_endpoint_starts(monkeypatch):
    called = {}

    async def fake_run(note_id=None):
        called["ran"] = True
        return "sess_x"

    monkeypatch.setattr(button, "run_engagement", fake_run)
    client = TestClient(button.app)
    r = client.post("/run", json={})
    assert r.status_code == 200
    assert r.json()["started"] is True
