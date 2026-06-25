// Pure config-resolution + merge logic for the GodUI CLI. Kept free of fs/process
// side effects so it can be unit tested across platforms.

import { join } from "node:path";

export type ClientId = "cursor" | "windsurf" | "claude" | "cline" | "roo-cline";

export const SUPPORTED_CLIENTS: ClientId[] = [
  "cursor",
  "windsurf",
  "claude",
  "cline",
  "roo-cline",
];

/** Accept a few friendly aliases for client names. */
export function normalizeClient(input: string): ClientId | undefined {
  const value = input.trim().toLowerCase();
  const aliases: Record<string, ClientId> = {
    cursor: "cursor",
    windsurf: "windsurf",
    claude: "claude",
    "claude-desktop": "claude",
    cline: "cline",
    roo: "roo-cline",
    "roo-cline": "roo-cline",
    roocode: "roo-cline",
  };
  return aliases[value];
}

export type PlatformEnv = {
  platform: NodeJS.Platform;
  home: string;
  /** %APPDATA% on Windows; falsy elsewhere. */
  appData?: string;
};

/** VS Code global storage dir, parent of per-extension MCP settings. */
function vscodeGlobalStorage({ platform, home, appData }: PlatformEnv): string {
  if (platform === "win32") {
    return join(
      appData ?? join(home, "AppData", "Roaming"),
      "Code",
      "User",
      "globalStorage",
    );
  }
  if (platform === "darwin") {
    return join(
      home,
      "Library",
      "Application Support",
      "Code",
      "User",
      "globalStorage",
    );
  }
  return join(home, ".config", "Code", "User", "globalStorage");
}

/** Resolve the MCP config file path for a client on the given platform. */
export function getConfigPath(client: ClientId, env: PlatformEnv): string {
  const { platform, home, appData } = env;

  switch (client) {
    case "cursor":
      return join(home, ".cursor", "mcp.json");

    case "windsurf":
      return join(home, ".codeium", "windsurf", "mcp_config.json");

    case "claude": {
      if (platform === "win32") {
        return join(
          appData ?? join(home, "AppData", "Roaming"),
          "Claude",
          "claude_desktop_config.json",
        );
      }
      if (platform === "darwin") {
        return join(
          home,
          "Library",
          "Application Support",
          "Claude",
          "claude_desktop_config.json",
        );
      }
      return join(home, ".config", "Claude", "claude_desktop_config.json");
    }

    case "cline":
      return join(
        vscodeGlobalStorage(env),
        "saoudrizwan.claude-dev",
        "settings",
        "cline_mcp_settings.json",
      );

    case "roo-cline":
      return join(
        vscodeGlobalStorage(env),
        "rooveterinaryinc.roo-cline",
        "settings",
        "mcp_settings.json",
      );
  }
}

export type McpServerConfig = {
  command: string;
  args: string[];
};

/** The GodUI MCP server entry written into every client config. */
export const GODUI_SERVER: McpServerConfig = {
  command: "npx",
  args: ["-y", "@godui/mcp@latest"],
};

export const GODUI_SERVER_KEY = "godui";

type McpConfig = {
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Merge the GodUI server into an existing config object without clobbering other
 * servers or unrelated keys. Returns a new object.
 */
export function mergeMcpConfig(
  existing: McpConfig | null | undefined,
): McpConfig {
  const base: McpConfig =
    existing && typeof existing === "object" ? existing : {};
  return {
    ...base,
    mcpServers: {
      ...(base.mcpServers ?? {}),
      [GODUI_SERVER_KEY]: GODUI_SERVER,
    },
  };
}
