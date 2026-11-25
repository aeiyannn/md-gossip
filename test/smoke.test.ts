import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { install } from "../src/commands/install.js";
import { clean } from "../src/commands/clean.js";

function tmpRepo(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "csync-"));
}

test("install creates AGENTS.md and chunks", () => {
  const cwd = tmpRepo();
  install({ cwd, global: false, force: false, skipAgentsMd: false });

  assert.ok(fs.existsSync(path.join(cwd, "AGENTS.md")), "AGENTS.md exists");
  assert.ok(fs.existsSync(path.join(cwd, "AGENTS.d", "stack.md")), "stack chunk exists");
  assert.ok(fs.existsSync(path.join(cwd, ".gitignore")), ".gitignore exists");
});

test("install wires claude + opencode targets", () => {
  const cwd = tmpRepo();
  install({
    cwd,
    only: ["claude-code", "opencode"],
    global: false,
    force: false,
    skipAgentsMd: false,
  });

  assert.ok(fs.existsSync(path.join(cwd, "CLAUDE.md")), "CLAUDE.md wired");
  // opencode's project target IS AGENTS.md itself, so nothing extra; skill file exists
  assert.ok(
    fs.existsSync(path.join(cwd, ".opencode", "agent", "md-gossip.md")),
    "opencode skill exists",
  );
});

test("install wires cursor wrapper with alwaysApply: true", () => {
  const cwd = tmpRepo();
  install({ cwd, only: ["cursor"], global: false, force: false, skipAgentsMd: false });

  const mdc = path.join(cwd, ".cursor", "rules", "md-gossip.mdc");
  assert.ok(fs.existsSync(mdc));
  const content = fs.readFileSync(mdc, "utf8");
  assert.match(content, /alwaysApply: true/);
  assert.match(content, /@file:/);
});

test("install is idempotent", () => {
  const cwd = tmpRepo();
  const opts = { cwd, global: false, force: false, skipAgentsMd: false };
  install(opts);
  const before = fs.readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
  install(opts);
  const after = fs.readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
  assert.equal(before, after);
});

test("clean removes generated files but keeps AGENTS.md + chunks", () => {
  const cwd = tmpRepo();
  install({ cwd, global: false, force: false, skipAgentsMd: false });
  assert.ok(fs.existsSync(path.join(cwd, "CLAUDE.md")));

  clean({ cwd, global: false });

  assert.ok(fs.existsSync(path.join(cwd, "AGENTS.md")), "AGENTS.md preserved");
  assert.ok(fs.existsSync(path.join(cwd, "AGENTS.d", "stack.md")), "chunks preserved");
});

test("aider conf is written with AGENTS.md read entry", () => {
  const cwd = tmpRepo();
  install({ cwd, only: ["aider"], global: false, force: false, skipAgentsMd: false });
  const conf = fs.readFileSync(path.join(cwd, ".aider.conf.yml"), "utf8");
  assert.match(conf, /read:/);
  assert.match(conf, /AGENTS\.md/);
  // Aider should not create a dead CONVENTIONS.md file.
  assert.ok(!fs.existsSync(path.join(cwd, "CONVENTIONS.md")));
});

test("aider conf with inline read list is left alone with warning", () => {
  const cwd = tmpRepo();
  fs.writeFileSync(
    path.join(cwd, ".aider.conf.yml"),
    "read: [foo.md, bar.md]\n",
    "utf8",
  );
  install({ cwd, only: ["aider"], global: false, force: false, skipAgentsMd: false });
  const conf = fs.readFileSync(path.join(cwd, ".aider.conf.yml"), "utf8");
  // Original content preserved — no duplicate `read:` block appended.
  assert.equal(conf, "read: [foo.md, bar.md]\n");
});

test("continue adapter writes frontmatter wrapper, not raw symlink", () => {
  const cwd = tmpRepo();
  install({
    cwd,
    only: ["continue"],
    global: false,
    force: false,
    skipAgentsMd: false,
  });
  const rulePath = path.join(cwd, ".continue", "rules", "md-gossip.md");
  assert.ok(fs.existsSync(rulePath));
  const content = fs.readFileSync(rulePath, "utf8");
  assert.match(content, /alwaysApply: true/);
  assert.match(content, /AGENTS\.md/);
});

test("gitignore includes AGENTS.local.md and AGENTS.d/local/", () => {
  const cwd = tmpRepo();
  install({ cwd, global: false, force: false, skipAgentsMd: false });
  const gi = fs.readFileSync(path.join(cwd, ".gitignore"), "utf8");
  assert.match(gi, /AGENTS\.local\.md/);
  assert.match(gi, /AGENTS\.d\/local\//);
});

test("existing AGENTS.md is preserved without --force", () => {
  const cwd = tmpRepo();
  const original = "# my own AGENTS.md\n\nhand-written content\n";
  fs.writeFileSync(path.join(cwd, "AGENTS.md"), original, "utf8");
  install({ cwd, global: false, force: false, skipAgentsMd: false });
  const after = fs.readFileSync(path.join(cwd, "AGENTS.md"), "utf8");
  assert.equal(after, original);
});
