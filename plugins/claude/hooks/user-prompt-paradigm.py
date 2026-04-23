#!/usr/bin/env python3
"""UserPromptSubmit hook — inject paradigm progress into Claude's context.

Emits a short ``additionalContext`` JSON so Claude sees where it is in the
paradigm flow and what gates are still missing before every user turn.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paradigm_helpers import (  # noqa: E402
    additional_context,
    get_store,
    read_hook_input,
    session_id_from,
)


def main() -> None:
    data = read_hook_input()
    sid = session_id_from(data)
    store = get_store(sid) if sid else None
    if store is None or not store.exists():
        return
    state = store.read()
    if not state:
        return
    payload = {
        "hookSpecificOutput": {
            "hookEventName": "UserPromptSubmit",
            "additionalContext": additional_context(state),
        }
    }
    json.dump(payload, sys.stdout)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
