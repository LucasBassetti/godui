import { describe, expect, it } from "vitest";
import {
  GODUI_SERVER,
  GODUI_SERVER_KEY,
  getConfigPath,
  mergeMcpConfig,
  normalizeClient,
  type PlatformEnv,
} from "./install.js";

const mac: PlatformEnv = { platform: "darwin", home: "/Users/x" };
const win: PlatformEnv = {
  platform: "win32",
  home: "C:\\Users\\x",
  appData: "C:\\Users\\x\\AppData\\Roaming",
};
const linux: PlatformEnv = { platform: "linux", home: "/home/x" };

describe("normalizeClient", () => {
  it("maps aliases to canonical ids", () => {
    expect(normalizeClient("Cursor")).toBe("cursor");
    expect(normalizeClient("claude-desktop")).toBe("claude");
    expect(normalizeClient("roo")).toBe("roo-cline");
    expect(normalizeClient(" RooCode ")).toBe("roo-cline");
  });

  it("returns undefined for unknown clients", () => {
    expect(normalizeClient("vim")).toBeUndefined();
  });
});

describe("getConfigPath", () => {
  it("resolves simple home-relative clients", () => {
    expect(getConfigPath("cursor", mac)).toBe("/Users/x/.cursor/mcp.json");
    expect(getConfigPath("windsurf", mac)).toBe(
      "/Users/x/.codeium/windsurf/mcp_config.json",
    );
  });

  it("resolves Claude Desktop per platform", () => {
    expect(getConfigPath("claude", mac)).toBe(
      "/Users/x/Library/Application Support/Claude/claude_desktop_config.json",
    );
    expect(getConfigPath("claude", linux)).toBe(
      "/home/x/.config/Claude/claude_desktop_config.json",
    );
    // node:path joins with the host separator, so on a POSIX CI host the
    // win32 base keeps backslashes while appended segments use "/". Assert on
    // the parts rather than a fixed separator.
    const winPath = getConfigPath("claude", win);
    expect(winPath).toContain(win.appData as string);
    expect(winPath).toContain("Claude");
    expect(winPath.endsWith("claude_desktop_config.json")).toBe(true);
  });

  it("resolves Cline/Roo under VS Code globalStorage", () => {
    expect(getConfigPath("cline", mac)).toBe(
      "/Users/x/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json",
    );
    expect(getConfigPath("roo-cline", linux)).toBe(
      "/home/x/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json",
    );
  });
});

describe("mergeMcpConfig", () => {
  it("adds the godui server to an empty config", () => {
    const out = mergeMcpConfig(null);
    expect(out.mcpServers?.[GODUI_SERVER_KEY]).toEqual(GODUI_SERVER);
  });

  it("preserves existing servers and unrelated keys", () => {
    const out = mergeMcpConfig({
      schema: 1,
      mcpServers: { other: { command: "x", args: [] } },
    });
    expect(out.schema).toBe(1);
    expect(out.mcpServers?.other).toEqual({ command: "x", args: [] });
    expect(out.mcpServers?.[GODUI_SERVER_KEY]).toEqual(GODUI_SERVER);
  });

  it("overwrites a stale godui entry", () => {
    const out = mergeMcpConfig({
      mcpServers: { godui: { command: "old", args: ["old"] } },
    });
    expect(out.mcpServers?.[GODUI_SERVER_KEY]).toEqual(GODUI_SERVER);
  });
});
