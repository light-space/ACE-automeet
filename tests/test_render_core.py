import pytest
from orchestrator.render_core import model_to_mermaid

MODEL = {
    "process_name": "Invoice approval",
    "steps": [
        {"id": "s1", "label": "Receive invoice", "actor": "AP clerk"},
        {"id": "s2", "label": "Approve", "actor": "Manager"},
    ],
    "handoffs": [{"from": "s1", "to": "s2", "label": "email"}],
    "pain_points": [{"step_id": "s1", "note": "manual re-keying"}],
}


def test_starts_with_flowchart():
    out = model_to_mermaid(MODEL)
    assert out.startswith("flowchart TD")


def test_contains_nodes_with_label_and_actor():
    out = model_to_mermaid(MODEL)
    assert "Receive invoice" in out and "AP clerk" in out
    assert "s1[" in out and "s2[" in out


def test_contains_edge_with_label():
    out = model_to_mermaid(MODEL)
    assert "s1 -->|email| s2" in out


def test_pain_point_step_is_styled():
    out = model_to_mermaid(MODEL)
    # painful steps get a class assignment and a classDef
    assert "classDef pain" in out
    assert "class s1 pain" in out


def test_quotes_and_newlines_are_sanitized():
    model = {
        "process_name": "x",
        "steps": [{"id": "s1", "label": 'He said "hi"\nthen left', "actor": ""}],
        "handoffs": [],
        "pain_points": [],
    }
    out = model_to_mermaid(model)
    assert "'hi'" in out            # inner double-quotes converted to single
    assert '"hi"' not in out        # no raw inner double-quotes left
    assert "'hi' then left" in out  # newline collapsed to a space


def test_null_actor_renders_bare_label():
    model = {
        "process_name": "x",
        "steps": [{"id": "s1", "label": "Do thing", "actor": None}],
        "handoffs": [],
        "pain_points": [],
    }
    out = model_to_mermaid(model)
    assert "Do thing" in out
    assert "(None)" not in out
    assert "None" not in out


def test_null_handoff_label_renders_unlabeled_edge():
    model = {
        "process_name": "x",
        "steps": [
            {"id": "s1", "label": "A", "actor": ""},
            {"id": "s2", "label": "B", "actor": ""},
        ],
        "handoffs": [{"from": "s1", "to": "s2", "label": None}],
        "pain_points": [],
    }
    out = model_to_mermaid(model)
    assert "s1 --> s2" in out
    assert "-->|None|" not in out
    assert "None" not in out


def test_empty_steps_returns_no_process_node():
    out = model_to_mermaid({"process_name": "", "steps": [], "handoffs": [], "pain_points": []})
    assert out.startswith("flowchart TD")
    assert "No process detected" in out


def test_invalid_model_raises():
    with pytest.raises(ValueError):
        model_to_mermaid({"steps": "nope"})
