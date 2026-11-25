<p align="center">
  <img src="assets/logo.png" width="128" height="128" alt="md-gossip logo: a purple hash symbol wrapped by a sync arc">
</p>

<h1 align="center">md-gossip</h1>

<p align="center">
  <b>The place where your AI agents gossip.</b><br>
  Two files — <code>AGENTS.md</code> + <code>SKILL.md</code> — every agent reads and follows.<br>
  Agents propose facts; humans approve. Git is the sync layer. No scripts, no server, no telemetry.<br>
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
`AGENTS.md` stays tiny — a router with pinned facts and a tag index. Optional detail lives in `AGENTS.d/*.md`, created on demand. Agents grep on demand. Prompt caches stay warm, token cost stays flat regardless of project size.

</td>
<td width="33%" valign="top">

### Yours
No daemon, no sync server, no API, no telemetry, no account. Git is the sync layer. The CLI runs once per repo (or once globally) — after that, every agent reads and writes on its own.

</td>
</tr>
</table>

---

## For AI agents

> **If you are an AI coding agent (Claude, Devin, Antigravity, OpenCode, Cursor, or any other) reading this repo: read [`SKILL.md`](SKILL.md) and [`AGENTS.md`](AGENTS.md) before doing any work, and follow their protocol.**
>
> Both files are read-only for you. Suggest durable facts in `AGENTS.local.md` only — never edit `AGENTS.md`, `SKILL.md`, or shared `AGENTS.d/` files. A human reviews and approves.

---

## Install

```sh
cd your-project
npx md-gossip install
git add AGENTS.md SKILL.md .gitignore
git commit -m "add shared agent context"
git push
```

That's it — install creates just **two files**: `AGENTS.md` (the protocol) and `SKILL.md` (the manual guide). `AGENTS.d/` is optional and created on demand. Every supported agent reads `AGENTS.md` on session start and suggests durable facts via `AGENTS.local.md` (gitignored, human-reviewed). Teammates clone the repo and their agents pick it up too — no install required on their side.

**Global install** (write once per machine, every project inherits):

```sh
npx md-gossip install --agents --global
```

---

## How it works

```
your-repo/
├── AGENTS.md              ← tiny router. Pinned facts + tag index + protocol.
├── SKILL.md               ← manual guide every agent reads (the rules)
├── AGENTS.d/              ← OPTIONAL. One file per tag, created on demand.
│   ├── stack.md
│   ├── style.md
│   ├── bugs.md
│   ├── api.md
│   ├── deploy.md
│   └── prefs.md
├── AGENTS.local.md        ← agent suggestions, gitignored, human-reviewed
└── ...                    ← agent pointer files only with `install --agents`
```

Only `AGENTS.md` + `SKILL.md` (+ `AGENTS.d/` if you create it) are committed. Everything else is wired locally by each user running `install` once. Your repo stays clean on GitHub.

### The sync story

**Reads** happen natively. Every agent that supports `AGENTS.md` loads it at session start — it points to `SKILL.md`, the manual guide. Agents that don't read `AGENTS.md` natively get a one-line paste-in prompt via `md-gossip prompt <agent>`. No command runs; the agent does it.

**Writes** are suggestions only. When an agent learns a durable fact, it appends one line to `AGENTS.local.md` — gitignored, never committed. `AGENTS.md`, `SKILL.md`, and shared `AGENTS.d/` chunks are read-only for agents.

**Human approval** closes the loop. You review `AGENTS.local.md`, promote approved facts into `AGENTS.d/<tag>.md` (or the Pinned section), commit, push — and every teammate's agent picks it up on next session. Agents propose, humans approve.

---

## Supported agents

| Agent | Reads AGENTS.md | Notes |
|---|:-:|---|
| Claude Code | ✓ | or paste `md-gossip prompt claude-code` into memory |
| OpenAI Codex CLI | ✓ | |
| OpenCode | ✓ | |
| Devin (cloud + CLI) | ✓ | reads `AGENTS.md` from repo root |
| Google Antigravity | ✓ | |
| Cursor | via `.cursor/rules` | `install --agents` writes the wrapper, or paste the prompt |
| GitHub Copilot | via copilot-instructions | `install --agents` or paste the prompt |
| Windsurf | via rules | `install --agents` or paste the prompt |
| Gemini CLI | ✓ | `GEMINI.md` wired with `--agents` |
| Cline | via `.clinerules` | `install --agents` or paste the prompt |
| Continue.dev | via rules | `install --agents` or paste the prompt |
| Zed | ✓ | reads `AGENTS.md` natively |
| Aider | via `.aider.conf.yml` | `install --agents` adds it to `read:` |

Agents that don't read `AGENTS.md` natively still work: run `md-gossip prompt <agent>` and paste the output into that agent's instructions/rules settings — or use `install --agents` to write pointer files automatically.

Adding a new agent = one row in [`src/adapters/registry.ts`](src/adapters/registry.ts). PRs welcome.

---

## The protocol

