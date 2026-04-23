---
description: Initialize ACE in current project — pick paradigm scope + install CLAUDE.md/hooks
---

# ACE Init — Initialize ACE in Current Project

Initialize ACE support in the current project directory. This configures a per-project filesystem scope (via `.claude/settings.local.json`) sized for whichever paradigm the human partner is working in, installs paradigm progress hooks, and drops a correctly-pathed `CLAUDE.md`.

## Workflow

**Step 1. Ask the human partner which paradigm this project is for.** Use `AskUserQuestion` with exactly these options — do not substitute prose or skip the question:

```
Question: Which ACE paradigm is this project for? (Controls filesystem write scope + defaults the session to plan-mode.)
Options:
  - "P1 — Run Workflow": Building/running workflows on existing devices. Edits confined to CWD + ~/.ace/.
  - "P2 — Device Onboarding": Ingesting manuals/SDK, creating a new device. Edits confined to CWD + ~/.ace/.
  - "P3 — ACE Development": Improving the ACE framework itself. Edits confined to CWD + ~/.ace/ + the ACE source root.
  - "None — skip scope lock": Don't restrict filesystem scope. Pick this only if the human partner is doing something that spans all three.
```

**Step 2. Map the choice to a flag value:**
- "P1 …" → `--paradigm P1`
- "P2 …" → `--paradigm P2`
- "P3 …" → `--paradigm P3`
- "None …" → `--paradigm none`

**Step 3. Run the CLI with the chosen flag:**

```bash
ace init --paradigm <choice>
```

## What `ace init --paradigm <P>` Does

1. Reads ACE root directory from `~/.ace/config.json` (set during `make install`).
2. Copies project-level configs (`.claude/`, `.opencode/`) into the current directory.
3. Writes **`.claude/settings.local.json`** with the paradigm's filesystem scope:
   - `permissions.defaultMode: "plan"` — forces `EnterPlanMode` before any mutation tool
   - `permissions.additionalDirectories` — paths outside CWD the session may touch (`~/.ace/` for P1/P2; plus ACE source root for P3)
   - `permissions.deny` — shared-hazard rules (`Bash(sudo *)`, `Edit(/etc/**)`, …) plus a couple of P2-only `curl|sh`/`wget|sh` blocks
4. Installs per-project paradigm progress hooks into `.claude/settings.json` (SessionStart, UserPromptSubmit, PostToolUse, and the Branch A+B PreToolUse gate).
5. Copies the `ace-p2-*` subagent definitions into `.claude/agents/` so the main agent can `Task(subagent_type="ace-p2-<phase>")` to delegate P2 phases.
6. Writes a sidecar `.claude/ace-scope.json` recording exactly which entries ACE added, so re-running `ace init --paradigm <other>` or `ace init --paradigm none` cleans up only the ACE entries without touching the human partner's hand-added rules.

## Why `AskUserQuestion` (not `click.prompt`)

When the user invokes `/ace-init` in Claude Code, there is no interactive stdin for the subprocess to read. `AskUserQuestion` is the only reliable way to surface a structured choice. The CLI's `click.prompt` fallback is only used when someone runs `ace init` directly in their own shell.

## Skipping the scope lock

If the human partner wants to skip the scope — e.g. they're triaging across multiple paradigms or rebuilding the whole store — choose "None" in step 1. That runs `ace init --paradigm none`, which removes any previously-applied ACE scope entries from `settings.local.json` (tracked via the sidecar) and leaves the session unrestricted.

## Requirements

- ACE must be installed via `make install` (which saves the ACE root path to `~/.ace/config.json`).
- ace-superpowers must be reachable (via `ACE_SUPERPOWERS_PATH`, `~/.ace/config.json:superpowers_path`, or a sibling directory) or the paradigm hooks/subagents install step will be skipped with a warning.

## Result

After `/ace-init` completes, the human partner has:
- `CLAUDE.md` in the project root with correct absolute paths to ACE documentation.
- `.claude/settings.json` with paradigm progress + Branch A+B gate hooks registered.
- `.claude/settings.local.json` with the paradigm's filesystem scope.
- `.claude/agents/ace-p2-*.md` subagent definitions (for P2).
- Full access to ACE paradigms and workflows.

## Manual Fallback

If `AskUserQuestion` is unavailable for some reason, the human partner can run `ace init --paradigm <P1|P2|P3|none>` directly from the terminal.

## Invocation

```
Skill("ace-init")
```
