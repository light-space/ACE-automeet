from pathlib import Path


def read_latest_transcript(dir_path: str = "transcript_in") -> str:
    d = Path(dir_path)
    txts = sorted(d.glob("*.txt"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not txts:
        raise FileNotFoundError(
            f"no .txt transcript found in {dir_path}/ — drop a transcript file there and press the button again"
        )
    return txts[0].read_text()


def granola_fetch_with_retry(note_id: str | None) -> str:
    raise NotImplementedError(
        "Granola API not wired yet. Phase 1 uses the file path: drop a .txt in transcript_in/. "
        "Set the transcript source flag to 'granola' once GRANOLA_API_KEY and the note endpoint are confirmed."
    )
