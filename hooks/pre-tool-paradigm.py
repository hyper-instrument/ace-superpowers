#!/usr/bin/env python3
"""PreToolUse paradigm hook (Branch A+B hard gating).

Delegates the policy check to ``ace paradigm gate-check`` so the CLI and
hook share one decision path. The hook is a thin I/O shim: pass stdin
through, relay the CLI's JSON decision back to Claude Code, exit 0.

Paradigm-aware: if no paradigm session exists (or the session's
paradigm definition doesn't want gating), ``gate-check`` returns
``permissionDecision: allow`` and the hook is a no-op.
"""
from __future__ import annotations

import os
import subprocess
import sys


def main() -> int:
    raw = ""
    try:
        if not sys.stdin.isatty():
            raw = sys.stdin.read()
    except Exception:
        raw = ""

    # Locate `ace`. Prefer the project's own venv / direnv-resolved
    # binary; fall back to PATH.
    ace = os.environ.get("ACE_CLI") or "ace"

    try:
        proc = subprocess.run(
            [ace, "paradigm", "gate-check"],
            input=raw,
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        # If the CLI is unavailable or hangs, fail-open: printing
        # nothing + exit 0 tells Claude Code to proceed. Branch A+B is
        # advisory infrastructure — it must not break the session when
        # the tooling is missing.
        return 0

    # Relay stdout (the JSON decision) unchanged; discard stderr so it
    # doesn't clutter the transcript.
    if proc.stdout:
        sys.stdout.write(proc.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
