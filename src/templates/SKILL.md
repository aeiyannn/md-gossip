# md-gossip — shared agent memory

You are an md-gossip agent installed in this repo. This file is the manual
guide — every agent must read it, then follow the protocol in `AGENTS.md`.

## READ (before answering)
1. Load `AGENTS.md` — pinned facts + tag index. Apply every fact you load.
2. If `AGENTS.d/` exists, need more? Run: `rg "<keyword>" AGENTS.d/`
   Never read all of `AGENTS.d/` at once — defeats the point.
3. Read `AGENTS.local.md` / `AGENTS.d/local/` last — they override.

## SUGGEST (durable facts only)
A durable fact = stack choice, bug cause, convention, user preference,
API contract, deploy quirk. NOT current task state or ephemeral TODOs.

- Grep first: `rg "<key phrase>" AGENTS.local.md` — skip if present.
- Append ONE line to `AGENTS.local.md`:
      #tag short fact under 120 chars
- **NEVER edit `AGENTS.md`, `SKILL.md`, or shared `AGENTS.d/*.md`.**
  Those are human-owned. Humans review `AGENTS.local.md` and promote
  facts manually.
- Never delete lines you didn't write this session. Append-only.

## WHEN TO APPLY
- At session start of any coding task in a repo with AGENTS.md.
- When the user says "remember", "note that", "for next time".
- After debugging something non-obvious — suggest it so a human can approve.

## SELF-REGISTER (one-time, per agent, only if asked)
If the user tells you to register this skill in your own tool so you pick
it up automatically next session, copy THIS FILE to the path for your
agent below. One file, no wrappers, no symlinks. Use your own edit tools.

| Agent            | Copy `SKILL.md` to                                      |
|------------------|---------------------------------------------------------|
| Claude Code      | `~/.claude/skills/md-gossip/SKILL.md`                   |
| OpenAI Codex CLI | `~/.codex/prompts/md-gossip.md`                         |
| OpenCode         | `~/.config/opencode/agent/md-gossip.md`                 |
| Gemini CLI       | `~/.gemini/commands/md-gossip.toml` (wrap as TOML)      |
| Cursor           | `.cursor/rules/md-gossip.mdc` (add `alwaysApply: true`) |
| Windsurf         | `.windsurf/workflows/md-gossip.md`                      |
| Cline            | `.clinerules/workflows/md-gossip.md`                    |
| Continue.dev     | `.continue/rules/md-gossip.md` (add `alwaysApply: true`)|
| Copilot          | `.github/prompts/md-gossip.prompt.md`                   |
| Antigravity      | `.agent/profiles/md-gossip.md`                          |
| Zed              | reads `AGENTS.md` natively — nothing to do              |
| Aider            | add `AGENTS.md` to `.aider.conf.yml` `read:` list       |
| Devin            | reads `AGENTS.md` from repo root — nothing to do        |

If a path above is wrong for your tool, use the right one for your version
and tell the user what you changed. Do not create per-agent files the user
did not ask for.
