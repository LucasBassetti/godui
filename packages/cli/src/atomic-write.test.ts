import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { writeFileAtomically } from "./atomic-write.js";

const mockState = vi.hoisted(() => ({ failRename: false, failWrite: false }));

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    renameSync(...args: Parameters<typeof actual.renameSync>) {
      if (mockState.failRename) {
        throw new Error("simulated replacement failure");
      }
      return actual.renameSync(...args);
    },
    writeFileSync(...args: Parameters<typeof actual.writeFileSync>) {
      if (mockState.failWrite) {
        throw new Error("simulated write failure");
      }
      return actual.writeFileSync(...args);
    },
  };
});

const temporaryDirectories: string[] = [];

afterEach(() => {
  mockState.failRename = false;
  mockState.failWrite = false;
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

function makeTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "godui-cli-"));
  temporaryDirectories.push(directory);
  return directory;
}

describe("writeFileAtomically", () => {
  it("writes the complete config and removes the staging file", () => {
    const directory = makeTemporaryDirectory();
    const configPath = join(directory, "mcp.json");
    const contents = '{"mcpServers":{}}\n';

    writeFileAtomically(configPath, contents);

    expect(readFileSync(configPath, "utf8")).toBe(contents);
    expect(readdirSync(directory)).toEqual(["mcp.json"]);
  });

  it("keeps the existing config when replacement fails", () => {
    const directory = makeTemporaryDirectory();
    const configPath = join(directory, "mcp.json");
    const original = '{"mcpServers":{"other":{"command":"x"}}}\n';
    writeFileSync(configPath, original);

    mockState.failRename = true;

    expect(() => writeFileAtomically(configPath, '{"new":true}\n')).toThrow(
      "simulated replacement failure",
    );
    expect(readFileSync(configPath, "utf8")).toBe(original);
    expect(readdirSync(directory)).toEqual(["mcp.json"]);
  });

  it("keeps the existing config when staging the replacement fails", () => {
    const directory = makeTemporaryDirectory();
    const configPath = join(directory, "mcp.json");
    const original = '{"mcpServers":{"other":{"command":"x"}}}\n';
    writeFileSync(configPath, original);

    mockState.failWrite = true;

    expect(() => writeFileAtomically(configPath, '{"new":true}\n')).toThrow(
      "simulated write failure",
    );
    expect(readFileSync(configPath, "utf8")).toBe(original);
    expect(readdirSync(directory)).toEqual(["mcp.json"]);
  });
});
