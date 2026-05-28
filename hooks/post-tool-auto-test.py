#!/usr/bin/env python3
"""Auto-test hook — detect ~/.ace/store/ changes, dispatch tests asynchronously.

Triggered: PostToolUse(Edit|Write).
When a node/device/workflow file is modified, this hook spawns
`ace test run` as a *detached* background process and writes a marker
file to ~/.ace/.auto_test_pending/. The hook itself returns
immediately so Claude Code never blocks on test execution.

When tests finish, the wrapper writes the result to
~/.ace/.auto_test_results/ and removes the pending marker.
session-start-context.py surfaces completed results in the next
CC session.
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

_ACE_HOME_OVERRIDE = os.environ.get("ACE_HOME", "")
_ACE_HOME = (
    Path(_ACE_HOME_OVERRIDE).expanduser()
    if _ACE_HOME_OVERRIDE
    else Path.home() / ".ace"
)
_STORE = _ACE_HOME / "store"
_PENDING = _ACE_HOME / ".auto_test_pending"
_RESULTS = _ACE_HOME / ".auto_test_results"


def detect_changed_entities(tool_name: str, result: dict) -> list:
    """Detect (entity_type, entity_id) tuples from a tool result."""
    changed: set[tuple[str, str]] = set()
    file_paths: list[str] = []

    if tool_name in ("Edit", "Write"):
        if "file_path" in result:
            file_paths.append(result["file_path"])

    # Resolve _STORE too so symlinked roots (e.g. /tmp → /private/tmp on
    # macOS) don't make `relative_to` spuriously fail.
    try:
        store_resolved = _STORE.resolve()
    except (OSError, RuntimeError):
        store_resolved = _STORE

    for path_str in file_paths:
        path = Path(path_str).resolve()
        try:
            rel = path.relative_to(store_resolved)
        except ValueError:
            continue

        parts = rel.parts
        if len(parts) < 2:
            continue

        entity_type = parts[0]  # nodes, devices, workflows
        entity_id: str | None = None

        if entity_type == "nodes":
            if len(parts) >= 3:
                entity_id = parts[2]
        elif entity_type == "devices":
            entity_id = parts[1]
        elif entity_type == "workflows":
            wf = parts[1]
            entity_id = wf[:-5] if wf.endswith(".json") else wf

        if entity_id:
            if entity_type == "workflows":
                entity_type = "workflow"
            elif entity_type == "nodes":
                entity_type = "node"
            elif entity_type == "devices":
                entity_type = "device"
            changed.add((entity_type, entity_id))

    return list(changed)


def _find_tests(entity_type: str, entity_id: str) -> Path | None:
    if entity_type == "node":
        for sub in ("atomic", "auto", "composite", "builtin"):
            td = _STORE / "nodes" / sub / entity_id / "tests"
            if td.exists():
                return td
    elif entity_type == "device":
        for td in (
            _STORE / "devices" / entity_id / "tests",
            _STORE / "devices" / entity_id / "simulator" / "tests",
        ):
            if td.exists():
                return td
    elif entity_type == "workflow":
        td = _STORE / "workflows" / entity_id / "tests"
        if td.exists():
            return td
    return None


def _dispatch_background(entity_type: str, entity_id: str) -> int | None:
    """Spawn `ace test run` detached. Returns child PID on success, None on failure."""
    _PENDING.mkdir(parents=True, exist_ok=True)
    _RESULTS.mkdir(parents=True, exist_ok=True)

    safe_id = f"{entity_type}_{entity_id}".replace("/", "_")
    result_file = _RESULTS / f"{safe_id}.json"
    marker_file = _PENDING / f"{safe_id}.json"

    env = os.environ.copy()
    env["ACE_AUTO_TEST_RUNNING"] = "1"

    # Wrapper: capture exit code + stdout/stderr into result_file, then
    # remove the pending marker. Runs entirely in the detached child.
    wrapper = (
        f"out=$(ace test run {entity_id} --type {entity_type} 2>&1); "
        f"rc=$?; "
        f'printf "%s" "$out" | '
        f'  python3 -c "'
        f"import json, sys; "
        f"json.dump({{'rc': $rc, 'entity_type': '{entity_type}', "
        f"'entity_id': '{entity_id}', 'output': sys.stdin.read()[:4000]}}, "
        f'open(\\"{result_file}\\", \\"w\\"))"; '
        f'rm -f "{marker_file}"'
    )

    try:
        proc = subprocess.Popen(
            ["bash", "-c", wrapper],
            stdin=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=env,
            start_new_session=True,  # detach from CC's process group
        )
    except (OSError, FileNotFoundError) as ex:
        print(f"[auto-test] failed to dispatch: {ex}", file=sys.stderr)
        return None

    marker_file.write_text(json.dumps({
        "entity_type": entity_type,
        "entity_id": entity_id,
        "pid": proc.pid,
        "started_at": time.time(),
    }))
    return proc.pid


def main() -> None:
    # Recursion guard — when the wrapper itself runs `ace test run`, any
    # Edit/Write it triggers (it shouldn't, but be safe) must not loop back.
    if os.environ.get("ACE_AUTO_TEST_RUNNING") == "1":
        return

    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        return

    tool_name = data.get("tool_name")
    result = data.get("result", {})
    if isinstance(result, dict) and not result.get("success", True):
        return

    changed = detect_changed_entities(tool_name, result)
    if not changed:
        return

    seen: set[tuple[str, str]] = set()
    for entity_type, entity_id in changed:
        if (entity_type, entity_id) in seen:
            continue
        seen.add((entity_type, entity_id))

        td = _find_tests(entity_type, entity_id)
        if td is None:
            print(f"[auto-test] {entity_type}/{entity_id}: no tests", file=sys.stderr)
            continue

        pid = _dispatch_background(entity_type, entity_id)
        if pid:
            print(
                f"[auto-test] dispatched {entity_type}/{entity_id} (pid={pid})",
                file=sys.stderr,
            )


if __name__ == "__main__":
    main()
