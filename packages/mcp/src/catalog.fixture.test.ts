import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const catalog = JSON.parse(
  readFileSync(
    new URL("../../../apps/docs/public/r/index.json", import.meta.url),
    "utf8",
  ),
);

const dynamicBackgrounds = [
  "decorative-background",
  "effect-background",
  "geometric-background",
  "gradient-background",
];

describe("generated MCP catalog fixture", () => {
  const components = new Map(
    catalog.components.map((component: { name: string }) => [
      component.name,
      component,
    ]),
  );

  it("installs dynamic backgrounds from the extras registry URL", () => {
    for (const name of dynamicBackgrounds) {
      expect(components.get(name)).toMatchObject({
        install: `npx shadcn@latest add "https://godui.design/r/extras/${name}.json"`,
      });
    }
  });

  it("installs static extras from the extras registry URL", () => {
    expect(components.get("marquee")).toMatchObject({
      install:
        'npx shadcn@latest add "https://godui.design/r/extras/marquee.json"',
    });
  });

  it("tags extras items with their registry", () => {
    expect(components.get("marquee")).toMatchObject({ registry: "extras" });
  });

  it("does not list superseded components", () => {
    for (const name of [
      "accordion",
      "dropdown-menu",
      "toast",
      "drawer",
      "context-menu",
      "combobox",
      "command-palette",
    ]) {
      expect(components.has(name)).toBe(false);
    }
  });
});
