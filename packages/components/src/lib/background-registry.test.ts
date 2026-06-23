import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildBackgroundFileContent,
  buildBackgroundRegistryItem,
} from "./background-registry";

const SRC = join(__dirname, "..");

describe("buildBackgroundFileContent", () => {
  it("returns the committed component verbatim for the default variant", () => {
    const onDisk = readFileSync(
      join(SRC, "geometric-background", "geometric-background.tsx"),
      "utf8",
    );
    expect(buildBackgroundFileContent("geometric-background")).toBe(onDisk);
  });

  it("bakes a chosen variant's CSS into the default-props block", () => {
    const content = buildBackgroundFileContent(
      "geometric-background",
      "purple-gradient-grid-left",
    );
    expect(content).toContain("circle 800px at 0% 200px");
    expect(content).toContain("// @default-props:start");
    expect(content).toContain("// @default-props:end");
  });

  it("falls back to the default variant for an unknown id", () => {
    expect(buildBackgroundFileContent("geometric-background", "nope")).toBe(
      buildBackgroundFileContent("geometric-background"),
    );
  });

  it("returns null for a non-background item", () => {
    expect(buildBackgroundFileContent("magic-button")).toBeNull();
  });
});

describe("buildBackgroundRegistryItem", () => {
  it("returns a shadcn-shaped item targeting components/godui", () => {
    const item = buildBackgroundRegistryItem(
      "gradient-background",
      "blue-radial-glow",
    );
    expect(item).toMatchObject({
      name: "gradient-background",
      type: "registry:ui",
      registryDependencies: ["@godui/godui-theme"],
    });
    expect(item?.files[0].target).toBe(
      "components/godui/gradient-background.tsx",
    );
    expect(item?.files[0].content.length).toBeGreaterThan(0);
  });

  it("returns null for a non-background item", () => {
    expect(buildBackgroundRegistryItem("magic-button")).toBeNull();
  });
});
