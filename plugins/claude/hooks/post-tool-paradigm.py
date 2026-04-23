#!/usr/bin/env python3
"""PostToolUse hook — record structured paradigm events.

Listens to tool uses that signal progress (TodoWrite / Task* / AskUserQuestion /
EnterPlanMode / ExitPlanMode) and appends them to the session's
``events.jsonl``. No gate enforcement here — that's Branch A+B.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from paradigm_helpers import (  # noqa: E402
    get_store,
    read_hook_input,
    session_id_from,
)


TRACKED_TOOLS = {
    "TodoWrite",
    "TaskCreate",
    "TaskUpdate",
    "TaskList",
    "TaskGet",
    "AskUserQuestion",
    "EnterPlanMode",
    "ExitPlanMode",
}


def _summarize_input(tool: str, tool_input: dict) -> dict:
    """Extract the interesting bits from each tool's input payload."""
    if tool == "TodoWrite":
        todos = tool_input.get("todos") or []
        return {
            "todo_count": len(todos),
            "todos": [
                {"status": t.get("status"), "content": (t.get("content") or "")[:200]}
                for t in todos[:20]
            ],
        }
    if tool in {"TaskCreate", "TaskUpdate"}:
        return {
            "task_id": tool_input.get("id") or tool_input.get("task_id"),
            "status": tool_input.get("status"),
            "content": (tool_input.get("content") or "")[:200],
        }
    if tool == "AskUserQuestion":
        q = tool_input.get("question") or tool_input.get("prompt") or ""
        opts = tool_input.get("options") or []
        return {"question": q[:300], "options": opts[:10] if isinstance(opts, list) else None}
    if tool == "ExitPlanMode":
        plan = tool_input.get("plan") or ""
        return {"plan_excerpt": plan[:300], "plan_length": len(plan)}
    return {"input_keys": sorted(tool_input.keys()) if isinstance(tool_input, dict) else None}


def main() -> None:
    data = read_hook_input()
    tool = data.get("tool_name") or data.get("tool") or ""
    if tool not in TRACKED_TOOLS:
        return

    sid = session_id_from(data)
    store = get_store(sid) if sid else None
    if store is None:
        return

    tool_input = data.get("tool_input") or {}
    tool_response = data.get("tool_response") or {}

    event = {
        "type": "tool_use",
        "tool": tool,
        "summary": _summarize_input(tool, tool_input),
    }
    # Record whether the tool succeeded so the UI can diff.
    if isinstance(tool_response, dict) and "error" in tool_response:
        event["error"] = str(tool_response.get("error"))[:300]

    # Attach current phase so events are easy to group later.
    state = store.read()
    if state:
        event["phase"] = state.get("current_phase")

    store.append_event(event)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
