---
description: "ACE Paradigm 2: Onboard devices with evolution闭环 and ace-hub sharing"
---

# ACE Paradigm 2 - Device & Simulator Onboarding

Transform device manuals and SDKs into ACE-orchestratable assets with ace-hub sharing.

## When to Use

- User brings new instrument/device manuals
- User provides SDK/API with examples
- Need to create Device + Simulator definitions
- No existing abstraction for target device
- Want to share device configuration with team via ace-hub

## Key Principles

**From Superpowers:**
- Clarify before building (one question at a time)
- Design alternatives (propose 2-3 approaches)
- Verify at each milestone
- No speculative work
- **TDD is mandatory**: NO NODE/SIMULATOR CODE WITHOUT FAILING TEST FIRST
- Write test → watch it fail → write minimal code → watch it pass
- Validate with: node test + simple workflow end-to-end test

**From ACE:**
- Accumulate: Onboarding process → traces
- Composable: Device + Simulator + Nodes work together
- Evolve: Device onboarding patterns feed future onboardings
- Share: Push to ace-hub for team collaboration

## 6-Phase Workflow

### Phase 1: Clarify

Ask one question at a time:
1. What device/instrument? (model, vendor)
2. What manuals/documentation available? (PDFs, API docs)
3. What SDK/API available? (Python package, REST API, etc.)
4. What's the goal? (Full automation, HITL, or future capability?)
5. Any safety constraints or dangerous operations?

**CLI Check:**
```bash
# Check if similar device exists on ace-hub
ace hub list --type devices
ace hub list --type devices --filter <vendor>
```

### Phase 2: Design

**Invoke superpowers:brainstorming**

Propose 3 onboarding approaches:

**Option A: Full Simulator + Automation**
- Build complete simulator from SDK
- Full workflow automation
- Best for: Well-understood, safe operations

**Option B: HITL (Human-in-the-loop) with Traces**
- Human executes, ACE learns
- Accumulate traces for future automation
- Best for: Complex, safety-critical operations

**Option C: Hybrid**
- Simulator for safe operations
- HITL for high-risk operations
- Best for: Mixed safety requirements

**Reference existing devices:**
```bash
# Pull reference device for design inspiration
ace hub pull <similar-device> --type device
```

Get user approval before proceeding.

### Phase 3: Plan

**Invoke superpowers:writing-plans**

Create detailed onboarding plan with:
- Step-by-step CLI commands
- File paths for all artifacts
- Validation checkpoints
- Estimated time for each step

**Ingest manuals:**
```bash
ace knowledge ingest <manual.pdf> --tags device:<device-id>
```

### Phase 4: Execute with TDD

**CRITICAL: Apply TDD to all code artifacts**

**TDD Iron Law: NO NODE/SIMULATOR CODE WITHOUT FAILING TEST FIRST**

**1. Create Device Definition:**
```bash
ace device create <device-id> --from-spec device_spec.json
```

**2. Build Atomic Nodes (TDD for each):**

For each atomic operation - TDD cycle:

**RED - Write Failing Test:**
```bash
# Create test FIRST - node doesn't exist yet
ace node test --create <node-id>_test.py --description "connect to device"
# Verify test FAILS (expected - node not implemented)
ace sandbox test <node-id>_test.py
```

**GREEN - Build Node to Pass Test:**
```bash
# Build node to make test pass
ace node build --device <device-id> --description "connect to device"
# Verify test PASSES
ace sandbox test <node-id>_test.py
```

**REFACTOR - Clean Up:**
```bash
# Improve node while test stays green
ace node validate <node-id>
ace sandbox test <node-id>_test.py  # Must still pass
```

**Repeat for each node:**
```bash
# RED
ace node test --create <node-id>_test.py --description "set parameter X"
ace sandbox test <node-id>_test.py  # Must fail

# GREEN
ace node build --device <device-id> --description "set parameter X"
ace sandbox test <node-id>_test.py  # Must pass
```

**3. Create Simulator (if applicable, TDD):**

**RED:**
```bash
ace simulator test --create <device-id>_sim_test.py
ace sandbox test <device-id>_sim_test.py  # Must fail
```

**GREEN:**
```bash
ace simulator create <device-id> [--type <sim-type>]
ace sandbox test <device-id>_sim_test.py  # Must pass
```

**4. Create Test Workflow (TDD):**

**RED - Create failing test workflow:**
```bash
# Create test workflow (will fail since nodes might not be fully integrated)
ace workflow create --device <device-id> --name "test_<device-id>" --nodes "<node1>,<node2>,..."
ace run workflow test_<device-id> --dry-run  # Should fail or show issues
```

