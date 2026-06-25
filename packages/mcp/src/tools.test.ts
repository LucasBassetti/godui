import { describe, expect, it } from "vitest";
import type {
  CatalogIndex,
  RegistryClient,
  RegistryItem,
} from "./registry-client.js";
import { getComponent, listComponents, searchComponents } from "./tools.js";

const index: CatalogIndex = {
  name: "godui",
  homepage: "https://godui.design",
  components: [
    {
      name: "magic-button",
      title: "Magic Button",
      description: "A tactile 3D push button with an animated rainbow edge.",
      category: "Buttons",
      dependencies: [],
      registryDependencies: ["@godui/godui-theme"],
      install: "npx shadcn@latest add @godui/magic-button",
    },
    {
      name: "marquee",
      title: "Marquee",
      description: "An infinite scrolling row of logos or cards.",
      category: "Effects",
      dependencies: [],
      registryDependencies: ["@godui/godui-theme"],
      install: "npx shadcn@latest add @godui/marquee",
    },
    {
      name: "number-ticker",
      title: "Number Ticker",
      description: "Animates a number counting up to a target value.",
      category: "Text",
      dependencies: [],
      registryDependencies: ["@godui/godui-theme"],
      install: "npx shadcn@latest add @godui/number-ticker",
    },
  ],
};

const magicButtonItem: RegistryItem = {
  name: "magic-button",
  title: "Magic Button",
  description: "A tactile 3D push button with an animated rainbow edge.",
  dependencies: ["framer-motion"],
  registryDependencies: ["@godui/godui-theme"],
  files: [
    {
      path: "packages/components/src/magic-button/magic-button.tsx",
      target: "components/godui/magic-button.tsx",
      content: "export function MagicButton() { return null; }",
    },
  ],
  cssVars: { theme: { "animate-magic-rainbow": "magic-rainbow 2s linear" } },
};

function fakeClient(overrides: Partial<RegistryClient> = {}): RegistryClient {
  return {
    getIndex: async () => index,
    getComponent: async () => magicButtonItem,
    ...overrides,
  };
}

describe("listComponents", () => {
  it("lists all components by default", async () => {
    const out = await listComponents(fakeClient());
    expect(out).toContain("GodUI components (3)");
    expect(out).toContain("magic-button");
    expect(out).toContain("marquee");
    expect(out).toContain("number-ticker");
  });

  it("filters by category (case-insensitive)", async () => {
    const out = await listComponents(fakeClient(), "buttons");
    expect(out).toContain("magic-button");
    expect(out).not.toContain("marquee");
  });

  it("reports available categories when the filter has no matches", async () => {
    const out = await listComponents(fakeClient(), "nope");
    expect(out).toContain("No GodUI components found");
    expect(out).toContain("Buttons");
  });
});

describe("searchComponents", () => {
  it("matches on description terms", async () => {
    const out = await searchComponents(fakeClient(), "scrolling logos");
    expect(out.indexOf("marquee")).toBeGreaterThan(-1);
  });

  it("ranks name matches highest", async () => {
    const out = await searchComponents(fakeClient(), "number");
    const firstLine = out.split("\n").find((l) => l.startsWith("- "));
    expect(firstLine).toContain("number-ticker");
  });

  it("returns a helpful message on no match", async () => {
    const out = await searchComponents(fakeClient(), "xyzzy");
    expect(out).toContain("No GodUI components matched");
  });
});

describe("getComponent", () => {
  it("returns install command, deps, and source", async () => {
    const out = await getComponent(fakeClient(), "magic-button");
    expect(out).toContain("npx shadcn@latest add @godui/magic-button");
    expect(out).toContain("framer-motion");
    expect(out).toContain("export function MagicButton()");
    expect(out).toContain("CSS variables");
  });

  it("strips the @godui/ prefix from the name", async () => {
    let received = "";
    const client = fakeClient({
      getComponent: async (name) => {
        received = name;
        return magicButtonItem;
      },
    });
    await getComponent(client, "@godui/magic-button");
    expect(received).toBe("magic-button");
  });

  it("uses a variant URL install command when a variant is given", async () => {
    const out = await getComponent(
      fakeClient(),
      "gradient-background",
      "aurora-glow",
    );
    expect(out).toContain(
      'add "https://godui.design/r/gradient-background.json?variant=aurora-glow"',
    );
  });

  it("returns a friendly error when the component is missing", async () => {
    const client = fakeClient({
      getComponent: async () => {
        throw new Error("404 Not Found");
      },
    });
    const out = await getComponent(client, "does-not-exist");
    expect(out).toContain("Could not load GodUI component");
    expect(out).toContain("does-not-exist");
  });
});
