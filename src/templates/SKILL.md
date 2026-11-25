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
