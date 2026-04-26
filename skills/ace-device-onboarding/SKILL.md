---
name: ace-device-onboarding
description: "Use when onboarding new hardware devices to ACE with device definitions, simulators, nodes, and ace-hub sharing. Enforces Clarify → Design → Plan → Execute → Verify → Share."
---

# ACE Paradigm 2 — Device & Simulator Onboarding

Transform device manuals and SDKs into ACE-orchestratable assets: device definitions,
simulators, nodes, workflows, and ace-hub sharing.

## Hard rule: do not write code before Clarify is complete

**You MUST NOT call `Write`, `Edit`, `Bash` with mutating commands, or any CLI like
`ace device create` until all five Phase-1 Clarify gates below are satisfied.** The ONLY
tools allowed in Phase 1 are `AskUserQuestion`, `Read`, `Glob`, `Grep`, `TodoWrite`, and
read-only `Bash` (e.g. `ls`, `cat`). If you feel the urge to skip ahead, call
`AskUserQuestion` instead.

## Phase 1 — Clarify (gather, don't build)

Use `AskUserQuestion` to collect exactly five answers, **one question per call**:

| Gate id       | Question                                                                    |
|---------------|-----------------------------------------------------------------------------|
| `device_info` | What device / instrument? (model, vendor, physical vs virtual)              |
| `manuals`     | What manuals / documentation are available? (PDFs, API docs, URLs)          |
| `sdk`         | What SDK / API is available? (Python package path, REST, vendor C/C++ lib)  |
| `goal`        | What's the goal? Full automation, HITL, or future capability only?          |
| `safety`      | Any safety constraints or dangerous operations to guard against?            |

Rules:
- Ask **one question at a time** via `AskUserQuestion`. Do not batch.
- After each answer, acknowledge briefly (one line) and immediately ask the next gate.
- If the human says "just do it" / "you decide" / "pick sensible defaults" — still collect
  all five answers, but accept short ones. Do not skip any gate.
- You may use `Read` / `Glob` / `Grep` to inspect SDK source **only when the human explicitly
  points you at a file path** in their answer. Do not run exploratory `Read` or `Bash` on
  your own initiative during Phase 1.
- **Each gate MUST use `AskUserQuestion`** — do not infer answers from context or skip gates.

When all five gates are collected, summarise the answers back to the human in one short
message and explicitly ask for approval to move to Phase 2.

## Phase 2 — Design (brainstorming + spec)

Once Phase 1 is approved:

1. **Check if a spec already exists**: look for `docs/superpowers/specs/*-onboarding.md`.
2. **If NO spec exists**, propose **2 or 3** onboarding approaches:
   - **Approach A**: Pure software simulator + full automation.
   - **Approach B**: Human-in-the-loop with traces for future automation.
   - **Approach C**: Hybrid (simulator for safe ops, HITL for destructive ops).
   State pros/cons briefly. Call `AskUserQuestion` for the human to choose (A / B / C / Other).
3. **Write the spec** to `docs/superpowers/specs/YYYY-MM-DD-<device>-onboarding.md`
   summarising the 5 Clarify answers and the chosen approach.
4. **If spec already exists and is approved**, skip to Phase 3.

## Phase 3 — Plan (write plan, then confirm before execution)

1. **Write a plan** to `docs/superpowers/plans/YYYY-MM-DD-<device>-onboarding-plan.md`
   enumerating the concrete tasks for Phases 4–6. A typical breakdown:
   - Create `device.json` + simulator
   - Write test → implement node (RED/GREEN) for each operation
   - Compose workflow JSON, run end-to-end
   - Write `CLAUDE_BENCHMARK_STATUS.md`

2. **Present the plan** to the human via `AskUserQuestion` and **wait for explicit approval**
   before starting any execution work.

3. Once approved, create the corresponding task items via `TodoWrite` or `TaskCreate`
   and mark them `in_progress` / `completed` as you go.

**Do NOT start Phase 4 until the human has approved the plan.**

## Phase 4 — Execute with TDD

**Iron law: no production code without a failing test first.**

1. RED — write a failing test.
2. GREEN — minimum code to pass.
3. REFACTOR — clean up, test stays green.

**HITL gates — call `AskUserQuestion` before EACH of these CLI operations:**
- `ace device create` — ask: "Ready to create device definition. Proceed?"
- `ace node create` — ask: "Ready to create node(s). Proceed?"
- `ace workflow run` — ask: "Ready to run end-to-end workflow. Proceed?"
- `ace hub push` — ask: "Ready to push to ace-hub. Proceed?"

