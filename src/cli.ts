#!/usr/bin/env node
import { install } from "./commands/install.js";
import { prompt } from "./commands/prompt.js";
import { status } from "./commands/status.js";
import { clean } from "./commands/clean.js";
import { log } from "./core/log.js";

interface ParsedArgs {
  command: string;
  flags: Record<string, string | boolean>;
  positional: string[];
}

function parse(argv: string[]): ParsedArgs {
  const [command = "install", ...rest] = argv;
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const tok = rest[i]!;
    if (tok.startsWith("--")) {
      const eq = tok.indexOf("=");
      if (eq > 0) {
        flags[tok.slice(2, eq)] = tok.slice(eq + 1);
      } else {
        const next = rest[i + 1];
        if (next && !next.startsWith("--")) {
          flags[tok.slice(2)] = next;
          i++;
        } else {
          flags[tok.slice(2)] = true;
        }
      }
    } else {
      positional.push(tok);
    }
  }
  return { command, flags, positional };
}

function help(): void {
  console.log(`md-gossip — one AGENTS.md for every coding agent

Usage:
  md-gossip [install] [options]    install into current project (default)
                                   writes AGENTS.md + SKILL.md + AGENTS.d/ only
  md-gossip prompt [agent]           print a paste-in prompt for any agent
  md-gossip status                   show which adapters are wired
  md-gossip clean [--global]         remove generated links/skills (keeps AGENTS.md)

Install options:
  --agents                              also wire per-agent pointer files
                                        (CLAUDE.md, .cursor/rules/, ...)
  --global                              with --agents: also write user-level files
  --only <a,b,c>                        limit to specific adapters by name
                                        (implies --agents)
  --force                               overwrite existing files
  --skip-agents-md                      don't create AGENTS.md / AGENTS.d/
  --minimal                             only AGENTS.md + AGENTS.d/;
                                        no SKILL.md, no pointers, no globals
  --skills                               with --agents: also write per-agent
                                        skill files (.claude/skills/, ...)

Adapters:
  claude-code, codex, opencode, devin, antigravity, cursor, copilot,
  windsurf, gemini-cli, cline, continue, zed, aider
`);
}

async function main(): Promise<void> {
  const args = parse(process.argv.slice(2));

  if (args.flags.help || args.command === "help") {
    help();
    return;
  }

  const cwd = process.cwd();

  switch (args.command) {
    case "install": {
      const onlyRaw = args.flags.only;
      const only =
        typeof onlyRaw === "string"
          ? onlyRaw.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined;
      install({
        cwd,
        only,
        global: Boolean(args.flags.global),
        force: Boolean(args.flags.force),
        skipAgentsMd: Boolean(args.flags["skip-agents-md"]),
        minimal: Boolean(args.flags.minimal),
        skills: Boolean(args.flags.skills),
        agents: Boolean(args.flags.agents),
      });
      return;
    }
    case "prompt":
      prompt(args.positional[0]);
      return;
    case "status":
      status(cwd);
      return;
    case "clean":
      clean({ cwd, global: Boolean(args.flags.global) });
      return;
    default:
      log.err(`Unknown command: ${args.command}`);
      help();
      process.exitCode = 1;
  }
}

main().catch((e) => {
  log.err(e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
});
