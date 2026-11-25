import fs from "node:fs";
import path from "node:path";

import { ADAPTERS, byName, type Adapter } from "../adapters/index.js";
import { renderSkill } from "../adapters/skillFormats.js";
import { ensureDir, exists, linkOrCopy, writeFile } from "../core/fs.js";
import { upsertGitignore } from "../core/gitignore.js";
import { log } from "../core/log.js";
import { expandHome } from "../core/paths.js";
import { listChunkTemplates, loadTemplate } from "../core/templates.js";
import {
  continueRuleWrapper,
  cursorMdcWrapper,
  windsurfRuleWrapper,
} from "../core/wrappers.js";

export interface InstallOptions {
  cwd: string;
  only?: string[];
  global: boolean;
  force: boolean;
  skipAgentsMd: boolean;
}

export function install(opts: InstallOptions): void {
  const adapters = pickAdapters(opts.only);
  if (adapters.length === 0) {
    log.err("No adapters matched --only filter");
    process.exitCode = 1;
    return;
  }

  if (!opts.skipAgentsMd) {
    seedAgentsMd(opts.cwd, opts.force);
  }

  const agentsMd = path.join(opts.cwd, "AGENTS.md");
  // Always protect personal override files from accidental commit.
  const ignoreEntries: string[] = ["AGENTS.local.md", "AGENTS.d/local/"];

  for (const a of adapters) {
    installProject(a, opts.cwd, agentsMd, ignoreEntries, opts.force);
    if (opts.global) installGlobal(a, agentsMd, opts.force);
    if (a.note) log.dim(`  ${a.label}: ${a.note}`);
  }

  if (ignoreEntries.length > 0) {
    upsertGitignore(opts.cwd, dedupe(ignoreEntries));
    log.ok(".gitignore updated");
  }

  log.ok("Done. Commit AGENTS.md + AGENTS.d/ and push.");
}

function pickAdapters(only?: string[]): Adapter[] {
  if (!only || only.length === 0) return ADAPTERS;
  const picked: Adapter[] = [];
  for (const name of only) {
    const a = byName(name);
    if (!a) {
      log.warn(`Unknown adapter: ${name}`);
      continue;
    }
    picked.push(a);
  }
  return picked;
}

function seedAgentsMd(cwd: string, force: boolean): void {
  const dest = path.join(cwd, "AGENTS.md");
  if (exists(dest) && !force) {
    log.info("AGENTS.md already exists — keeping it. Use --force to overwrite.");
  } else {
    writeFile(dest, loadTemplate("AGENTS.md"));
    log.ok("Wrote AGENTS.md");
  }

  const chunksDir = path.join(cwd, "AGENTS.d");
  ensureDir(chunksDir);
  for (const chunk of listChunkTemplates()) {
    const target = path.join(chunksDir, chunk);
    if (exists(target) && !force) continue;
    writeFile(target, loadTemplate(path.join("AGENTS.d", chunk)));
  }
  log.ok("Seeded AGENTS.d/ chunks");
}

