#!/usr/bin/env python3
"""Tests for manifest.py validate command."""

# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "pytest>=7.0.0",
#     "jsonschema>=4.0.0",
# ]
# ///

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import pytest
except ImportError:
    print("Error: pytest is required. Install with: pip install pytest", file=sys.stderr)
    sys.exit(2)


# Path to the manifest.py script
SCRIPT_PATH = Path(__file__).parent.parent / "scripts" / "manifest.py"
# Path to the schema
SCHEMA_PATH = Path(__file__).parent.parent / "scripts" / "bmad-manifest-schema.json"


def run_validator(manifest: dict) -> tuple[int, str, str]:
    """Run the validator on a manifest dict and return exit code, stdout, stderr."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(manifest, f)
        manifest_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, str(SCRIPT_PATH), manifest_path, "--schema", str(SCHEMA_PATH)],
            capture_output=True,
            text=True,
        )
        return result.returncode, result.stdout, result.stderr
    finally:
        Path(manifest_path).unlink()


def test_valid_manifest():
    """Test validation of a valid manifest."""
    manifest = {
        "persona": "A helpful test agent",
        "module-name": "Test Module",
        "module-code": "test",
        "capabilities": [
            {
                "name": "test-capability",
                "menu-code": "TC",
                "description": "A test capability",
                "phase": "on-demand",
            },
        ],
    }

    exit_code, stdout, _ = run_validator(manifest)
    assert exit_code == 0
    assert "valid" in stdout.lower() or json.loads(stdout).get("valid") is True


def test_invalid_json():
    """Test that invalid JSON produces an error."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        f.write("{invalid json")
        manifest_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, str(SCRIPT_PATH), manifest_path],
            capture_output=True,
            text=True,
        )
        assert result.returncode != 0
    finally:
        Path(manifest_path).unlink()


def test_missing_menu_code():
    """Test that missing menu-code produces a warning."""
    manifest = {
        "persona": "A helpful test agent",
        "module-name": "Test Module",
        "module-code": "test",
        "capabilities": [
            {
                "name": "test-capability",
                "description": "A test capability",
            },
        ],
    }

    exit_code, stdout, stderr = run_validator(manifest)
    # Should still be valid (warning only) but mention the missing menu-code
    assert exit_code == 0
    output = stdout + stderr
    assert "menu-code" in output


def test_invalid_menu_code_format():
    """Test that invalid menu-code format produces a warning."""
    manifest = {
        "persona": "A helpful test agent",
        "module-name": "Test Module",
        "module-code": "test",
        "capabilities": [
            {
                "name": "test-capability",
                "menu-code": "t",  # Too short
                "description": "A test capability",
            },
        ],
    }

    exit_code, stdout, stderr = run_validator(manifest)
    # Should still be valid (warning only)
    assert exit_code == 0
    output = stdout + stderr
    assert "menu-code" in output


def test_json_output():
    """Test JSON output format."""
    manifest = {
        "persona": "A helpful test agent",
        "module-name": "Test Module",
        "module-code": "test",
        "capabilities": [
            {
                "name": "test-capability",
                "menu-code": "TC",
                "description": "A test capability",
            },
        ],
    }

    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump(manifest, f)
        manifest_path = f.name

    try:
        result = subprocess.run(
            [sys.executable, str(SCRIPT_PATH), manifest_path, "--json"],
            capture_output=True,
            text=True,
        )
        assert result.returncode == 0

        output = json.loads(result.stdout)
        assert output["valid"] is True
        assert output["error_count"] == 0
        assert "warnings" in output
    finally:
        Path(manifest_path).unlink()


def test_invalid_manifest_no_persona():
    """Test that manifest without persona field produces an error."""
    manifest = {
        "module-name": "Test Module",
        "module-code": "test",
    }

    exit_code, stdout, _ = run_validator(manifest)
    assert exit_code != 0
    output = json.loads(stdout) if "--json" in sys.argv else stdout
    # Should have validation errors
    assert exit_code == 1


if __name__ == "__main__":
    # Run pytest if available
    pytest.main([__file__, "-v"])
