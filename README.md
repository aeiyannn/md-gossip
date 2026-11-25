<p align="center">
  <img src="assets/logo.png" width="128" height="128" alt="agentgossip logo: a purple hash symbol wrapped by a sync arc">
</p>

<h1 align="center">agentgossip</h1>

<p align="center">
  <b>The place where your AI agents gossip.</b><br>
  One <code>AGENTS.md</code> every agent reads, writes, and contributes to.<br>
  Install once. They share what they learn. No scripts, no server, no telemetry.<br>
  Claude Code · Codex · OpenCode · Devin · Antigravity · Cursor · Copilot · Windsurf · Gemini · Cline · Continue · Zed · Aider
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square">
  <img alt="Written in TypeScript" src="https://img.shields.io/badge/written%20in-TypeScript-7C3AED?style=flat-square">
  <img alt="Zero runtime dependencies" src="https://img.shields.io/badge/runtime%20deps-0-7C3AED?style=flat-square">
  <img alt="No telemetry" src="https://img.shields.io/badge/no%20account-no%20telemetry-0A0A0A?style=flat-square">
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#supported-agents">Agents</a> ·
  <a href="#the-protocol">Protocol</a> ·
  <a href="#commands">Commands</a> ·
  <a href="#deploy-on-github">GitHub</a> ·
  <a href="#design-rules">Design</a> ·
  <a href="#contributing">Contribute</a>
</p>

---

## Highlights

<table>
<tr>
<td width="33%" valign="top">

### Universal
13 agents out of the box: Claude Code, Codex CLI, OpenCode, Devin (cloud + CLI), Google Antigravity, Cursor, GitHub Copilot, Windsurf, Gemini CLI, Cline, Continue.dev, Zed, Aider. Adding a new agent is one row in a registry.

</td>
<td width="33%" valign="top">

### Search-first
`AGENTS.md` stays tiny (~300 tokens) — a router with pinned facts and a tag index. All content lives in `AGENTS.d/*.md`. Agents grep on demand. Prompt caches stay warm, token cost stays flat regardless of project size.

</td>
<td width="33%" valign="top">

### Yours
No daemon, no sync server, no API, no telemetry, no account. Git is the sync layer. The CLI runs once per repo (or once globally) — after that, every agent reads and writes on its own.

</td>
</tr>
</table>

---

## Install

```sh
cd your-project
npx agentgossip install
git add AGENTS.md AGENTS.d/ .gitignore
git commit -m "add shared agent context"
git push
```

That's it. Every supported agent now reads `AGENTS.md` on session start and appends durable facts to `AGENTS.d/` as it learns them. Teammates clone the repo and their agents pick it up too — no install required on their side.

**Global install** (write once per machine, every project inherits):

```sh
npx agentgossip install --global
```

---

## How it works

```
your-repo/
├── AGENTS.md              ← tiny router. Pinned facts + tag index + protocol.
├── AGENTS.d/              ← one file per tag. Agents grep on demand.
│   ├── stack.md
│   ├── style.md
│   ├── bugs.md
│   ├── api.md
│   ├── deploy.md
│   └── prefs.md
├── CLAUDE.md              ← symlink → AGENTS.md (gitignored)
├── GEMINI.md               ← symlink → AGENTS.md (gitignored)
├── .cursor/rules/agentgossip.mdc        ← wrapper with alwaysApply (gitignored)
├── .continue/rules/agentgossip.md       ← wrapper with alwaysApply (gitignored)
├── .github/copilot-instructions.md       ← symlink (gitignored)
├── .windsurf/rules/context.md            ← wrapper (gitignored)
└── ...
```

Only `AGENTS.md` + `AGENTS.d/` are committed. Everything else is wired locally by each user running `install` once. Your repo stays clean on GitHub.

### The sync story

**Reads** happen natively. Every agent loads its own expected filename at session start — `install` pointed that filename at `AGENTS.md`. No command runs; the agent does it.

**Writes** happen when the agent edits files. The router header inside `AGENTS.md` tells it: *grep `AGENTS.d/`, append durable facts, dedup first.* Agents follow in-file instructions. They use their own edit tools.

**Sync across machines** is git. Agents append → commit → push → other agents `git pull` → next session sees the new facts. No daemon, no realtime layer.

---

## Supported agents

| Agent | Auto-read | Auto-write | Setup after install |
|---|:-:|:-:|---|
| Claude Code | ✓ | ✓ | none |
| OpenAI Codex CLI | ✓ | ✓ | none |
| OpenCode | ✓ | ✓ | none |
| Devin (cloud + CLI) | ✓ | ✓ | none — reads `AGENTS.md` from repo |
| Google Antigravity | ✓ | ✓ | none |
| Cursor | ✓ | ✓ (agent mode) | none |
| GitHub Copilot | ✓ | ✓ (agent mode) | none |
| Windsurf | ✓ | ✓ | none |
| Gemini CLI | ✓ | ✓ | none |
| Cline | ✓ | ✓ | none |
| Continue.dev | ✓ | ✓ (agent mode) | none |
| Zed | ✓ | ✓ | none |
| Aider | ✓ | ✓ | none — `install` edits `.aider.conf.yml` |

Adding a new agent = one row in [`src/adapters/registry.ts`](src/adapters/registry.ts). PRs welcome.

