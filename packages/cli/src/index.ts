import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";
import {
  getConfigPath,
  mergeMcpConfig,
  normalizeClient,
  type PlatformEnv,
  SUPPORTED_CLIENTS,
} from "./install.js";

const HELP = `godui — install the GodUI MCP server into your AI IDE

Usage:
  godui install <client>

Clients:
  ${SUPPORTED_CLIENTS.join(", ")}

Examples:
  npx @godui/cli@latest install cursor
  pnpm dlx @godui/cli@latest install claude

After running, restart your IDE. Then ask it for any GodUI component.`;

function currentEnv(): PlatformEnv {
  return {
    platform: process.platform,
    home: homedir(),
    appData: process.env.APPDATA,
  };
}

function fail(message: string): never {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function run(argv: string[]) {
  const [command, clientArg] = argv;

  if (
    !command ||
    command === "--help" ||
    command === "-h" ||
    command === "help"
  ) {
    console.log(HELP);
    return;
  }

  if (command !== "install") {
    fail(`Unknown command "${command}". Run "godui --help".`);
  }

  if (!clientArg) {
    fail(`Missing client. Choose one of: ${SUPPORTED_CLIENTS.join(", ")}.`);
  }

  const client = normalizeClient(clientArg);
  if (!client) {
    fail(
      `Unknown client "${clientArg}". Choose one of: ${SUPPORTED_CLIENTS.join(", ")}.`,
    );
  }

  const configPath = getConfigPath(client, currentEnv());

  let existing: Record<string, unknown> | null = null;
  try {
    existing = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      fail(
        `Found ${configPath} but couldn't parse it as JSON. Fix or remove it, then retry. (${String(error)})`,
      );
    }
    // ENOENT — first install, start from an empty config.
  }

  const merged = mergeMcpConfig(existing);

  try {
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, `${JSON.stringify(merged, null, 2)}\n`);
  } catch (error) {
    fail(`Couldn't write ${configPath}: ${String(error)}`);
  }

  console.log(`✔ Added the GodUI MCP server to ${client}.`);
  console.log(`  ${configPath}`);
  console.log("");
  console.log("Restart your IDE, then ask it to add any GodUI component.");
}

run(process.argv.slice(2));
