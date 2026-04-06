---
description: "ACE Paradigm 3: Develop ACE framework using superpowers chain + evolution闭环"
---

# ACE Paradigm 3 - ACE Development

Improve ACE framework using official superpowers skills, with ACE evolution闭环.

## When to Use

- User wants to improve ACE core (evolution/, composition/, workflow/)
- User wants to add new /ace:* commands
- User wants to enhance node/workflow framework
- User is modifying ACE source code
- Task targets ACE framework itself, not user workflows/devices

## Workflow

### Phase 1: Clarify

Understand development goals:
1. What part of ACE framework to improve?
2. What are the constraints and success criteria?
3. Any breaking changes to consider?

### Phase 2: Design (Superpowers)

**Invoke superpowers:brainstorming**
- Explore project context (ACE codebase)
- Ask clarifying questions
- Propose 2-3 approaches
- Present design sections
- Get user approval
- Write spec to `docs/superpowers/specs/YYYY-MM-DD-<feature>-design.md`

### Phase 3: Plan (Superpowers)

**Invoke superpowers:writing-plans**
- Create implementation plan
- Bite-sized tasks (2-5 min each)
- Exact file paths, complete code, test commands
- Save to `docs/superpowers/plans/YYYY-MM-DD-<feature>-plan.md`

### Phase 4: Execute (Superpowers)

**Invoke superpowers:executing-plans OR superpowers:subagent-driven-development**
- Execute tasks from plan
- Follow exact steps
- Run verifications
- Frequent commits

### Phase 5: Verify (Superpowers)

**Invoke superpowers:verification-before-completion**
- Run all tests
- Verify implementation matches spec
- Confirm no regressions

### Phase 6: Evolution闭环 (ACE)

**ACE Evolution Integration**
- Execution produces traces at `~/.ace/traces/`
- Run: `ace evolve`
- Create/update insights from development traces
- If patterns detected → promote to L2 insights
- Update CLAUDE.md if principles emerge

### Phase 7: Complete (Superpowers)

**Invoke superpowers:finishing-a-development-branch**
- Verify tests pass
- Present merge options
- Execute user choice

## Output Paths

- Specs: docs/superpowers/specs/YYYY-MM-DD-<feature>-design.md
- Plans: docs/superpowers/plans/YYYY-MM-DD-<feature>-plan.md
- Traces: ~/.ace/traces/ (auto-generated)
- Insights: ~/.ace/insights/ (auto-generated)
- Evolution: Run `ace evolve` after completion to extract patterns

## Key Principles

- Superpowers for development rigor (TDD, systematic, verifiable)
- ACE evolution for learning from development traces
- Both frameworks complement each other
- Run `ace evolve` after development to extract patterns from traces

## Canonical Statements

- "Developing ACE framework using superpowers with evolution闭环..."
- "Design phase: invoking superpowers:brainstorming..."
- "Execution phase: invoking superpowers:executing-plans..."
- "Evolution phase: extracting patterns from development traces..."
- "Evolution phase: running ace evolve to extract patterns..."
