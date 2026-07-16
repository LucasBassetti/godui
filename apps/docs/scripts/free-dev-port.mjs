// Runs automatically before `next dev` (pnpm `predev`).
//
// Next refuses to start when another Next dev server already holds its port,
// which happens when a previous `dev` was killed uncleanly and left a zombie
// `next-server` behind. This frees the port so `dev` always starts.
//
// It only kills a listener whose working directory is THIS app — so running
// several Conductor workspaces (each its own checkout) never kills a sibling's
// dev server. Anything unexpected is swallowed: this must never block `dev`.

import { execSync } from "node:child_process";
import { resolve } from "node:path";

const PORT = process.env.PORT || "3000";
const APP_DIR = resolve(process.cwd());

function sh(cmd) {
  try {
    return execSync(cmd, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

function cwdOf(pid) {
  // `lsof -d cwd -Fn` prints the process cwd on a line prefixed with `n`.
  const out = sh(`lsof -a -p ${pid} -d cwd -Fn`);
  const line = out.split("\n").find((l) => l.startsWith("n"));
  return line ? resolve(line.slice(1)) : "";
}

const pids = sh(`lsof -nP -iTCP:${PORT} -sTCP:LISTEN -t`)
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

for (const pid of pids) {
  const cwd = cwdOf(pid);
  // Only reclaim the port from a stale server started inside this workspace.
  if (cwd === APP_DIR) {
    try {
      process.kill(Number(pid), "SIGKILL");
      console.log(
        `[predev] freed port ${PORT} — killed stale dev server ${pid}`,
      );
    } catch {
      // already gone
    }
  }
}
