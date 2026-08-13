from pathlib import Path

from fastapi import BackgroundTasks
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse

from orchestrator import state
from orchestrator.run import run_engagement
from trigger.feedback import router as feedback_router

app = FastAPI(title="Process-Magic Orchestrator — Phase 1")
app.include_router(feedback_router)

_INDEX = Path(__file__).resolve().parent.parent / "web" / "index.html"


@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    return _INDEX.read_text()


@app.post("/run")
async def run(background_tasks: BackgroundTasks, payload: dict | None = None) -> JSONResponse:
    note_id = (payload or {}).get("note_id")
    background_tasks.add_task(run_engagement, note_id)
    return JSONResponse({"started": True})


@app.get("/state")
async def get_state() -> JSONResponse:
    return JSONResponse(state.snapshot())
