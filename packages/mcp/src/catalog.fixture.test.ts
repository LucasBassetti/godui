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

  it("installs dynamic backgrounds from the lab registry URL", () => {
    for (const name of dynamicBackgrounds) {
      expect(components.get(name)).toMatchObject({
        install: `npx shadcn@latest add "https://godui.design/r/lab/${name}.json"`,
      });
    }
  });

  it("installs static lab items from the lab registry URL", () => {
    expect(components.get("marquee")).toMatchObject({
      install:
        'npx shadcn@latest add "https://godui.design/r/lab/marquee.json"',
    });
  });

  it("tags lab items with their registry", () => {
    expect(components.get("marquee")).toMatchObject({ registry: "lab" });
  });

  // Core shadcn drop-ins replaced these Lab components; the names may exist in
  // the core registry, never as Lab items.
  it("does not list superseded Lab components", () => {
    for (const name of [
      "accordion",
      "dropdown-menu",
      "toast",
      "drawer",
      "context-menu",
      "combobox",
      "command-palette",
    ]) {
      expect(components.get(name)).not.toMatchObject({ registry: "lab" });
    }
  });
});