**GREEN - Fix nodes until workflow passes:**
```bash
# Iterate on nodes until test workflow passes
ace run workflow test_<device-id>  # Must pass end-to-end
```

**TDD Iron Law: NO NODE/SIMULATOR CODE WITHOUT FAILING TEST FIRST**

### Phase 5: Verify

**Invoke superpowers:verification-before-completion**

**Two-layer validation: Node tests + End-to-end workflow test**

**Layer 1: Validate individual artifacts:**
```bash
# Validate device
ace device validate <device-id>

# Validate nodes (unit test level)
ace node validate <node-id-1>
ace sandbox test <node-id-1>_test.py

ace node validate <node-id-2>
ace sandbox test <node-id-2>_test.py
# ... etc

# Test simulator
ace simulator test <device-id>
```

**Layer 2: Validate with simple test workflow (end-to-end):**
```bash
# Create minimal test workflow chaining all nodes
ace workflow create --device <device-id> --name "test_<device-id>" --nodes "<node1>,<node2>,..."

# Dry-run first
ace run workflow test_<device-id> --dry-run

# Full test workflow execution
ace run workflow test_<device-id>

# All nodes must pass both unit test AND workflow integration test
```

### Phase 6: Evolution & Sharing

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

## Deliverables

| Artifact | Location | Hub Path | Purpose |
|----------|----------|----------|---------|
| Device definition | `~/.ace/store/devices/<id>/` | `ace-hub/devices/<id>/` | Capability contract |
| SKILL.md | `~/.ace/store/devices/<id>/SKILL.md` | `ace-hub/devices/<id>/SKILL.md` | API documentation |
| Simulator | `src/core/simulator/<id>.py` or `~/.ace/store/simulators/` | `ace-hub/simulators/<id>/` | Testing & validation |
| Atomic nodes | `~/.ace/store/nodes/atomic/<id>_*/` | `ace-hub/nodes/<id>_*/` | Reusable operations |
| Workflows | `~/.ace/store/workflows/<id>.json` | `ace-hub/workflows/<id>/` | Ready-to-run workflows |
| Memory | `~/.ace/store/devices/<id>/memory/` | `ace-hub/devices/<id>/memory/` | Device-specific data |
| Insights | `~/.ace/insights/device-<id>*.md` | - | Patterns for future |

## Interaction Flow Example

**User:** "I need to onboard a new TEM instrument."

**Agent:** "I'll help you onboard the TEM. Let me start by clarifying a few things...

1. What specific TEM model are you working with?"

**User:** "It's a JEOL JEM-ARM200F."

**Agent:** "Got it. Let me check ace-hub for similar devices...
```bash
ace hub list --type devices --filter JEOL
```
[Shows results or 'No matches found']

What manuals or documentation do you have available?"

**User:** "I have the user manual PDF and a Python SDK from JEOL."

**Agent:** "Great. What's your goal - full automation, human-in-the-loop, or building future capability?"

**User:** "We want to automate sample screening workflows."

**Agent:** "Any safety constraints or dangerous operations I should know about?"

**User:** "High voltage operations and beam alignment need careful handling."

**Agent:** "Understood. Based on this, I propose 3 onboarding approaches:

[Option A, B, C as described in Phase 2]

Which approach fits your needs?"

**User:** "Option C - hybrid approach."

**Agent:** "Perfect. Starting with Option C - Hybrid approach.

**Phase 3: Plan**

Let me create a detailed onboarding plan and ingest the manual..."

[Continues through phases with specific CLI commands...]

## Canonical Statements

- "Before onboarding, let me check ace-hub for similar devices..."
- "Proposing 3 onboarding approaches (Full Sim / HITL / Hybrid)..."
- "Ingesting manuals: ace knowledge ingest..."
- "TDD: NO NODE CODE WITHOUT FAILING TEST FIRST"
- "RED: Writing failing test for node..."
- "GREEN: Building node to pass test..."
- "REFACTOR: Cleaning up while tests green..."
- "Validating: node unit test + simple workflow end-to-end test"
- "Running ace evolve to extract patterns..."
- "Pushing to ace-hub: ace hub push <id> --type device --commit"

## TDD Red Flags - STOP and Delete

- Node code written before test → Delete and start over with TDD
- Test passes immediately → Fix test, must fail first
- "Simulator too simple to test" → Test it anyway
- "I'll add tests after onboarding" → No. Test-first NOW
- "Node passes unit test but fails workflow" → Fix node until both pass
