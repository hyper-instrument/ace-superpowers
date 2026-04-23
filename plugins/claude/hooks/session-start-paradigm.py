#!/usr/bin/env python3
"""SessionStart hook — print current ACE paradigm state to stderr.

Does nothing if no paradigm has been started for this session (i.e. the
user isn't in a P1/P2/P3 flow yet).
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paradigm_helpers import (  # noqa: E402
    get_store,
    read_hook_input,
    session_id_from,
    summary_line,
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
    print(summary_line(state), file=sys.stderr)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