Do NOT batch these into one confirmation. Each destructive CLI call gets its own
`AskUserQuestion` gate. The human must explicitly approve before each operation.

### Scope Boundary

Device onboarding creates **adapter layers only** in `~/.ace/store/`:
- `devices/<type>/<impl>/` — device definitions
- `nodes/<device-id>/<node_id>/` — node implementations
- `workflows/` — workflow definitions

Never modify ACE framework core. Work around limitations in your adapter.

### Efficiency

- Don't loop on `Bash` for debugging — read error messages and fix in one pass.
- Don't create excessive tasks. 5–10 `TodoWrite` items is ideal.
- Keep tool calls minimal: aim for < 100 total tool calls.


## Phase 5 — Verify

1. Unit tests per node / per simulator — all must pass.
2. End-to-end: `ace workflow run <test-workflow>` must succeed.
3. **Show the workflow run output** to the human — paste the full stdout/stderr
   so they can see the result (e.g. "2+3=5, 5-1=4, 4*4=16, 16/2=8.0").

Fix failures before marking Phase 5 complete.

## Phase 6: Evolution & Sharing

**1. Extract Patterns:**
```bash
ace evolve
```

**2. Push to ace-hub for sharing:**
```bash
# Push device with memory
ace hub push <device-id> --type device --commit

# Push nodes
ace hub push <node-id> --type node

# Push workflows
ace hub push <workflow-id> --type workflow --commit
```

**3. Document in CLAUDE.md (if universal patterns emerge)**

**HITL gate:** call `AskUserQuestion` before each `ace hub push`.

Write `CLAUDE_BENCHMARK_STATUS.md` in workspace root:
  - Files created, commands run, how to reproduce, Phase-1 answers (verbatim).

## Reference Templates

**Device adapter layer is thin. Implementation complexity lives in nodes.**

### Device Definition — Standard Pattern

**`device.json`** — Thin capability contract, NOT implementation:

```json
{
  "name": "<device-type>/<implementation>",
  "type": "<DEVICE_TYPE>",
  "vendor": "<Vendor Name>",
  "model": "<Model Name>",
  "version": "1.0.0",
  "description": "Brief description of the device",
  "capabilities": [
    "capability_1",
    "capability_2",
    "capability_3"
  ],
  "parameters": {
    "param_group_1": {
      "range": [min, max],
      "presets": ["preset1", "preset2"]
    },
    "param_group_2": {
      "options": ["option1", "option2"]
    }
  },
  "connection": {
    "protocol": "tcp|serial|rest|...",
    "host": "127.0.0.1",
    "port": 50000,
    "authkey": "optional_auth_key"
  },
  "has_simulator": true,
  "simulator_id": "<device-id>-simulator",
  "simulator": {
    "source": "local",
    "simulator_id": "<device-id>-simulator",
    "speed_multiplier": 10.0
  },
  "metadata": {
    "simulator_class": "<DeviceName>Simulator",
    "sdk_install": {
      "method": "pip|local",
      "package": "git+ssh://... OR /local/path/to/sdk"
    }
  }
}
```

**Key Principles:**
- `device.json` is a **capability declaration**, not implementation code
- Implementation details go in **nodes**, referenced by capabilities
- SDK configuration in `metadata.sdk_install` (pip URL or local path)
- Simulator class name in `metadata.simulator_class` (matches device.py)

### Scope Reminder

**Hierarchy:** `devices/<device_type>/<implementation>/`
- Example: `devices/stm/nanonis/` (hardware), `devices/stm/simulator/` (simulator)

| Layer | Content | Location |
|-------|---------|----------|
| Device definition | Capability contract, SDK config | `device.json` (in `<type>/<impl>/`) |
| Simulator adapter | State management, operation routing | `device.py` (in `<type>/simulator/`) |
| Operation logic | Complex validation, protocol encoding | **Nodes** |
| SDK integration | Device-specific API calls | **Nodes** |

**Device adapter is thin. Implementation complexity lives in nodes.**

## Anti-Patterns — STOP Immediately

- Writing code before all 5 Clarify gates → STOP, go back to Phase 1
- Skipping `AskUserQuestion` for a gate → STOP, ask now
- Skipping `AskUserQuestion` before destructive CLI calls → STOP, ask first
- Running `Bash` exploratory commands during Phase 1 → STOP, ask first
- Starting execution before plan is approved → STOP, present plan first
- 100+ tool calls without completion → simplify approach
