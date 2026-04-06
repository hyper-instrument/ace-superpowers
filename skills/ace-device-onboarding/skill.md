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

### Phase 4: Execute

Execute CLI commands to create artifacts:

**1. Create Device Definition:**
```bash
ace device create <device-id> --from-spec device_spec.json
```

**2. Build Atomic Nodes:**
```bash
# For each atomic operation
ace node build --device <device-id> --description "connect to device"
ace node build --device <device-id> --description "set parameter X"
# ... etc
```

**3. Create Simulator (if applicable):**
```bash
ace simulator create <device-id> [--type <sim-type>]
```

**4. Create Initial Workflows:**
```bash
ace workflow create --device <device-id> --name "basic_operation"
```

### Phase 5: Verify

**Invoke superpowers:verification-before-completion**

Validate all artifacts:

```bash
# Validate device
ace device validate <device-id>

# Validate nodes
ace node validate <node-id-1>
ace node validate <node-id-2>
# ... etc

# Test simulator
ace simulator test <device-id>

# Dry-run workflow
ace run workflow <workflow-id> --dry-run
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
