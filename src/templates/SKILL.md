# context-sync — shared agent memory

You are reading this because the user installed `context-sync`. Your job:

## READ (before answering)
1. Load `AGENTS.md` — tiny router with pinned facts + tag index.
2. Need more? Run:  `rg "<keyword>" AGENTS.d/`
3. Or open one chunk file:  `AGENTS.d/<tag>.md`
4. Never read all of `AGENTS.d/` at once — defeats the point.

## WRITE (when you learn something durable)
A durable fact = stack choice, bug cause, convention, user preference,
API contract, deploy quirk. NOT current task state or ephemeral TODOs.

1. Pick the right tag from the index (or create a new chunk file).
2. Grep first:  `rg "<key phrase>" AGENTS.d/<tag>.md` — skip if present.
3. Append ONE line to `AGENTS.d/<tag>.md`:
       #tag short fact under 120 chars
4. If you created a new tag, add one line to the index in AGENTS.md.
5. Never delete lines you didn't write this session. Append-only.

## PROJECT vs LOCAL
- `AGENTS.md` + `AGENTS.d/` → shared, committed.
- `AGENTS.local.md` + `AGENTS.d/local/` → personal, gitignored.
Read shared first, then local. Later overrides earlier.

## WHEN TO APPLY
- At session start of any coding task in a repo with AGENTS.md.
- When the user says "remember", "note that", "for next time".
- After debugging something non-obvious — write it down so next session knows.
