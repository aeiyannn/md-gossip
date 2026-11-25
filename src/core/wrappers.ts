import { relFromTo } from "./paths.js";

/**
 * Cursor `.mdc` rule file that always applies and @includes AGENTS.md.
 * Cursor honors frontmatter + `@file:` references.
 */
export function cursorMdcWrapper(wrapperPath: string, agentsMdAbs: string): string {
  const rel = relFromTo(wrapperPath, agentsMdAbs);
  return `---
description: Shared project context from AGENTS.md
alwaysApply: true
---

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
description: Shared project context from AGENTS.md
---

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
name: Shared Agent Context
alwaysApply: true
description: Shared project context from AGENTS.md
---

See [AGENTS.md](${rel}) and \`AGENTS.d/\` for the full protocol and chunks.
Read AGENTS.md first, then grep AGENTS.d/ on demand.
`;
}
