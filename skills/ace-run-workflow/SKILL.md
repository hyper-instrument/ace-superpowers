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
- **TDD for node building**: When creating new nodes, write test first, then build node to pass test

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
- If missing nodes → plan node building first with TDD

**If "build node":**
- Plan node structure
- **Prepare TDD test strategy** - Write test BEFORE code
- Define expected input/output for tests

### Phase 4: Execute

**If "run workflow" (NO TDD needed - just run):**
```bash
# MUST use CLI for reproducibility
ace run workflow <workflow-id> [--params '<json>']

# Example:
ace run workflow fibsem_acquire_dual_beam --params '{"resolution": "1024x768"}'
```

**If "build node" (TDD REQUIRED):**

**RED - Write Failing Test:**
```bash
# Create test FIRST - node doesn't exist yet
ace node test --create <node-id>_test.py --description "<operation description>"
# Verify test FAILS (expected - node not implemented)
ace sandbox test <node-id>_test.py
```

**GREEN - Build Node to Pass Test:**
```bash
# Build node to make test pass
ace node build --device <device-id> --description "<operation description>"
# Verify test PASSES
ace sandbox test <node-id>_test.py
```

**REFACTOR - Clean Up:**
```bash
# Improve node while test stays green
ace node validate <node-id>
ace sandbox test <node-id>_test.py  # Must still pass
```

**If "build workflow":**
```bash
# First: Build any missing nodes with TDD (see above)
# Then: Create workflow from nodes
ace workflow create --name <name> --device <device-id> --nodes '<node-list>'

# Or build from natural language
ace workflow build --description "acquire dual beam images" --device fibsem
```

**If missing nodes detected (TDD for each):**
```bash
# RED: Write failing test for missing node
ace node test --create <missing-node>_test.py --description "custom scan pattern"
ace sandbox test <missing-node>_test.py  # Must fail

# GREEN: Build node to pass test
ace node build --device <device-id> --description "custom scan pattern"
ace sandbox test <missing-node>_test.py  # Must pass

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

**Invoke `superpowers:ace-evolve`** for LLM-driven evolution闭环.

The `ace-evolve` skill will:
1. Gather context (traces, known quirks, existing insights)
2. Analyze patterns with LLM (PCFL failures, CDSI breakthroughs)
3. Distill and promote insights (L1→L2→L3→L4)
4. Apply changes (update CLAUDE.md, create entity memories)
5. Share evolution artifacts to ace-hub (with HITL approval)

**After ace-evolve completes, push built artifacts to ace-hub:**

**HITL gate:** call `AskUserQuestion` before each `ace hub push`.

```bash
# Push workflow with memory
ace hub push <workflow-id> --type workflow --commit

# Push new nodes (if built during this session)
ace hub push <node-id> --type node
```

## Memory Management

Memory is automatically synced between local store and ace-hub:

| Memory Type | Local Path | Hub Path | Sync Command |
|------------|------------|----------|--------------|
| Workflow Memory | `~/.ace/store/workflows/<id>/memory/` | `ace-hub/workflows/<id>/memory/` | `ace hub pull/push` |
| Node Memory | `~/.ace/store/nodes/<id>/memory/` | `ace-hub/nodes/<id>/memory/` | `ace hub pull/push` |
| Device Memory | `~/.ace/store/devices/<id>/memory/` | `ace-hub/devices/<id>/memory/` | `ace hub pull/push` |

**Memory folder contents:**
- `execution_history.json` - Past executions with params and results
- `best_params.json` - Optimized parameter combinations
- `common_failures.md` - Known issues and solutions
- `optimization_tips.md` - Performance recommendations

## Interaction Flow Examples

### Example 1: Run Workflow (Match Found)

```
User: /ace run workflow for image acquisition

Agent: → Searching ace-hub and local store...
```bash
ace hub list --type workflows
ace workflow list
```
→ Found 2 workflows:
  1. fibsem_acquire_dual_beam - Dual beam image acquisition
  2. tem_high_throughput - TEM high throughput imaging

→ Pulling workflow memory from hub...
```bash
ace hub pull fibsem_acquire_dual_beam --type workflow
```

→ Is #1 what you need? (Y/n/details)

User: Y

Agent: → Executing via CLI for reproducibility...
```bash
ace run workflow fibsem_acquire_dual_beam
```
→ Execution complete. Traces captured.
→ Invoking ace-evolve skill for LLM-driven evolution...
```

### Example 2: Run Workflow (No Match → Build)

```
User: /ace run workflow for my custom experiment

Agent: → No matching workflow found locally or on ace-hub.
→ Let's build one. What device are you using?

[Build workflow flow...]

Agent: → Building workflow...
```bash
ace workflow build --description "custom experiment" --device <device-id>
```

→ Workflow built. Now executing via CLI...
```bash
ace run workflow <new-workflow-id>
```
```

### Example 3: Run Workflow (Missing Nodes)

```
User: /ace build workflow for STM scanning

Agent: → Design: STM raster scan with grid resolution
→ Required nodes:
  ✓ stm_connect (exists)
  ✓ stm_set_bias (exists)
  ✗ stm_custom_scan (missing)

→ Node stm_custom_scan doesn't exist. Building it now...
```bash
ace node build --device stm --description "custom scan pattern"
```

→ Node built. Pushing to hub...
```bash
ace hub push stm_custom_scan --type node
```

→ Continuing workflow composition...
```bash
ace workflow create --nodes "stm_connect,stm_set_bias,stm_custom_scan"
ace run workflow <workflow-id>
```
```

## Reproducibility Guarantee

**Why CLI execution is required:**

1. **Recorded Execution**: `ace run workflow` saves full context to `~/.ace/store/run/workflow/<id>/`
2. **Version Control**: Execution params, ace version, timestamp all recorded
3. **Reproducible**: Same command produces same results (deterministic workflows)
4. **Traceable**: Every execution captured in traces for analysis

**Never do this:**
```python
# BAD - Direct API call, not reproducible
result = workflow_engine.execute(workflow_def)
```

**Always do this:**
```bash
# GOOD - CLI execution, fully reproducible
ace run workflow <workflow-id> --params '<json>'
```

## Canonical Statements

- "Let me search ace-hub and local store for matching workflows..."
- "Pulling workflow memory from ace-hub..."
- "Is this the workflow you want to run?"
- "Missing nodes detected. Building with TDD..."
- "TDD: Writing failing test for node..."
- "TDD: Building node to pass test..."
- "Executing workflow via CLI for reproducibility: ace run workflow <id>..."
- "Invoking superpowers:ace-evolve for LLM-driven evolution..."
- "Pushing execution memory to ace-hub: ace hub push <id> --type workflow --commit"

## TDD Red Flags - STOP and Delete

- Node code written before test → Delete and start over
- Test passes immediately → Fix test, must fail first
- "Node is too simple to test" → Test it anyway
- "I'll add tests after building workflow" → No. Test-first NOW
