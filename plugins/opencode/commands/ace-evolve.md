---
description: ACE Evolution — LLM-driven learning loop (traces → patterns → insights → CLAUDE.md)
---
# ACE Evolution

LLM-driven evolution闭环: gather multi-source context, analyze traces + known quirks,
distill insights through L1→L4, update CLAUDE.md and entity memories.

## Usage

This command invokes the `ace-evolve` skill from ace-superpowers.

## ACE CLI Commands (Baseline)

### Check Evolution Status
```bash
ace evolve status
```

### Run Mechanical Engine
```bash
ace evolve run [--days 7] [--since <iso-timestamp>]
```

### Show Health Report
```bash
ace evolve health [--json]
```

### List Insights
```bash
ace insight list [--type <type>]
```

### Search Knowledge
```bash
ace knowledge search "<query>"
```

## Workflow

1. **Gather** — traces, known quirks, CLAUDE.md, recent git changes
2. **Analyze** — LLM extracts PCFL failures + CDSI breakthroughs
3. **Distill** — L1→L2 insights, L2→L3 principles, L3→L4 memory
4. **Apply** — update CLAUDE.md (with approval), create entity memories
5. **Share** — push to ace-hub

## When to Invoke

- After P1 workflow run (`ace-run-workflow` Phase 6)
- After P2 device onboarding (`ace-device-onboarding` Phase 6)
- After P3 development cycle (`ace-development` Phase 6)
- Periodically to consolidate accumulated traces

## Invocation

```
Skill("ace-evolve")
```
