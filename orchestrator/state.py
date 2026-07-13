import threading
from typing import Any

_lock = threading.Lock()
STATE: dict[str, Any] = {"status": "idle", "mermaid": "", "log": [], "session_id": None}


def reset() -> None:
    with _lock:
        STATE.update(status="idle", mermaid="", log=[], session_id=None)


def set_status(value: str) -> None:
    with _lock:
        STATE["status"] = value


def set_mermaid(value: str) -> None:
    with _lock:
        STATE["mermaid"] = value


def append_log(line: str) -> None:
    with _lock:
        STATE["log"].append(line)


def set_session_id(value: str) -> None:
    with _lock:
        STATE["session_id"] = value


def snapshot() -> dict[str, Any]:
    with _lock:
        return {
            "status": STATE["status"],
            "mermaid": STATE["mermaid"],
            "log": list(STATE["log"]),
            "session_id": STATE["session_id"],
        }
