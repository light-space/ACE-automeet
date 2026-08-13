import importlib


def test_packages_import():
    assert importlib.import_module("orchestrator")
    assert importlib.import_module("orchestrator.tools")
    assert importlib.import_module("trigger")


def test_sample_transcript_present():
    from pathlib import Path
    assert Path("transcript_in/sample.txt").read_text().strip()
