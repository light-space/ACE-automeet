# tests/test_transcript_core.py
import os
import time
import pytest
from orchestrator.tools.transcript_core import read_latest_transcript, granola_fetch_with_retry


def test_reads_latest_txt(tmp_path):
    (tmp_path / "old.txt").write_text("old content")
    time.sleep(0.01)
    newer = tmp_path / "new.txt"
    newer.write_text("new content")
    os.utime(newer, None)
    assert read_latest_transcript(str(tmp_path)) == "new content"


def test_empty_dir_raises(tmp_path):
    with pytest.raises(FileNotFoundError):
        read_latest_transcript(str(tmp_path))


def test_granola_stub_raises():
    with pytest.raises(NotImplementedError):
        granola_fetch_with_retry("note_123")


def test_reads_non_ascii_transcript_intact(tmp_path):
    content = "Café — Maria's “invoice” note"
    (tmp_path / "transcript.txt").write_text(content, encoding="utf-8")
    assert read_latest_transcript(str(tmp_path)) == content
