import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Templates live next to this compiled file in dist/, mirrored from src/templates.
// We resolve relative to the compiled location.
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");

export function loadTemplate(relPath: string): string {
  const abs = path.join(TEMPLATES_DIR, relPath);
  return fs.readFileSync(abs, "utf8");
}

export function listChunkTemplates(): string[] {
  const dir = path.join(TEMPLATES_DIR, "AGENTS.d");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

export function templatesRoot(): string {
  return TEMPLATES_DIR;
}
