import pytest
from orchestrator.model import validate_process_model, parse_process_model

VALID = {
    "process_name": "Invoice approval",
    "steps": [
        {"id": "s1", "label": "Receive invoice", "actor": "AP clerk"},
        {"id": "s2", "label": "Approve", "actor": "Manager"},
    ],
    "handoffs": [{"from": "s1", "to": "s2", "label": "email"}],
    "pain_points": [{"step_id": "s1", "note": "manual re-keying"}],
}


def test_valid_model_passes():
    ok, err = validate_process_model(VALID)
    assert ok and err == ""


def test_missing_steps_fails():
    ok, err = validate_process_model({"process_name": "x", "handoffs": [], "pain_points": []})
    assert not ok and "steps" in err


def test_step_missing_id_fails():
    bad = {**VALID, "steps": [{"label": "no id", "actor": "x"}]}
    ok, err = validate_process_model(bad)
    assert not ok and "id" in err


def test_handoff_references_unknown_step_fails():
    bad = {**VALID, "handoffs": [{"from": "s1", "to": "s99", "label": "x"}]}
    ok, err = validate_process_model(bad)
    assert not ok and "s99" in err


def test_empty_steps_is_valid():
    # off-topic transcript → zero steps is allowed (page shows "no process detected")
    ok, err = validate_process_model({"process_name": "", "steps": [], "handoffs": [], "pain_points": []})
    assert ok


def test_parse_strips_markdown_fence():
    raw = '```json\n{"process_name":"x","steps":[],"handoffs":[],"pain_points":[]}\n```'
    assert parse_process_model(raw)["process_name"] == "x"


def test_parse_bad_json_raises():
    with pytest.raises(ValueError):
        parse_process_model("not json at all")
