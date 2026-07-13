import json
import re
from typing import Any

_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def parse_process_model(raw: str) -> dict[str, Any]:
    cleaned = _FENCE.sub("", raw).strip()
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"asis_mapper did not return valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise ValueError("process model must be a JSON object")
    return data


def validate_process_model(data: dict[str, Any]) -> tuple[bool, str]:
    for key in ("steps", "handoffs", "pain_points"):
        if not isinstance(data.get(key), list):
            return False, f"missing or non-list field: {key}"

    step_ids: set[str] = set()
    for i, step in enumerate(data["steps"]):
        if not isinstance(step, dict) or "id" not in step:
            return False, f"step {i} missing required field: id"
        if "label" not in step:
            return False, f"step {step.get('id')} missing required field: label"
        step_ids.add(step["id"])

    for i, h in enumerate(data["handoffs"]):
        for field in ("from", "to"):
            if h.get(field) not in step_ids:
                return False, f"handoff {i} references unknown step: {h.get(field)}"

    for i, p in enumerate(data["pain_points"]):
        if p.get("step_id") is not None and p["step_id"] not in step_ids:
            return False, f"pain_point {i} references unknown step: {p.get('step_id')}"

    return True, ""
