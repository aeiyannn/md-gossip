import { ADAPTERS, byName } from "../adapters/index.js";
import { log } from "../core/log.js";

const BODY = `This repo uses md-gossip shared agent context.

Before doing any work, read these two files at the repo root:
1. SKILL.md — the manual guide. Follow it exactly.
2. AGENTS.md — the protocol. Apply every fact you load.

Rules you MUST follow:
- For details, grep AGENTS.d/ on demand (rg "<keyword>" AGENTS.d/).
  Never read all of AGENTS.d/ at once.
- NEVER edit AGENTS.md, SKILL.md, or any shared AGENTS.d/*.md file.
- If you learn a durable fact (stack choice, bug cause, convention, user
  preference, API contract, deploy quirk), append ONE line to
  AGENTS.local.md:  #tag short fact under 120 chars
- AGENTS.local.md is gitignored — a human reviews it and promotes facts
  into AGENTS.d/ manually. Agents propose, humans approve.
- Never delete lines you did not write this session.`;

/**
 * Print a universal paste-in prompt for agents that can't be wired
 * with a pointer file (or where the user prefers UI-based instructions).
 */
export function prompt(agentName?: string): void {
  if (!agentName) {
    console.log("md-gossip prompt <agent> — prints a paste-in instruction prompt.\n");
    console.log("Available agents:");
    for (const a of ADAPTERS) {
      console.log(`  ${a.name.padEnd(14)} ${a.label}`);
    }
    console.log(
      "\nWhere to paste: each agent's rules/instructions/memory settings " +
        "(e.g. Claude Code → CLAUDE.md or /memory, Cursor → Rules, " +
        "Copilot → .github/copilot-instructions.md, Windsurf → Rules).",
    );
    return;
  }

  const a = byName(agentName);
  if (!a) {
    log.err(`Unknown agent: ${agentName}`);
    log.err(`Run \`md-gossip prompt\` to list available agents.`);
    process.exitCode = 1;
    return;
  }

  console.log(`# ${a.label} — paste into your agent's instructions/rules`);
  console.log(`# (or save as a file if the agent supports it)\n`);
  console.log(BODY);
}
