// Runs automatically before `next dev` (pnpm `predev`).
//
// Next refuses to start when another Next dev server already holds its port,
// which happens when a previous `dev` was killed uncleanly and left a zombie
// `next-server` behind. This frees the port so `dev` always starts.
//
// It only kills a listener whose working directory is THIS app — so running
// several Conductor workspaces (each its own checkout) never kills a sibling's
// dev server. lsof failures are swallowed: this cleanup must never block `dev`.

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PORT = 3000;
const MAX_PORT = 65535;
const DECIMAL_INTEGER = /^\d+$/;
const POSITIVE_INTEGER = /^[1-9]\d*$/;

export function parsePort(value) {
  if (value === undefined || value === "") {
    return DEFAULT_PORT;
  }

  if (typeof value !== "string" || !DECIMAL_INTEGER.test(value)) {
    return null;
  }

  const port = Number(value);
  return Number.isSafeInteger(port) && port >= 1 && port <= MAX_PORT
    ? port
    : null;
}

export function parsePids(output) {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => POSITIVE_INTEGER.test(line))
    .map(Number)
    .filter(Number.isSafeInteger);
}

function runLsof(args) {
  try {
    return execFileSync("lsof", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

export function freeDevPort({
  portValue = process.env.PORT,
  appDir = resolve(process.cwd()),
  runLsofCommand = runLsof,
  kill = process.kill,
  onInvalidPort = (message) => console.error(message),
  onFreed = (message) => console.log(message),
} = {}) {
  const port = parsePort(portValue);
  if (port === null) {
    onInvalidPort(
      "[predev] PORT must be a decimal integer between 1 and 65535",
    );
    return false;
  }

  const cwdOf = (pid) => {
    // `lsof -d cwd -Fn` prints the process cwd on a line prefixed with `n`.
    const out = runLsofCommand(["-a", "-p", String(pid), "-d", "cwd", "-Fn"]);
    const line = out.split("\n").find((l) => l.startsWith("n"));
    return line ? resolve(line.slice(1)) : "";
  };

  const pids = parsePids(
    runLsofCommand(["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"]),
  );

  for (const pid of pids) {
    const cwd = cwdOf(pid);
    // Only reclaim the port from a stale server started inside this workspace.
    if (cwd === appDir) {
      try {
        kill(pid, "SIGKILL");
        onFreed(`[predev] freed port ${port} — killed stale dev server ${pid}`);
      } catch {
        // already gone
      }
    }
  }

  return true;
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  if (!freeDevPort()) {
    process.exitCode = 1;
  }
}
