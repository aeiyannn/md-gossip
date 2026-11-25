export type SkillFormat =
  | "plain"
  | "claude-skill"
  | "opencode-agent"
  | "cursor-mdc"
  | "windsurf-workflow"
  | "copilot-prompt"
  | "gemini-toml"
  | "none";

export function renderSkill(format: SkillFormat, body: string): string {
  switch (format) {
    case "plain":
      return body;
    case "claude-skill":
      return frontmatter(
        {
          name: "md-gossip",
          description:
            "Shared agent memory via AGENTS.md + AGENTS.d/. Read first, grep on demand, append durable facts.",
        },
        body,
      );
    case "opencode-agent":
      return frontmatter(
        {
          name: "md-gossip",
          mode: "subagent",
          description:
            "Shared agent memory via AGENTS.md + AGENTS.d/. Read first, grep on demand, append durable facts.",
        },
        body,
      );
    case "cursor-mdc":
      return frontmatter(
        {
          description:
            "Shared agent context. Read AGENTS.md, grep AGENTS.d/, append durable facts.",
          alwaysApply: false,
        },
        body,
      );
    case "windsurf-workflow":
      return frontmatter(
        { description: "Shared agent context via AGENTS.md" },
        body,
      );
    case "copilot-prompt":
      return frontmatter(
        {
          mode: "agent",
          description: "Shared context via AGENTS.md + AGENTS.d/",
        },
        body,
      );
    case "gemini-toml":
      return `description = "Use shared AGENTS.md context"\nprompt = """\n${body}\n"""\n`;
    case "none":
      return "";
  }
}

function frontmatter(fields: Record<string, unknown>, body: string): string {
  const lines = Object.entries(fields).map(([k, v]) =>
    typeof v === "string" ? `${k}: ${v}` : `${k}: ${JSON.stringify(v)}`,
  );
  return `---\n${lines.join("\n")}\n---\n\n${body}`;
}
