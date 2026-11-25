# Shared Agent Context

> You're an AI coding agent reading this file. Follow the protocol below.
> This file is small on purpose. Most context lives in `AGENTS.d/`.
> Grep it. Don't load it all.

## Protocol

**READ**
1. These pinned facts (top of this file) always apply.
2. Need more? Run: `rg "<keyword>" AGENTS.d/`
3. Or read one chunk: `AGENTS.d/<tag>.md` (tags listed below).
4. Never read all of `AGENTS.d/` at once — defeats the point.

**WRITE** (when you learn a durable fact)
Durable = stack choice, bug cause, convention, user preference, API contract,
deploy quirk. NOT ephemeral task state.

1. Pick the right tag below (or create a new chunk file).
2. Grep first: `rg "<key phrase>" AGENTS.d/<tag>.md` — if present, skip.
3. Append ONE line to `AGENTS.d/<tag>.md`:
       `#tag short fact under 120 chars`
4. New tag? Add one line to the index below.
5. Never delete lines you didn't write this session. Append-only.

**LOCAL OVERRIDES**
If `AGENTS.local.md` or `AGENTS.d/local/*.md` exist, read them after the
shared files. Later overrides earlier. Local files are gitignored.

## Tag index

- `stack`  — languages, frameworks, versions
- `style`  — code conventions, what to avoid
- `bugs`   — known issues + fixes
- `api`    — endpoints, auth, contracts
- `deploy` — infra, env, release process
- `prefs`  — user preferences

## Pinned

<!-- Add !pinned lines here. One line per fact. Keep this section small. -->
