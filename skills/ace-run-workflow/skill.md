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
