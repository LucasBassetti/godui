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
  it("includes every dynamic background with a URL install target", () => {
    const components = new Map(
      catalog.components.map((component: { name: string }) => [
        component.name,
        component,
      ]),
    );

    for (const name of dynamicBackgrounds) {
      expect(components.get(name)).toMatchObject({
        install: `npx shadcn@latest add "https://godui.design/r/${name}.json"`,
      });
    }
  });
});