Every `AGENTS.md` ships with this header. Agents read it, follow it.

```
READ SKILL.md + AGENTS.md first — every session, before writing code.

READ (details)
1. Pinned facts (top of AGENTS.md) always apply.
2. If AGENTS.d/ exists: need more? Run: rg "<keyword>" AGENTS.d/
3. Or read one chunk: AGENTS.d/<tag>.md
4. Never read all of AGENTS.d/ at once — defeats the point.
5. Read AGENTS.local.md / AGENTS.d/local/ last — they override.

SUGGEST (durable facts only — agents NEVER edit shared files)
1. Grep AGENTS.local.md first — skip if the fact already exists.
2. Append ONE line: `#tag short fact under 120 chars`.
3. Humans review AGENTS.local.md and promote facts manually.

FORBIDDEN
- Editing AGENTS.md, SKILL.md, or shared AGENTS.d/*.md.
- Creating files other than AGENTS.local.md / AGENTS.d/local/*.md.
- Deleting lines you didn't write this session.
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
md-gossip install                       # default — AGENTS.md + SKILL.md only
md-gossip install --agents              # also wire per-agent pointer files
md-gossip install --agents --only claude-code,cursor
md-gossip install --agents --skills     # also write per-agent skill files
md-gossip install --agents --global     # also write to ~/.claude, ~/.codex, etc.
md-gossip install --agents --force      # overwrite existing files
md-gossip install --minimal             # leanest: AGENTS.md only
md-gossip install --skip-agents-md      # seed files without touching AGENTS.md

md-gossip prompt [agent]                # print a paste-in prompt for any agent
md-gossip status                        # show what's wired
md-gossip clean                         # remove generated links/skills
md-gossip clean --global                # also clean user-level files
```

Aliased as `gossip`.

---

## Deploy on GitHub

The install is designed for clean repos.

- **Committed:** `AGENTS.md`, `SKILL.md`, `AGENTS.d/*.md` (if created), `.gitignore` entries.
- **Gitignored:** `AGENTS.local.md`, `AGENTS.d/local/`, and every per-agent pointer/skill file.

GitHub's file tree shows only the two md files — clean for humans and agents alike. Teammates not using `md-gossip` still see the shared context — GitHub renders `AGENTS.md` fine and most agents read it natively even without local wiring.

---

## Design rules

The project follows three hard rules. If you contribute, follow them too.

| | |
|---|---|
| **Zero runtime dependencies** | Node stdlib only. devDeps are `typescript` + `@types/node`. If a feature needs a package, question whether the feature needs to exist. |
| **Search-first, not load-first** | `AGENTS.md` stays small and cache-friendly. Chunks live in `AGENTS.d/` and agents grep them. Features that stuff large payloads into context get rejected. |
| **Protocol-in-file beats protocol-in-code** | The header text inside `AGENTS.md` + `SKILL.md` IS the enforcement. Native skill files (Claude, OpenCode, etc.) are optional polish. A read-only agent that only sees the files still participates. |

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
| `src/commands/install.ts` | Seed `AGENTS.md` + `SKILL.md`, optionally wire agents, update `.gitignore` |
| `src/commands/prompt.ts` | Print the universal paste-in prompt for any agent |
| `src/commands/status.ts` | Report what's wired per adapter |
| `src/commands/clean.ts` | Remove generated files; never touch `AGENTS.md` |
| `src/core/fs.ts` | `linkOrCopy` — symlink with copy fallback on Windows |
| `src/core/gitignore.ts` | Marker-block upsert in `.gitignore` |
| `src/core/wrappers.ts` | Frontmatter wrappers for Cursor `.mdc`, Windsurf rule, Continue rule |
| `src/templates/` | `AGENTS.md`, `AGENTS.d/*.md`, `SKILL.md` |

**Quality gates:**
- `tsc --strict` with `noUncheckedIndexedAccess`.
- 13 smoke tests covering install modes, idempotency, collision preservation, wrapper rendering, YAML safety.
- CI: Ubuntu / macOS / Windows × Node 18 / 20 / 22.

---

## Get started

Building needs Node 18 or later.

```sh
git clone https://github.com/aeiyannn/md-gossip
cd md-gossip
npm install
npm run build
npm test
```

Run the CLI from source:

```sh
node bin/md-gossip.js install --help
```

---

## Contributing

1. **Open an issue first** for feature ideas — the scope is deliberately locked.
2. **Add a new agent** by appending to `src/adapters/registry.ts` and adding a smoke test. No other files should need to change unless the agent needs a new wrapper type.
3. **No new runtime deps.** Ever.
4. **Match the house style.** No comments unless the *why* is non-obvious. Small named functions. Strict types on exported functions.

---

## License

MIT — see [LICENSE](LICENSE). Copyright © 2026 the md-gossip contributors.

<p align="center">
  <img src="assets/logo.png" width="32" height="32" alt="md-gossip"><br>
  <sub>One file. Every agent. Done.</sub>
</p>