function installProject(
  a: Adapter,
  cwd: string,
  agentsMd: string,
  ignoreEntries: string[],
  force: boolean,
): void {
  // 1. Project instruction target
  for (const rel of a.projectTargets) {
    const target = path.join(cwd, rel);
    // AGENTS.md is itself a project target for some adapters — skip, it's the source.
    if (path.resolve(target) === path.resolve(agentsMd)) continue;

    if (a.wrapper === "cursor-mdc") {
      writeWrapper(target, cursorMdcWrapper(target, agentsMd), force);
      log.info(`${a.label}: ${rel} (wrapper)`);
    } else if (a.wrapper === "windsurf-rule") {
      writeWrapper(target, windsurfRuleWrapper(target, agentsMd), force);
      log.info(`${a.label}: ${rel} (wrapper)`);
    } else if (a.wrapper === "continue-rule") {
      writeWrapper(target, continueRuleWrapper(target, agentsMd), force);
      log.info(`${a.label}: ${rel} (wrapper)`);
    } else {
      const mode = linkOrCopy(agentsMd, target);
      if (mode === "copy") {
        log.warn(
          `${a.label}: ${rel} fell back to COPY (symlink unavailable). ` +
            `Re-run \`context-sync install --force\` after editing AGENTS.md ` +
            `to re-sync.`,
        );
      } else {
        log.info(`${a.label}: ${rel} (${mode})`);
      }
    }
    ignoreEntries.push(normalizeIgnore(rel));
  }

  // 2. Project skill file
  if (a.projectSkill && a.skillFormat !== "none") {
    // Skip if the project skill is the same path as the project target
    // (e.g. cursor .mdc file doubles as rule + skill).
    const isAlsoTarget = a.projectTargets.includes(a.projectSkill);
    if (!isAlsoTarget) {
      const skillPath = path.join(cwd, a.projectSkill);
      writeSkill(skillPath, a.skillFormat, force);
      log.info(`${a.label}: ${a.projectSkill}`);
      ignoreEntries.push(normalizeIgnore(a.projectSkill));
    }
  }

  // 3. Aider special case — append to conf
  if (a.name === "aider") {
    writeAiderConf(cwd);
    log.info("aider: .aider.conf.yml updated");
  }
}

function installGlobal(a: Adapter, agentsMd: string, force: boolean): void {
  if (a.globalTarget) {
    const target = expandHome(a.globalTarget);
    if (exists(target) && !force) {
      log.info(`${a.label} (global): ${a.globalTarget} already exists`);
    } else {
      const mode = linkOrCopy(agentsMd, target);
      log.info(`${a.label} (global): ${a.globalTarget} (${mode})`);
    }
  }
  if (a.globalSkill && a.skillFormat !== "none") {
    const target = expandHome(a.globalSkill);
    writeSkill(target, a.skillFormat, force);
    log.info(`${a.label} (global skill): ${a.globalSkill}`);
  }
}

function writeWrapper(target: string, content: string, force: boolean): void {
  if (exists(target) && !force) {
    const existing = fs.readFileSync(target, "utf8");
    if (existing === content) return;
  }
  writeFile(target, content);
}

function writeSkill(target: string, format: Adapter["skillFormat"], force: boolean): void {
  const body = loadTemplate("SKILL.md");
  const content = renderSkill(format, body);
  if (exists(target) && !force) {
    const existing = fs.readFileSync(target, "utf8");
    if (existing === content) return;
  }
  writeFile(target, content);
}

function writeAiderConf(cwd: string): void {
  const file = path.join(cwd, ".aider.conf.yml");
  const existing = exists(file) ? fs.readFileSync(file, "utf8") : "";

  // Already wired (block-form read: with AGENTS.md).
  if (/^\s*read:\s*$/m.test(existing) && existing.includes("AGENTS.md")) return;

  // Inline list form: `read: [foo.md, bar.md]` — can't safely edit with regex.
  // Bail with a visible warning rather than corrupt the YAML.
  if (/^\s*read:\s*\[/m.test(existing)) {
    log.warn(
      "aider: .aider.conf.yml uses inline `read: [...]` form. " +
        "Add `AGENTS.md` to that list manually.",
    );
    return;
  }

  // Inline scalar form: `read: foo.md` — also skip rather than guess.
  if (/^\s*read:\s*\S/m.test(existing) && !/^\s*read:\s*$/m.test(existing)) {
    log.warn(
      "aider: .aider.conf.yml has a non-block `read:` entry. " +
        "Convert it to list form and add `AGENTS.md`.",
    );
    return;
  }

  const addition = existing.includes("read:")
    ? existing.replace(/read:\s*\n/, "read:\n  - AGENTS.md\n")
    : existing +
      (existing.endsWith("\n") || existing === "" ? "" : "\n") +
      "read:\n  - AGENTS.md\n";
  writeFile(file, addition);
}

function normalizeIgnore(rel: string): string {
  return rel.split(path.sep).join("/");
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

