import type { SkillFormat } from "./skillFormats.js";

export interface Adapter {
  /** stable id, used on the CLI: --only=claude-code,opencode */
  name: string;
  /** human label for status output */
  label: string;
  /**
   * Files inside the project that should point at ./AGENTS.md.
   * First entry wins if a wrapper format is needed.
   */
  projectTargets: string[];
  /**
   * Absolute path under the user's home where the agent reads a global
   * instruction file. null = agent has no global instruction file.
   */
  globalTarget: string | null;
  /**
   * Where to drop the skill file for this agent, relative to project (if
   * projectSkill) or home (if globalSkill).
   */
  projectSkill?: string;
  globalSkill?: string;
  /** How to render the skill body (frontmatter wrapper, etc.) */
  skillFormat: SkillFormat;
  /**
   * If true, the project target needs a wrapper (frontmatter) rather than
   * a raw symlink to AGENTS.md. The wrapper references ../AGENTS.md.
   */
  wrapper?: "cursor-mdc" | "windsurf-rule" | "continue-rule";
  /** Human note surfaced in `status` */
  note?: string;
}
