<p align="center">
  <img src="assets/logo.png" width="112" height="112" alt="md-gossip logo">
</p>

<h1 align="center">md-gossip</h1>

<p align="center">
  <b>One <code>AGENTS.md</code> + one <code>SKILL.md</code>. Every AI coding agent reads them.</b><br>
  Agents suggest facts. Humans approve. Git syncs. No server, no telemetry.
</p>

<p align="center">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-7C3AED?style=flat-square">
  <img alt="0 runtime deps" src="https://img.shields.io/badge/deps-0-7C3AED?style=flat-square">
</p>

---

## For agents reading this repo

> Read [`SKILL.md`](SKILL.md) then [`AGENTS.md`](AGENTS.md). Follow the protocol. Append durable facts to `AGENTS.local.md` only. Never edit the shared files.

## For humans

**Pick a path. All three work.**

**A. No install — just point your agent here.** Paste this to Claude / Devin / Codex / Cursor:

> Read `SKILL.md` and `AGENTS.md` at **https://github.com/aeiyannn/md-gossip** and follow the protocol. Append durable facts to `AGENTS.local.md`.

**B. Add to your project.**

```sh
npx md-gossip install
git add AGENTS.md SKILL.md .gitignore && git commit -m "add md-gossip" && git push
```

Teammates clone — their agents pick it up. No action required on their side.

**C. One-time per machine.**

```sh
npx md-gossip install --agents --global
```

Writes to `~/.claude/`, `~/.codex/`, `~/.gemini/`, etc. Every project inherits.

---

## What ends up in your repo

```
AGENTS.md          ← read-only protocol. Pinned facts + tag index.
SKILL.md           ← read-only manual every agent follows.
AGENTS.d/          ← optional chunks (stack.md, bugs.md, …). Humans own these.
AGENTS.local.md    ← agents write here. Gitignored. You review + promote.
```

Only `AGENTS.md`, `SKILL.md`, `AGENTS.d/` get committed. Everything else stays local.

## Supported agents

Claude Code · Codex · OpenCode · Devin · Antigravity · Cursor · Copilot · Windsurf · Gemini CLI · Cline · Continue · Zed · Aider

All read `AGENTS.md` either natively or via `install --agents` (writes the right pointer file per agent). Run `md-gossip status` to see what's wired. Adding a new agent = one row in [`src/adapters/registry.ts`](src/adapters/registry.ts).

## The whole protocol in 20 lines

```
READ
  AGENTS.md pinned facts always apply.
  Need more? rg "<keyword>" AGENTS.d/
  Read AGENTS.local.md last — it overrides.

SUGGEST (durable facts only — stack, bugs, conventions, prefs)
  Grep AGENTS.local.md first. Skip if present.
  Append ONE line: `#tag short fact under 120 chars`.

FORBIDDEN
  Editing AGENTS.md, SKILL.md, or shared AGENTS.d/*.md.
  Creating files other than AGENTS.local.md.
  Deleting lines you didn't write this session.

PROMOTION
  Human reviews AGENTS.local.md, moves approved lines to AGENTS.d/<tag>.md,
  commits, pushes. Next session, every teammate's agent sees them.
```

## Commands

```sh
md-gossip install [--agents] [--global] [--only a,b] [--force] [--minimal]
md-gossip prompt [agent]     # paste-in prompt for a specific agent
md-gossip status             # show what's wired
md-gossip clean [--global]   # undo
```

Aliased as `gossip`.

## Build from source

```sh
git clone https://github.com/aeiyannn/md-gossip && cd md-gossip
npm install && npm run build && npm test
```

Zero runtime deps. Strict TypeScript. 13 smoke tests. CI on Linux/macOS/Windows × Node 18/20/22.

## License

MIT — © 2026 md-gossip contributors.

<p align="center">
  <img src="assets/logo.png" width="24" height="24" alt=""><br>
  <sub>Agents gossip. Humans decide.</sub>
</p>
