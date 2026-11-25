#!/usr/bin/env node
import { install } from "./commands/install.js";
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
  console.log(`context-sync — one AGENTS.md for every coding agent

Usage:
  context-sync [install] [options]    install into current project (default)
  context-sync status                   show which adapters are wired
  context-sync clean [--global]         remove generated links/skills (keeps AGENTS.md)

Install options:
  --global                              also write user-level files (~/.claude, etc.)
  --only <a,b,c>                        limit to specific adapters by name
  --force                               overwrite existing files
  --skip-agents-md                      don't create AGENTS.md / AGENTS.d/

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
      });
      return;
    }
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
