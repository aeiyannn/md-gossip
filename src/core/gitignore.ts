import fs from "node:fs";
import path from "node:path";

const MARK_START = "# >>> context-sync (generated, do not edit) >>>";
const MARK_END = "# <<< context-sync <<<";

/** Idempotently add a block of ignore entries between markers. */
export function upsertGitignore(repoRoot: string, entries: string[]): void {
  const file = path.join(repoRoot, ".gitignore");
  const block = [MARK_START, ...entries, MARK_END, ""].join("\n");
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

  const startIdx = existing.indexOf(MARK_START);
  const endIdx = existing.indexOf(MARK_END);

  let next: string;
  if (startIdx >= 0 && endIdx > startIdx) {
    next =
      existing.slice(0, startIdx) +
      block +
      existing.slice(endIdx + MARK_END.length + 1);
  } else {
    next = existing.endsWith("\n") || existing === "" ? existing : existing + "\n";
    next += "\n" + block;
  }

  fs.writeFileSync(file, next, "utf8");
}

/** Remove the managed block entirely. */
export function removeGitignoreBlock(repoRoot: string): void {
  const file = path.join(repoRoot, ".gitignore");
  if (!fs.existsSync(file)) return;
  const existing = fs.readFileSync(file, "utf8");
  const startIdx = existing.indexOf(MARK_START);
  const endIdx = existing.indexOf(MARK_END);
  if (startIdx < 0 || endIdx < 0) return;
  const next =
    existing.slice(0, startIdx).replace(/\n+$/, "\n") +
    existing.slice(endIdx + MARK_END.length + 1);
  fs.writeFileSync(file, next, "utf8");
}
