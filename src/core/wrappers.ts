import { relFromTo } from "./paths.js";

const IDENTITY =
  "You are an md-gossip agent installed in this repo. " +
  "Read SKILL.md and AGENTS.md first and follow their protocol. " +
  "NEVER edit AGENTS.md or SKILL.md — suggest durable facts in AGENTS.local.md only.";

/**
 * Cursor `.mdc` rule file that always applies and @includes AGENTS.md.
 * Cursor honors frontmatter + `@file:` references.
 */
export function cursorMdcWrapper(wrapperPath: string, agentsMdAbs: string): string {
  const rel = relFromTo(wrapperPath, agentsMdAbs);
  return `---
description: md-gossip shared agent context
alwaysApply: true
---

${IDENTITY}

@file:${rel}
`;
}

/** Windsurf rule with always-on activation that references AGENTS.md. */
export function windsurfRuleWrapper(
  wrapperPath: string,
  agentsMdAbs: string,
): string {
  const rel = relFromTo(wrapperPath, agentsMdAbs);
  return `---
trigger: always_on
description: md-gossip shared agent context
---

${IDENTITY}

See [AGENTS.md](${rel}) and \`AGENTS.d/\` for full protocol and chunks.
Read AGENTS.md first, then grep AGENTS.d/ on demand.
`;
}

/**
 * Continue.dev rule with alwaysApply frontmatter that references AGENTS.md.
 * Continue requires frontmatter for a rule file to auto-apply.
 */
export function continueRuleWrapper(
  wrapperPath: string,
  agentsMdAbs: string,
): string {
  const rel = relFromTo(wrapperPath, agentsMdAbs);
  return `---
name: md-gossip Shared Agent Context
alwaysApply: true
description: md-gossip shared agent context
---

${IDENTITY}

See [AGENTS.md](${rel}) and \`AGENTS.d/\` for the full protocol and chunks.
Read AGENTS.md first, then grep AGENTS.d/ on demand.
`;
}
