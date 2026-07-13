from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/feedback")
async def feedback(payload: dict | None = None) -> JSONResponse:
    # Phase 4: resumes the session (resume=session_id) and runs the downstream stations.
    return JSONResponse({"error": "feedback beat not implemented (Phase 4)"}, status_code=501)
