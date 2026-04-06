---
description: "ACE Paradigm 1: Build and run workflows with evolution闭环 and ace-hub sharing"
---

# ACE Paradigm 1 - Run Workflow

Build, compose, and execute workflows/nodes using existing device abstractions with ace-hub sharing.
Inspired by superpowers philosophy: design → verify → evolve → share.

## When to Use

- User wants to **build** workflows or nodes
- User wants to **run** workflows on existing devices
- User wants to **compose** nodes into pipelines
- Device definitions already exist in `~/.ace/store/devices/` or ace-hub
- Want to share workflows with team via ace-hub

## Key Principles

**From Superpowers:**
- Clarify before building (one question at a time)
- Confirm before executing (is this what you want?)
- Verify at each step (type checking, validation)
- Iterate on failure (don't just fail, fix)

**From ACE:**
- Accumulate: Every execution → traces
- Composable: Nodes connect via typed ports
- Evolve: Insights have fitness, fit survives
- Share: Push to ace-hub for team collaboration

**Critical Rule:**
> **Phase 4 (Execute) for "run workflow" MUST use CLI command `ace run workflow <id>` for reproducibility.**

## 6-Phase Workflow

### Phase 1: Clarify Intent

Understand what user wants:
- Build new workflow/node?
- Run existing workflow?
- Modify existing workflow/node?
- Which device?

**Search existing resources:**
```bash
# Search ace-hub
ace hub list --type workflows
ace hub list --type workflows --device <device-id>

# Search local
ace workflow list
ace workflow list --device <device-id>
```

### Phase 2: Design

**Invoke superpowers:brainstorming**

**If "run workflow":**
1. Show matching workflows from hub + local
2. Confirm with user: "Is this the workflow you want to run?"
3. Pull workflow memory if on hub:
   ```bash
   ace hub pull <workflow-id> --type workflow
   ```
4. If NO match → switch to "build" mode

**If "build workflow":**
1. Explore existing nodes: `ace node list --device <device-id>`
2. Check device capabilities from SKILL.md
3. Propose 2-3 workflow topologies
4. Get user approval

**If "build node":**
1. Check device capabilities
2. Define input/output ports (JSON Schema)
3. Define prep/exec/post structure
4. Get user approval

### Phase 3: Plan

**Invoke superpowers:writing-plans**

**If "run workflow":**
- Check prerequisites (device connected, params valid)
- Load best params from memory if available:
  ```bash
  cat ~/.ace/store/workflows/<id>/memory/best_params.json
  ```

**If "build workflow":**
- List required node types
- Check node availability: `ace node list`
- If missing nodes → plan node building first

**If "build node":**
- Plan node structure
- Prepare test strategy

### Phase 4: Execute

**CRITICAL: Use CLI for reproducibility**

**If "run workflow":**
```bash
# MUST use CLI for reproducibility
ace run workflow <workflow-id> [--params '<json>']

# Example:
ace run workflow fibsem_acquire_dual_beam --params '{"resolution": "1024x768"}'
```

**If "build workflow":**
```bash
# Create workflow
ace workflow create --name <name> --device <device-id> --nodes '<node-list>'

# Or build from natural language
ace workflow build --description "acquire dual beam images" --device fibsem
```

**If "build node":**
```bash
ace node build --device <device-id> --description "<operation description>"
```

**If missing nodes detected:**
```bash
# Build missing nodes first
ace node build --device <device-id> --description "custom scan pattern"
# Then retry workflow
ace run workflow <workflow-id>
```

### Phase 5: Verify

**Invoke superpowers:verification-before-completion**

**Check execution results:**
```bash
# Check status
ace workflow status <execution-id>

# View results
ls ~/.ace/store/run/workflow/<workflow-id>/

# Check output files
ls ~/.ace/store/run/workflow/<workflow-id>/<execution-id>/
```

**Validate workflow structure (if built):**
```bash
ace workflow validate <workflow-id>
```

**Validate nodes (if built):**
```bash
ace node validate <node-id>
```

### Phase 6: Evolution & Sharing

**1. Extract patterns:**
```bash
ace evolve
```

**2. Save execution summary to memory:**
```bash
# Results automatically saved to:
# ~/.ace/store/workflows/<id>/memory/execution_history.json
```

**3. Push to ace-hub for sharing:**
```bash
# Push workflow with memory
ace hub push <workflow-id> --type workflow --commit

# Push new nodes
ace hub push <node-id> --type node
```

**4. Update insights (if patterns detected):**
- Promote to `~/.ace/insights/workflow-<id>*.md`
- Update fitness scores
