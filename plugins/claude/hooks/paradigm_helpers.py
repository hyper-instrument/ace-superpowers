"""Shared helpers for the paradigm-progress hooks.

The authoritative schema + store implementation lives in
``ace/src/core/paradigm/store.py``. Hooks import it via ``CLAUDE_PROJECT_DIR``
so both the CLI (`ace paradigm ...`) and the hooks write compatible state.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any, Optional


def _add_ace_to_path() -> None:
    ace_root = os.environ.get("CLAUDE_PROJECT_DIR", "")
    if ace_root and ace_root not in sys.path:
        sys.path.insert(0, ace_root)


def get_store(session_id: str):
    """Return a ``ParadigmStore`` or ``None`` when ace is unavailable."""
    if not session_id:
        return None
    _add_ace_to_path()
    try:
        from src.core.paradigm.store import ParadigmStore  # type: ignore
    except Exception:
        return None
    try:
        return ParadigmStore(session_id)
    except Exception:
        return None


def read_hook_input() -> dict[str, Any]:
    try:
        return json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        return {}


def session_id_from(hook_input: dict[str, Any]) -> Optional[str]:
    sid = hook_input.get("session_id")
    if sid:
        return sid
    return os.environ.get("CLAUDE_SESSION_ID") or None


def summary_line(state: dict[str, Any]) -> str:
    """One-line paradigm summary for stderr injection."""
    cur = state.get("current_phase", "?")
    idx = state.get("phase_index", 0) + 1
    total = state.get("total_phases", "?")
    phases = {p["id"]: p for p in state.get("phases", [])}
    cur_phase = phases.get(cur, {})
    gates = cur_phase.get("gates", [])
    done = sum(1 for g in gates if g["satisfied"])
    missing = [g["label"] for g in gates if g.get("required") and not g["satisfied"]]
    parts = [
        f"{state.get('paradigm','?')}/{cur} ({idx}/{total})",
        f"gates {done}/{len(gates)}",
    ]
    if missing:
        parts.append("missing: " + "; ".join(missing[:3]))
    return "[ACE Paradigm] " + " — ".join(parts)


def additional_context(state: dict[str, Any]) -> str:
    """Block of text the hook returns to Claude as ``additionalContext``.

    Kept terse so it doesn't dominate the context budget.
    """
    lines = [summary_line(state)]
    phases = state.get("phases", [])
    cur = state.get("current_phase")
    cur_phase = next((p for p in phases if p["id"] == cur), None)
    if cur_phase:
        missing = [
            g["label"] for g in cur_phase.get("gates", []) if g.get("required") and not g["satisfied"]
        ]
        satisfied = [
            f"{g['label']}" + (f" = {g['value']}" if g.get("value") else "")
            for g in cur_phase.get("gates", [])
            if g.get("satisfied")
        ]
        if satisfied:
            lines.append("Already collected: " + "; ".join(satisfied))
        if missing:
            lines.append(
                "Still needed before advancing: " + "; ".join(missing) + ". "
                "Record each with: `ace paradigm mark-gate "
                f"{cur} <gate_id> --value \"...\"`."
            )
    return "\n".join(lines)
