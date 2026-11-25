import os from "node:os";
import path from "node:path";

/** Expand ~ and ~/ prefixes to the user's home dir. */
export function expandHome(p: string): string {
  if (p === "~") return os.homedir();
  if (p.startsWith("~/") || p.startsWith("~\\")) {
    return path.join(os.homedir(), p.slice(2));
  }
  return p;
}

/** Relative path from one abs file to another, POSIX-style for symlinks. */
export function relFromTo(from: string, to: string): string {
  return path
    .relative(path.dirname(from), to)
    .split(path.sep)
    .join(path.posix.sep);
}
