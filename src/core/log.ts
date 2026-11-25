const DIM = "\x1b[2m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";

export const log = {
  ok: (msg: string) => console.log(`${GREEN}✔${RESET} ${msg}`),
  info: (msg: string) => console.log(`  ${msg}`),
  warn: (msg: string) => console.log(`${YELLOW}!${RESET} ${msg}`),
  err: (msg: string) => console.error(`${RED}✗${RESET} ${msg}`),
  dim: (msg: string) => console.log(`${DIM}${msg}${RESET}`),
};
