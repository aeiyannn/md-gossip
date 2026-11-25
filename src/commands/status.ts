import path from "node:path";

import { ADAPTERS } from "../adapters/index.js";
import { exists } from "../core/fs.js";
import { log } from "../core/log.js";
import { expandHome } from "../core/paths.js";

export function status(cwd: string): void {
  const agentsMd = path.join(cwd, "AGENTS.md");
  if (exists(agentsMd)) log.ok(`AGENTS.md found at ${agentsMd}`);
  else log.warn("AGENTS.md not found in cwd — run `md-gossip install`.");

  console.log("");
  console.log("Adapters:");
  for (const a of ADAPTERS) {
    const projectHits = a.projectTargets.filter((t) => exists(path.join(cwd, t)));
    const globalHit = a.globalTarget ? exists(expandHome(a.globalTarget)) : null;
    const skillProjectHit = a.projectSkill ? exists(path.join(cwd, a.projectSkill)) : null;
    const skillGlobalHit = a.globalSkill ? exists(expandHome(a.globalSkill)) : null;

    const parts: string[] = [];
    if (a.projectTargets.length > 0) {
      parts.push(`project ${projectHits.length}/${a.projectTargets.length}`);
    }
    if (a.globalTarget) parts.push(`global ${globalHit ? "✓" : "✗"}`);
    if (a.projectSkill) parts.push(`skill-proj ${skillProjectHit ? "✓" : "✗"}`);
    if (a.globalSkill) parts.push(`skill-user ${skillGlobalHit ? "✓" : "✗"}`);

    console.log(`  ${a.name.padEnd(14)} ${a.label.padEnd(22)} ${parts.join(" · ")}`);
  }
}
