#!/usr/bin/env python3
"""Merged PostToolUse(Bash) dispatcher.

Replaces two separate hook subprocess invocations (post-tool-trace and
pre-execution-memory) with a single Python process. Eliminates one
~17ms interpreter cold-start per Bash tool call.

Each handler.handle(data) catches its own exceptions so one failure
doesn't block the other. Dispatcher always exits 0.
"""
import importlib.util
import json
import sys
from pathlib import Path

HOOK_DIR = Path(__file__).resolve().parent
# Make _ace_config importable for handlers that need it.
if str(HOOK_DIR) not in sys.path:
    sys.path.insert(0, str(HOOK_DIR))


def _load(name: str, filename: str):
    spec = importlib.util.spec_from_file_location(name, HOOK_DIR / filename)
    if spec is None or spec.loader is None:
        return None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def _log_error(where: str, ex: Exception) -> None:
    try:
        from _ace_config import log_hook_error
        log_hook_error(where, ex)
    except Exception:
        print(f"[ACE] {where} error: {ex}", file=sys.stderr)


def main() -> None:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    # Order: trace first (records failures into session state),
    # then memory injection (which may read that state).
    for module_name, filename in (
        ("post_tool_trace", "post-tool-trace.py"),
        ("pre_execution_memory", "pre-execution-memory.py"),
    ):
        try:
            mod = _load(module_name, filename)
            if mod is None:
                _log_error(f"post-tool-bash/{module_name}", RuntimeError("module load failed"))
                continue
            if not hasattr(mod, "handle"):
                _log_error(
                    f"post-tool-bash/{module_name}",
                    AttributeError(f"{filename} has no handle(data) — re-run install"),
                )
                continue
            mod.handle(data)
        except Exception as ex:
            _log_error(f"post-tool-bash/{module_name}", ex)

    sys.exit(0)


if __name__ == "__main__":
    main()
