import fs from "node:fs";
import path from "node:path";

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeFile(file: string, content: string): void {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

export function exists(p: string): boolean {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

/** True when `p` is a symlink (not a regular file). */
export function isSymlink(p: string): boolean {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Point `target` at `source`. Tries symlink first; falls back to copy on
 * Windows without Dev Mode / without admin. Idempotent.
 */
export function linkOrCopy(
  source: string,
  target: string,
): "symlink" | "copy" | "unchanged" {
  ensureDir(path.dirname(target));

  if (exists(target)) {
    if (isSymlink(target)) {
      const current = fs.readlinkSync(target);
      const resolved = path.resolve(path.dirname(target), current);
      if (resolved === path.resolve(source)) return "unchanged";
    } else {
      // regular file — only overwrite if contents differ and caller allowed it
      const a = fs.readFileSync(target, "utf8");
      const b = fs.readFileSync(source, "utf8");
      if (a === b) return "unchanged";
    }
    fs.rmSync(target, { force: true });
  }

  try {
    fs.symlinkSync(path.resolve(source), target, "file");
    return "symlink";
  } catch {
    fs.copyFileSync(source, target);
    return "copy";
  }
}

/** Remove a file/symlink if it exists and the caller recognizes it. */
export function safeRemove(p: string): boolean {
  if (!exists(p)) return false;
  fs.rmSync(p, { force: true });
  return true;
}
