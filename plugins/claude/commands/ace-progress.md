---
description: Show the current paradigm session's phase, gates, and recent events
---

# ACE Progress — Show Paradigm Session State

Render the structured state of the active paradigm session (current phase, required gates and their status, and the last few events) so your human partner can see where in the flow you are without reading the transcript.

## What This Command Does

Runs `ace paradigm status` against the current Claude Code session id. The command reads `~/.ace/paradigm_sessions/<session_id>/state.json` (written by Branch A progress tracking) and renders a human-readable phase progress bar plus recent `events.jsonl` entries.

## Usage

```
/ace-progress
```

The command takes no arguments; session id defaults to `$CLAUDE_SESSION_ID`.

## What You'll See

```
P2 Device Onboarding  —  CLARIFY  (1/7)
  [●······]                  ← phase progress
  ✓ device_info  Nanonis SPM (SPECS)
  ✓ manuals      /data/manuals/nanonis.pdf
  · sdk          (required, not yet collected)
  · goal         (required, not yet collected)
  · safety       (required, not yet collected)
Recent events:
  15:42  gate_satisfied  device_info
  15:44  gate_satisfied  manuals
  15:47  tool_blocked    Write — missing gates: sdk, goal, safety
```

## When to Run

- Whenever your human partner asks "where are we?"
- Before advancing a phase, to sanity-check that all required gates are green
- When a `PreToolUse` hook block confuses the agent — `/ace-progress` shows exactly which gates are missing

## JSON Mode

For machine consumption (e.g. a future frontend):

```bash
ace paradigm status --json
```

## Invocation

```bash
ace paradigm status
```

No skill invocation — this is a thin wrapper over the CLI.
