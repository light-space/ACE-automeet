# Process-Magic Orchestrator — Phase 1

Button → pull transcript → as-is process map (live Mermaid canvas).

## Setup
```bash
pip install -r requirements.txt
cp .env.example .env   # put your ANTHROPIC_API_KEY in .env
export $(grep -v '^#' .env | xargs)   # or use your own env loader
```

## Run
```bash
uvicorn trigger.button:app --reload --port 8000
```
Open http://localhost:8000. Drop a real transcript `.txt` into `transcript_in/`
(a `sample.txt` is included). Press **Generate as-is map**. The as-is map renders
live on the page.

## Tests
```bash
python -m pytest -v
```

## Phase 1 scope
Only the first link works end to end: button → `pull_transcript` → `asis_mapper`
→ `render_asis`. Downstream stations (`tobe_designer`, `demo_builder`,
`spec_writer`, `ship_to_sunrise`) and the feedback beat are scaffolded stubs.
No pptx in Phase 1.
