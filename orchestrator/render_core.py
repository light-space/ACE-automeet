from typing import Any

from orchestrator.model import validate_process_model


def _clean(text: str) -> str:
    # Mermaid node text: no double-quotes, no raw newlines, no brackets that break the shape.
    return (
        str(text)
        .replace('"', "'")
        .replace("\n", " ")
        .replace("\r", " ")
        .replace("[", "(")
        .replace("]", ")")
        .strip()
    )


def model_to_mermaid(model: dict[str, Any]) -> str:
    ok, err = validate_process_model(model)
    if not ok:
        raise ValueError(f"cannot render invalid process model: {err}")

    steps = model["steps"]
    if not steps:
        return 'flowchart TD\n    empty["No process detected in transcript"]'

    lines = ["flowchart TD"]
    for step in steps:
        label = _clean(step["label"])
        actor = _clean(step.get("actor", ""))
        text = f"{label}<br/>({actor})" if actor else label
        lines.append(f'    {step["id"]}["{text}"]')

    for h in model["handoffs"]:
        label = _clean(h.get("label", ""))
        if label:
            lines.append(f'    {h["from"]} -->|{label}| {h["to"]}')
        else:
            lines.append(f'    {h["from"]} --> {h["to"]}')

    painful = {p["step_id"] for p in model["pain_points"] if p.get("step_id")}
    if painful:
        lines.append("    classDef pain fill:#ffe0e0,stroke:#d33,stroke-width:2px;")
        for sid in sorted(painful):
            lines.append(f"    class {sid} pain")

    return "\n".join(lines)