---

## The protocol

Every `AGENTS.md` ships with this header. Agents read it, follow it.

```
READ
1. Pinned facts (top of file) always apply.
2. Need more? Run: rg "<keyword>" AGENTS.d/
3. Or read one chunk: AGENTS.d/<tag>.md
4. Never read all of AGENTS.d/ at once — defeats the point.

WRITE (when you learn a durable fact)
1. Pick the right tag (or create a new chunk).
2. Grep first — skip if the fact already exists.
3. Append ONE line: `#tag short fact under 120 chars`.
4. Never delete lines you didn't write this session. Append-only.

LOCAL OVERRIDES
AGENTS.local.md and AGENTS.d/local/ are personal, gitignored.
Read shared first, then local. Later overrides earlier.
```

A durable fact looks like:

```
#stack  next.js 15, bun, postgres, drizzle
#bugs   win: `bun build` fails on CRLF — run `git config core.autocrlf input`
#prefs  terse answers, no trailing summaries
#api    /auth uses lucia, sessions in cookies not JWT
```

Grep-friendly. Human-readable. Diff-friendly in git. No embeddings, no RAG, no JSON blobs.

---

## Commands

```sh
agentgossip install                       # default — wires all adapters
agentgossip install --global              # also write to ~/.claude, ~/.codex, etc.
agentgossip install --only claude-code,opencode,devin
agentgossip install --force               # overwrite existing wrappers
agentgossip install --skip-agents-md      # wire adapters without touching AGENTS.md

agentgossip status                        # show what's wired
agentgossip clean                         # remove generated links/skills
agentgossip clean --global                # also clean user-level files
```

Aliased as `gossip`.

---

## Deploy on GitHub

The install is designed for clean repos.

- **Committed:** `AGENTS.md`, `AGENTS.d/*.md`, `.gitignore` entries.
- **Gitignored:** every per-agent symlink, wrapper, and skill file.
- **Gitignored automatically:** `AGENTS.local.md` and `AGENTS.d/local/` for personal overrides.

GitHub's file tree shows only the router and the chunks. Teammates not using `agentgossip` still see the shared context — GitHub renders `AGENTS.md` fine and most agents read it natively even without local wiring.

---

## Design rules

The project follows three hard rules. If you contribute, follow them too.

| | |
|---|---|
| **Zero runtime dependencies** | Node stdlib only. devDeps are `typescript` + `@types/node`. If a feature needs a package, question whether the feature needs to exist. |
| **Search-first, not load-first** | `AGENTS.md` stays small and cache-friendly. Chunks live in `AGENTS.d/` and agents grep them. Features that stuff large payloads into context get rejected. |
| **Protocol-in-file beats protocol-in-code** | The header text inside `AGENTS.md` IS the skill. Native skill files (Claude, OpenCode, etc.) are polish. A read-only agent that only sees the file still participates. |

### What's out of scope

RAG, embeddings, realtime sync daemons, web dashboards, telemetry, enterprise edition, per-agent API integrations (Devin Knowledge sync, Cursor settings sync), auto-conflict resolution. These stay closed on the tracker.

---

## How it's built

TypeScript workspace, strict mode, ESM, no bundler.

| Module | What it does |
|---|---|
| `src/cli.ts` | Argument parsing, command dispatch |
| `src/adapters/registry.ts` | One `Adapter` object per agent |
| `src/adapters/skillFormats.ts` | Render skill body with the right frontmatter per agent |
| `src/commands/install.ts` | The main command: seed `AGENTS.md`, wire targets, write skills, update `.gitignore` |
| `src/commands/status.ts` | Report what's wired per adapter |
| `src/commands/clean.ts` | Remove generated files; never touch `AGENTS.md` |
| `src/core/fs.ts` | `linkOrCopy` — symlink with copy fallback on Windows |
| `src/core/gitignore.ts` | Marker-block upsert in `.gitignore` |
| `src/core/wrappers.ts` | Frontmatter wrappers for Cursor `.mdc`, Windsurf rule, Continue rule |
| `src/templates/` | `AGENTS.md`, `AGENTS.d/*.md`, `SKILL.md` |

**Quality gates:**
- `tsc --strict` with `noUncheckedIndexedAccess`.
- 10 smoke tests covering install, idempotency, collision preservation, wrapper rendering, YAML safety.
- CI: Ubuntu / macOS / Windows × Node 18 / 20 / 22.

---

## Get started

Building needs Node 18 or later.

```sh
git clone https://github.com/<you>/agentgossip
cd agentgossip
npm install
npm run build
npm test
```

Run the CLI from source:

```sh
node bin/agentgossip.js install --help
```

---

## Contributing

1. **Open an issue first** for feature ideas — the scope is deliberately locked.
2. **Add a new agent** by appending to `src/adapters/registry.ts` and adding a smoke test. No other files should need to change unless the agent needs a new wrapper type.
3. **No new runtime deps.** Ever.
4. **Match the house style.** No comments unless the *why* is non-obvious. Small named functions. Strict types on exported functions.

---

## License

MIT — see [LICENSE](LICENSE). Copyright © 2026 the agentgossip contributors.

<p align="center">
  <img src="assets/logo.png" width="32" height="32" alt="agentgossip"><br>
  <sub>One file. Every agent. Done.</sub>
</p>
