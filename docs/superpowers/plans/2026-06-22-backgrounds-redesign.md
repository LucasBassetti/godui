# PatternCraft Backgrounds Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the variant-union background components with generic `background`/`backgroundImage`/`backgroundSize`-prop components, move the 257 presets into docs/Storybook-only data modules, add an interactive docs picker, and serve per-variant installs through a dynamic registry route reading `?variant=`.

**Architecture:** A code generator emits, per category: a tiny generic `forwardRef` component (default variant's three CSS values baked as prop defaults, wrapped in `// @default-props:start/end` markers), a presets data module, and a bundled `*.source.ts` string of the formatted component. A package lib substitutes the marked block in that source string to build per-variant registry payloads; a Next route handler in the docs app wraps the lib and reads `?variant=`. The docs picker and Storybook consume the presets map.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Vitest + Testing Library, Biome, Next.js (App Router, Turbopack), Fumadocs, shadcn registry.

---

## Background / orientation (read before starting)

- Repo root: `/Users/lucasbassetti/conductor/workspaces/godui/papeete`. Branch `LucasBassetti/patterncraft-components` (PR #36 — this plan supersedes its v1 components).
- v1 to replace lives at `packages/components/src/{gradient,geometric,decorative,effect}-background/`.
- Vendored upstream data: `packages/components/scripts/vendor/patterncraft-patterns.ts` (exports `gridPatterns: Pattern[]`; each has `id`, `name`, `category` ∈ `gradients|geometric|decorative|effects`, `style: CSSProperties`). **Keep it.**
- Existing generator: `packages/components/scripts/generate-backgrounds.mjs` — **rewrite it** (Task 1).
- Package scripts: `generate:backgrounds` (chained biome), `lint` = `tsc -p tsconfig.json --noEmit`, `test` = `vitest run`.
- Biome ignores `**/scripts/vendor` (already in `biome.json`). `biome check --write <paths>` formats.
- Category → component/dir/dataSlot/default-variant mapping (default variant = first pattern in that category in source order):
  | category | component | dir | data-slot | default variant id |
  |---|---|---|---|---|
  | gradients | `GradientBackground` | `gradient-background` | `gradient-background` | `dark-radial-glow` |
  | geometric | `GeometricBackground` | `geometric-background` | `geometric-background` | `purple-gradient-grid-right` |
  | decorative | `DecorativeBackground` | `decorative-background` | `decorative-background` | `top-gradient-radial` |
  | effects | `EffectBackground` | `effect-background` | `effect-background` | `aurora-dream-corner-whispers` |
- The three style keys handled everywhere, in this fixed order: `background`, `backgroundImage`, `backgroundSize`. Presets may omit any of them.

---

## Task 1: Rewrite the generator (generic component + presets + source string)

**Files:**
- Modify (rewrite): `packages/components/scripts/generate-backgrounds.mjs`
- Generated (by running it): `packages/components/src/{cat}-background/{cat}-background.tsx`, `{cat}-background.presets.ts`, `{cat}-background.source.ts`, `index.ts`

- [ ] **Step 1: Replace the generator with the version below**

```js
// Generates the four PatternCraft background components from the vendored
// `gridPatterns` data. Re-run with `pnpm --filter @godui/components generate:backgrounds`.
//
// Per category it emits:
//   {dir}/{dir}.tsx          generic component, default variant's CSS baked as defaults
//   {dir}/{dir}.presets.ts   variants array + presets map (docs/Storybook only)
//   {dir}/{dir}.source.ts    the formatted .tsx as a bundled string (for the registry route)
//   {dir}/index.ts           re-exports
//
// Source: https://github.com/megh-bari/pattern-craft (src/data/patterns.ts)
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vendorPath = path.join(__dirname, "vendor", "patterncraft-patterns.ts");
const srcDir = path.join(__dirname, "..", "src");
const KEYS = ["background", "backgroundImage", "backgroundSize"];

const CATEGORIES = {
  gradients: { component: "GradientBackground", dir: "gradient-background" },
  geometric: { component: "GeometricBackground", dir: "geometric-background" },
  decorative: { component: "DecorativeBackground", dir: "decorative-background" },
  effects: { component: "EffectBackground", dir: "effect-background" },
};

function loadPatterns() {
  let src = fs.readFileSync(vendorPath, "utf8");
  src = src.replace(/import\s+\{[^}]*\}\s+from\s+["'][^"']*["'];?/g, "");
  src = src.replace(
    /export\s+const\s+gridPatterns\s*:\s*Pattern\[\]\s*=/,
    "const gridPatterns =",
  );
  // eslint-disable-next-line no-new-func
  return new Function(`${src}\nreturn gridPatterns;`)();
}

const camel = (component) => component.charAt(0).toLowerCase() + component.slice(1);
const pick = (style) => {
  const out = {};
  for (const k of KEYS) if (style[k] !== undefined) out[k] = style[k];
  return out;
};

// The default-props destructure block, built from a preset (omitting absent keys).
function defaultPropsBlock(preset) {
  return KEYS.map((k) =>
    preset[k] !== undefined
      ? `      ${k} = ${JSON.stringify(preset[k])},`
      : `      ${k},`,
  ).join("\n");
}

function componentSource({ component, dir, defaultPreset }) {
  const propsType = `${component}Props`;
  return `import * as React from "react";

export type ${propsType} = React.HTMLAttributes<HTMLDivElement> & {
  /** CSS \`background\` shorthand. */
  background?: string;
  /** CSS \`background-image\` (gradients, grids, masks). */
  backgroundImage?: string;
  /** CSS \`background-size\`. */
  backgroundSize?: string;
};

/**
 * Full-bleed background. Drop it as the first child of a \`relative\` container;
 * your content sits above it at \`z-raised\` or higher. Pass any of the three
 * background props to override the baked default.
 */
const ${component} = React.forwardRef<HTMLDivElement, ${propsType}>(
  (
    {
      // @default-props:start
${defaultPropsBlock(defaultPreset)}
      // @default-props:end
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="${dir}"
      aria-hidden="true"
      className={\`absolute inset-0 z-base \${className ?? ""}\`}
      style={{ background, backgroundImage, backgroundSize, ...style }}
      {...props}
    />
  ),
);
${component}.displayName = ${JSON.stringify(component)};

export { ${component} };
`;
}

function presetsSource({ component, patterns }) {
  const variantsConst = `${camel(component)}Variants`;
  const presetsConst = `${camel(component)}Presets`;
  const variantType = `${component}Variant`;
  const list = patterns.map((p) => `  ${JSON.stringify(p.id)},`).join("\n");
  const records = patterns
    .map((p) => {
      const entries = Object.entries(pick(p.style))
        .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
        .join("\n");
      return `  ${JSON.stringify(p.id)}: {\n${entries}\n  },`;
    })
    .join("\n");
  return `// AUTO-GENERATED by scripts/generate-backgrounds.mjs — do not edit by hand.
// Ported from PatternCraft (https://github.com/megh-bari/pattern-craft).

/** Every ${component} pattern id, in source order. */
export const ${variantsConst} = [
${list}
] as const;

export type ${variantType} = (typeof ${variantsConst})[number];

/** Raw CSS values for each ${component} variant. */
export const ${presetsConst}: Record<
  ${variantType},
  { background?: string; backgroundImage?: string; backgroundSize?: string }
> = {
${records}
};
`;
}

function indexSource({ component, dir }) {
  return `export { ${component}, type ${component}Props } from "./${dir}";
export {
  ${camel(component)}Presets,
  ${camel(component)}Variants,
  type ${component}Variant,
} from "./${dir}.presets";
export { ${camel(component)}Source } from "./${dir}.source";
`;
}

function main() {
  const patterns = loadPatterns();
  const byCategory = new Map();
  for (const p of patterns) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category).push(p);
  }

  const dirs = [];
  const summary = [];
  for (const [category, meta] of Object.entries(CATEGORIES)) {
    const group = byCategory.get(category) ?? [];
    if (group.length === 0) {
      console.warn(`! category "${category}" empty — skipping ${meta.component}`);
      continue;
    }
    const dir = path.join(srcDir, meta.dir);
    fs.mkdirSync(dir, { recursive: true });
    const defaultPreset = pick(group[0].style);
    fs.writeFileSync(
      path.join(dir, `${meta.dir}.tsx`),
      componentSource({ component: meta.component, dir: meta.dir, defaultPreset }),
    );
    fs.writeFileSync(
      path.join(dir, `${meta.dir}.presets.ts`),
      presetsSource({ component: meta.component, patterns: group }),
    );
    fs.writeFileSync(
      path.join(dir, "index.ts"),
      indexSource({ component: meta.component, dir: meta.dir }),
    );
    dirs.push(`src/${meta.dir}`);
    summary.push({ component: meta.component, dir: meta.dir, count: group.length });
  }

  // Format the .tsx/.presets/index so the .source.ts string captures the final
  // (post-biome) component text.
  const pkgDir = path.join(__dirname, "..");
  execSync(`pnpm exec biome check --write ${dirs.join(" ")}`, {
    cwd: pkgDir,
    stdio: "inherit",
  });

  // Emit the bundled source string from the formatted .tsx, then format again.
  for (const { component, dir } of summary) {
    const tsx = fs.readFileSync(path.join(srcDir, dir, `${dir}.tsx`), "utf8");
    fs.writeFileSync(
      path.join(srcDir, dir, `${dir}.source.ts`),
      `// AUTO-GENERATED by scripts/generate-backgrounds.mjs — do not edit by hand.\nexport const ${camel(component)}Source = ${JSON.stringify(tsx)};\n`,
    );
  }
  execSync(`pnpm exec biome check --write ${dirs.join(" ")}`, {
    cwd: pkgDir,
    stdio: "inherit",
  });

  console.log(
    "Generated:\n  " +
      summary.map((s) => `${s.component}: ${s.count} variants`).join("\n  "),
  );
}

main();
```

- [ ] **Step 2: Simplify the npm script (the generator now runs biome itself)**

In `packages/components/package.json`, set:

```json
"generate:backgrounds": "node scripts/generate-backgrounds.mjs",
```

- [ ] **Step 3: Run the generator**

Run: `pnpm --filter @godui/components generate:backgrounds`
Expected: prints `GradientBackground: 48 variants / GeometricBackground: 99 / DecorativeBackground: 44 / EffectBackground: 66`, and biome runs twice with no errors. Creates `.tsx`, `.presets.ts`, `.source.ts`, `index.ts` in each of the 4 dirs.

- [ ] **Step 4: Sanity-check generated output**

Run: `sed -n '1,40p' packages/components/src/geometric-background/geometric-background.tsx`
Expected: generic component with `// @default-props:start` / `:end` markers wrapping `background`/`backgroundImage`/`backgroundSize` defaults, `data-slot="geometric-background"`, no 257-entry record.

Run: `pnpm exec biome check packages/components/src/geometric-background`
Expected: `No fixes applied.`

- [ ] **Step 5: Commit**

```bash
git add packages/components/scripts/generate-backgrounds.mjs packages/components/package.json packages/components/src/gradient-background packages/components/src/geometric-background packages/components/src/decorative-background packages/components/src/effect-background
git commit -m "feat(components): generate generic background components + presets/source modules"
```

---

## Task 2: Update root barrel exports

**Files:**
- Modify: `packages/components/src/index.ts`

- [ ] **Step 1: Replace the four background export blocks**

The v1 blocks export `*Background`, `*BackgroundProps`, `*BackgroundVariant`, `*BackgroundVariants`. Replace all four with (keep them in the existing alphabetical position, Decorative/Effect after BorderBeam, Geometric/Gradient before Highlighter — the per-dir `index.ts` already re-exports everything, so import from the dir):

```ts
export {
  DecorativeBackground,
  decorativeBackgroundPresets,
  type DecorativeBackgroundProps,
  decorativeBackgroundVariants,
  type DecorativeBackgroundVariant,
} from "./decorative-background";
export {
  EffectBackground,
  effectBackgroundPresets,
  type EffectBackgroundProps,
  effectBackgroundVariants,
  type EffectBackgroundVariant,
} from "./effect-background";
export {
  GeometricBackground,
  geometricBackgroundPresets,
  type GeometricBackgroundProps,
  geometricBackgroundVariants,
  type GeometricBackgroundVariant,
} from "./geometric-background";
export {
  GradientBackground,
  gradientBackgroundPresets,
  type GradientBackgroundProps,
  gradientBackgroundVariants,
  type GradientBackgroundVariant,
} from "./gradient-background";
```

Do **not** export `*Source` from the root barrel — the registry lib imports those from the dir indexes directly (Task 3), keeping the public package surface clean.

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @godui/components lint`
Expected: passes (no output / exit 0).

- [ ] **Step 3: Format + commit**

```bash
pnpm exec biome check --write packages/components/src/index.ts
git add packages/components/src/index.ts
git commit -m "feat(components): export generic backgrounds + presets from barrel"
```

---

## Task 3: Registry lib + tests (per-variant file content)

**Files:**
- Create: `packages/components/src/lib/background-registry.ts`
- Test: `packages/components/src/lib/background-registry.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
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
    // value taken from the geometric presets map for that id
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
    expect(item?.files[0].content).toContain("oklch"); // not asserting exact; just non-empty source
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @godui/components exec vitest run src/lib/background-registry.test.ts`
Expected: FAIL — `Failed to resolve import "./background-registry"`.

- [ ] **Step 3: Implement the lib**

```ts
import {
  decorativeBackgroundPresets,
  decorativeBackgroundSource,
} from "../decorative-background";
import {
  effectBackgroundPresets,
  effectBackgroundSource,
} from "../effect-background";
import {
  geometricBackgroundPresets,
  geometricBackgroundSource,
} from "../geometric-background";
import {
  gradientBackgroundPresets,
  gradientBackgroundSource,
} from "../gradient-background";

type Preset = {
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
};

type Entry = {
  source: string;
  presets: Record<string, Preset>;
  defaultVariant: string;
  title: string;
};

const KEYS = ["background", "backgroundImage", "backgroundSize"] as const;

const REGISTRY: Record<string, Entry> = {
  "gradient-background": {
    source: gradientBackgroundSource,
    presets: gradientBackgroundPresets,
    defaultVariant: "dark-radial-glow",
    title: "Gradient Background",
  },
  "geometric-background": {
    source: geometricBackgroundSource,
    presets: geometricBackgroundPresets,
    defaultVariant: "purple-gradient-grid-right",
    title: "Geometric Background",
  },
  "decorative-background": {
    source: decorativeBackgroundSource,
    presets: decorativeBackgroundPresets,
    defaultVariant: "top-gradient-radial",
    title: "Decorative Background",
  },
  "effect-background": {
    source: effectBackgroundSource,
    presets: effectBackgroundPresets,
    defaultVariant: "aurora-dream-corner-whispers",
    title: "Effect Background",
  },
};

export const BACKGROUND_ITEMS = Object.keys(REGISTRY);

function block(preset: Preset): string {
  return KEYS.map((k) =>
    preset[k] !== undefined
      ? `      ${k} = ${JSON.stringify(preset[k])},`
      : `      ${k},`,
  ).join("\n");
}

export function buildBackgroundFileContent(
  name: string,
  variant?: string,
): string | null {
  const entry = REGISTRY[name];
  if (!entry) return null;
  const id =
    variant && variant in entry.presets ? variant : entry.defaultVariant;
  const preset = entry.presets[id];
  return entry.source.replace(
    /\/\/ @default-props:start[\s\S]*?\/\/ @default-props:end/,
    `// @default-props:start\n${block(preset)}\n      // @default-props:end`,
  );
}

export type BackgroundRegistryItem = {
  $schema: string;
  name: string;
  type: "registry:ui";
  title: string;
  registryDependencies: string[];
  files: Array<{
    path: string;
    type: "registry:ui";
    target: string;
    content: string;
  }>;
};

export function buildBackgroundRegistryItem(
  name: string,
  variant?: string,
): BackgroundRegistryItem | null {
  const entry = REGISTRY[name];
  const content = buildBackgroundFileContent(name, variant);
  if (!entry || content === null) return null;
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    title: entry.title,
    registryDependencies: ["@godui/godui-theme"],
    files: [
      {
        path: `packages/components/src/${name}/${name}.tsx`,
        type: "registry:ui",
        target: `components/godui/${name}.tsx`,
        content,
      },
    ],
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @godui/components exec vitest run src/lib/background-registry.test.ts`
Expected: PASS (6 assertions). If the first test fails on a whitespace diff, the `.source.ts` is stale — re-run `generate:backgrounds` (Task 1 Step 3) and retry.

- [ ] **Step 5: Typecheck + format + commit**

```bash
pnpm --filter @godui/components lint
pnpm exec biome check --write packages/components/src/lib/background-registry.ts packages/components/src/lib/background-registry.test.ts
git add packages/components/src/lib/background-registry.ts packages/components/src/lib/background-registry.test.ts
git commit -m "feat(components): registry lib that bakes a variant into the background file"
```

---

## Task 4: Generic-component render test

**Files:**
- Test: `packages/components/src/background-components.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GeometricBackground } from "./geometric-background";

describe("GeometricBackground", () => {
  it("spreads background props into inline style", () => {
    const { container } = render(
      <GeometricBackground
        background="rgb(1, 2, 3)"
        backgroundSize="40px 40px"
      />,
    );
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el).not.toBeNull();
    expect(el?.style.background).toContain("rgb(1, 2, 3)");
    expect(el?.style.backgroundSize).toBe("40px 40px");
  });

  it("renders the baked default variant when given no props", () => {
    const { container } = render(<GeometricBackground />);
    const el = container.querySelector<HTMLElement>(
      '[data-slot="geometric-background"]',
    );
    expect(el?.style.backgroundImage).not.toBe("");
  });

  it("forwards arbitrary div attributes and className", () => {
    const { container } = render(
      <GeometricBackground className="custom" data-testid="bg" />,
    );
    const el = container.querySelector<HTMLElement>('[data-slot="geometric-background"]');
    expect(el?.className).toContain("custom");
    expect(el?.getAttribute("data-testid")).toBe("bg");
  });
});
```

- [ ] **Step 2: Run it**

Run: `pnpm --filter @godui/components exec vitest run src/background-components.test.tsx`
Expected: PASS (3 assertions). (Implementation already exists from Task 1 — this guards the generic API.)

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/background-components.test.tsx
git commit -m "test(components): generic background component props"
```

---

## Task 5: Dynamic registry route in docs + exclude backgrounds from static build

**Files:**
- Create: `apps/docs/src/app/r/[item]/route.ts`
- Modify: `registry.json` (remove the 4 background entries)
- Delete: `apps/docs/public/r/{gradient,geometric,decorative,effect}-background.json`

- [ ] **Step 1: Add the route handler**

First open `apps/docs/src/app/api/search/route.ts` to confirm the repo's Next version
param convention. **Next 15 passes `params` as a Promise** — if the existing route `await`s
its context, mirror that. The version below uses the Next 15 async form (adjust to sync only
if the repo is on Next 14):

```ts
import { buildBackgroundRegistryItem } from "@godui/components/registry";
import type { NextRequest } from "next/server";

// Background items are served dynamically (not by `shadcn build`) so the CLI can
// bake a chosen variant's CSS via `?variant=`. Every other registry item is a
// static file in public/r and never reaches this handler.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  const { item: rawItem } = await params;
  const name = rawItem.replace(/\.json$/, "");
  const variant = request.nextUrl.searchParams.get("variant") ?? undefined;
  const item = buildBackgroundRegistryItem(name, variant);
  if (!item) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json(item);
}
```

- [ ] **Step 2: Export the registry lib from the package via a subpath**

In `packages/components/package.json`, add to `exports`:

```json
"./registry": {
  "types": "./src/lib/background-registry.ts",
  "default": "./src/lib/background-registry.ts"
}
```

(The docs app already transpiles `@godui/components`; the subpath import resolves to the TS source.)

- [ ] **Step 3: Remove the 4 background entries from `registry.json`**

Delete the four objects whose `name` is `gradient-background`, `geometric-background`, `decorative-background`, `effect-background` from the `items` array in `registry.json` (added in PR #36). Verify valid JSON:

Run: `node -e "JSON.parse(require('fs').readFileSync('registry.json','utf8')); console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Delete the stale static background JSONs**

```bash
rm apps/docs/public/r/gradient-background.json apps/docs/public/r/geometric-background.json apps/docs/public/r/decorative-background.json apps/docs/public/r/effect-background.json
```

- [ ] **Step 5: Rebuild the static registry (without backgrounds)**

Run: `pnpm build:registry`
Expected: build succeeds; no `Building gradient-background…` lines. Confirm:
Run: `ls apps/docs/public/r | grep background || echo "none (correct)"`
Expected: `none (correct)`.

- [ ] **Step 6: Start docs dev and exercise the route**

Run (background): `pnpm --filter docs dev`
Then:
Run: `curl -s "http://localhost:3000/r/geometric-background.json?variant=purple-gradient-grid-left" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log(j.name, j.files[0].target); console.log(j.files[0].content.includes('circle 800px at 0% 200px'))})"`
Expected: `geometric-background components/godui/geometric-background.tsx` then `true`.
Run: `curl -s "http://localhost:3000/r/geometric-background.json" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);console.log(j.files[0].content.includes('// @default-props:start'))})"`
Expected: `true` (default variant served when no `?variant`).

- [ ] **Step 7: Commit**

```bash
git add apps/docs/src/app/r/[item]/route.ts packages/components/package.json registry.json apps/docs/public/r
git commit -m "feat(docs): dynamic registry route bakes ?variant into background installs"
```

---

## Task 6: Interactive docs picker (`BackgroundShowcase`)

**Files:**
- Create: `apps/docs/src/components/background-showcase.tsx`
- Modify: `apps/docs/src/components/mdx.tsx` (register the component)

- [ ] **Step 1: Build the showcase client component**

```tsx
"use client";

import {
  DecorativeBackground,
  decorativeBackgroundPresets,
  decorativeBackgroundVariants,
  EffectBackground,
  effectBackgroundPresets,
  effectBackgroundVariants,
  GeometricBackground,
  geometricBackgroundPresets,
  geometricBackgroundVariants,
  GradientBackground,
  gradientBackgroundPresets,
  gradientBackgroundVariants,
} from "@godui/components";
import { type ComponentType, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/cn";

const REGISTRY_BASE = "https://godui.design/r";

type Preset = {
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
};

type Key = "gradient" | "geometric" | "decorative" | "effect";

const SETS: Record<
  Key,
  {
    name: string;
    component: string;
    Component: ComponentType<Preset & { className?: string }>;
    variants: readonly string[];
    presets: Record<string, Preset>;
  }
> = {
  gradient: {
    name: "gradient-background",
    component: "GradientBackground",
    Component: GradientBackground,
    variants: gradientBackgroundVariants,
    presets: gradientBackgroundPresets,
  },
  geometric: {
    name: "geometric-background",
    component: "GeometricBackground",
    Component: GeometricBackground,
    variants: geometricBackgroundVariants,
    presets: geometricBackgroundPresets,
  },
  decorative: {
    name: "decorative-background",
    component: "DecorativeBackground",
    Component: DecorativeBackground,
    variants: decorativeBackgroundVariants,
    presets: decorativeBackgroundPresets,
  },
  effect: {
    name: "effect-background",
    component: "EffectBackground",
    Component: EffectBackground,
    variants: effectBackgroundVariants,
    presets: effectBackgroundPresets,
  },
};

function propLines(preset: Preset): string {
  return (["background", "backgroundImage", "backgroundSize"] as const)
    .filter((k) => preset[k] !== undefined)
    .map((k) => `  ${k}={${JSON.stringify(preset[k])}}`)
    .join("\n");
}

export function BackgroundShowcase({ component }: { component: Key }) {
  const set = SETS[component];
  const [selected, setSelected] = useState(set.variants[0]);
  const preset = set.presets[selected];
  const Bg = set.Component;

  const usage = `import { ${set.component} } from "@/components/godui/${set.name}";

<${set.component}\n${propLines(preset)}\n/>`;
  const install = `pnpm dlx shadcn@latest add "${REGISTRY_BASE}/${set.name}.json?variant=${selected}"`;

  return (
    <div className="not-prose my-8 flex flex-col gap-4">
      {/* horizontal variant picker */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {set.variants.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setSelected(variant)}
            aria-pressed={variant === selected}
            title={variant}
            className={cn(
              "relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-colors",
              variant === selected
                ? "border-fd-primary ring-2 ring-fd-primary"
                : "border-fd-border hover:border-fd-primary/50",
            )}
          >
            <Bg {...set.presets[variant]} />
          </button>
        ))}
      </div>

      {/* live preview */}
      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-fd-border">
        <Bg {...preset} />
        <span className="relative z-10 rounded-md bg-fd-background/70 px-3 py-1 text-sm backdrop-blur">
          {selected}
        </span>
      </div>

      {/* install command */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-fd-border bg-fd-muted/40 px-3 py-2 font-mono text-xs">
        <code className="overflow-x-auto whitespace-nowrap">{install}</code>
        <CopyButton value={install} />
      </div>

      {/* usage snippet */}
      <div className="relative rounded-lg border border-fd-border bg-fd-muted/40 p-3">
        <pre className="overflow-x-auto font-mono text-xs">
          <code>{usage}</code>
        </pre>
        <span className="absolute top-2 right-2">
          <CopyButton value={usage} />
        </span>
      </div>
    </div>
  );
}
```

Note: confirm the `CopyButton` prop name at `apps/docs/src/components/copy-button.tsx` before finishing — if it is not `value`, adjust the two `<CopyButton .../>` usages to the actual prop.

- [ ] **Step 2: Register it globally in MDX**

In `apps/docs/src/components/mdx.tsx`, import and add `BackgroundShowcase` to the components map (same place `ComponentPreview` / `ComponentInstall` are registered):

```tsx
import { BackgroundShowcase } from "@/components/background-showcase";
// ...inside the components object:
    BackgroundShowcase,
```

- [ ] **Step 3: Typecheck + lint docs**

Run: `pnpm --filter docs lint`
Expected: eslint passes.
Run: `pnpm exec biome check --write apps/docs/src/components/background-showcase.tsx apps/docs/src/components/mdx.tsx`
Expected: formats cleanly.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/components/background-showcase.tsx apps/docs/src/components/mdx.tsx
git commit -m "feat(docs): interactive BackgroundShowcase variant picker"
```

---

## Task 7: Rewrite the four docs MDX pages

**Files:**
- Modify: `apps/docs/content/docs/components/backgrounds/{gradient,geometric,decorative,effect}-background.mdx`

- [ ] **Step 1: Rewrite `gradient-background.mdx`**

```mdx
---
title: Gradient Background
description: Full-bleed gradient backgrounds — radial glows, aurora washes, and depth fades.
---

A full-bleed gradient layer. Drop it as the first child of a `relative overflow-hidden`
container and your content sits above it. Pick a look below — 48 gradients ported from
[PatternCraft](https://patterncraft.fun). The component itself just takes `background`,
`backgroundImage`, and `backgroundSize`; the picker fills them in.

<BackgroundShowcase component="gradient" />

## Usage

```tsx
import { GradientBackground } from "@/components/godui/gradient-background";

<div className="relative overflow-hidden">
  <GradientBackground />
  <YourContent />
</div>
```

Install a specific variant straight from the CLI (the chosen variant's CSS is baked into the
file):

```bash
pnpm dlx shadcn@latest add "https://godui.design/r/gradient-background.json?variant=aurora-waves"
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `background` | `string` | default variant | CSS `background` shorthand |
| `backgroundImage` | `string` | default variant | CSS `background-image` (gradients, masks) |
| `backgroundSize` | `string` | default variant | CSS `background-size` |

All other `div` attributes (`className`, `style`, …) are forwarded to the layer.
```

- [ ] **Step 2: Rewrite the other three pages**

Identical structure; swap only the four tokens below (title, description blurb count/word, `component=` key, default `?variant=` example, and the import/component name). Use the table:

| file | title | component key | count + kind | example variant |
|---|---|---|---|---|
| `geometric-background.mdx` | Geometric Background | `geometric` | 99 grids, dashed grids, diagonal crosses & masked fades | `purple-gradient-grid-left` |
| `decorative-background.mdx` | Decorative Background | `decorative` | 44 radial & corner gradient washes | `bottom-gradient-radial` |
| `effect-background.mdx` | Effect Background | `effect` | 66 radial glows, aurora dreams & soft pastel washes | `aurora-dream-soft-harmony` |

For example, `geometric-background.mdx`:

```mdx
---
title: Geometric Background
description: Full-bleed geometric backgrounds — grids, dashed grids, diagonal crosses, and masked fades.
---

A full-bleed geometric layer. Drop it as the first child of a `relative overflow-hidden`
container and your content sits above it. Pick a look below — 99 patterns ported from
[PatternCraft](https://patterncraft.fun). The component itself just takes `background`,
`backgroundImage`, and `backgroundSize`; the picker fills them in.

<BackgroundShowcase component="geometric" />

## Usage

```tsx
import { GeometricBackground } from "@/components/godui/geometric-background";

<div className="relative overflow-hidden">
  <GeometricBackground />
  <YourContent />
</div>
```

Install a specific variant straight from the CLI (the chosen variant's CSS is baked into the
file):

```bash
pnpm dlx shadcn@latest add "https://godui.design/r/geometric-background.json?variant=purple-gradient-grid-left"
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `background` | `string` | default variant | CSS `background` shorthand |
| `backgroundImage` | `string` | default variant | CSS `background-image` (gradients, grids, masks) |
| `backgroundSize` | `string` | default variant | CSS `background-size` |

All other `div` attributes (`className`, `style`, …) are forwarded to the layer.
```

Produce `decorative-background.mdx` and `effect-background.mdx` the same way using the token table (component name = `DecorativeBackground` / `EffectBackground`, import path `decorative-background` / `effect-background`).

- [ ] **Step 3: Verify no `<p>`-in-`<p>` and that pages render**

With `docs:dev` running, open `/docs/components/backgrounds/gradient-background` (and the other three). Confirm: picker row renders all swatches, selecting updates preview + install + usage, browser console shows **no** hydration error.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/content/docs/components/backgrounds
git commit -m "docs: backgrounds pages use the interactive showcase"
```

---

## Task 8: Storybook stories use the presets map

**Files:**
- Modify: `apps/storybook/src/stories/{gradient,geometric,decorative,effect}-background.stories.tsx`

- [ ] **Step 1: Rewrite `gradient-background.stories.tsx`**

```tsx
import {
  GradientBackground,
  type GradientBackgroundProps,
  gradientBackgroundPresets,
  gradientBackgroundVariants,
  type GradientBackgroundVariant,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

type ShowcaseArgs = GradientBackgroundProps & { variant: GradientBackgroundVariant };

const meta: Meta<ShowcaseArgs> = {
  title: "Backgrounds/Gradient Background",
  component: GradientBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: gradientBackgroundVariants },
    background: { table: { disable: true } },
    backgroundImage: { table: { disable: true } },
    backgroundSize: { table: { disable: true } },
  },
  args: { variant: gradientBackgroundVariants[0] },
};

export default meta;
type Story = StoryObj<ShowcaseArgs>;

export const Default: Story = {
  render: ({ variant }) => (
    <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      <GradientBackground {...gradientBackgroundPresets[variant]} />
      <p className="relative z-raised rounded-lg bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
        {variant}
      </p>
    </div>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
      {gradientBackgroundVariants.map((variant) => (
        <div
          key={variant}
          className="relative flex h-40 items-end overflow-hidden rounded-lg border border-border"
        >
          <GradientBackground {...gradientBackgroundPresets[variant]} />
          <span className="relative z-raised w-full truncate bg-background/70 px-2 py-1 text-xs text-foreground backdrop-blur">
            {variant}
          </span>
        </div>
      ))}
    </div>
  ),
};
```

- [ ] **Step 2: Produce the other three stories**

Same file, swap the import names + `title`: `Geometric`/`geometric`, `Decorative`/`decorative`, `Effect`/`effect` (component `GeometricBackground` etc., consts `geometricBackgroundPresets`/`geometricBackgroundVariants`, type `GeometricBackgroundVariant`, title `Backgrounds/Geometric Background`). Everything else identical.

- [ ] **Step 3: Typecheck Storybook**

Run: `pnpm --filter storybook lint`
Expected: passes.

- [ ] **Step 4: Format + commit**

```bash
pnpm exec biome check --write apps/storybook/src/stories/gradient-background.stories.tsx apps/storybook/src/stories/geometric-background.stories.tsx apps/storybook/src/stories/decorative-background.stories.tsx apps/storybook/src/stories/effect-background.stories.tsx
git add apps/storybook/src/stories
git commit -m "test(storybook): background stories drive the generic component via presets"
```

---

## Task 9: Full verification + skill doc update

**Files:**
- Modify: `.agents/skills/godui-component-creation/SKILL.md` (note the registry-route pattern)

- [ ] **Step 1: Run the whole package test + typecheck suite**

Run: `pnpm --filter @godui/components test`
Expected: all pass (including the two new test files).
Run: `pnpm --filter @godui/components lint && pnpm --filter storybook lint && pnpm --filter docs lint`
Expected: all pass.

- [ ] **Step 2: Confirm generator is idempotent + biome-clean**

Run: `pnpm --filter @godui/components generate:backgrounds && pnpm exec biome check packages/components/src/gradient-background packages/components/src/geometric-background packages/components/src/decorative-background packages/components/src/effect-background`
Expected: `No fixes applied.` and `git diff --stat packages/components/src` shows no changes (idempotent).

- [ ] **Step 3: Confirm registry has no static backgrounds**

Run: `ls apps/docs/public/r | grep background || echo "none (correct)"`
Expected: `none (correct)`.

- [ ] **Step 4: Add a short note to the component-creation skill**

In `.agents/skills/godui-component-creation/SKILL.md`, under the Docs section, add:

> **Parameterized installs:** components whose install should bake a choice (e.g. a
> background variant) are served by the dynamic route `apps/docs/src/app/r/[item]/route.ts`
> via `?variant=`, not by `shadcn build`. Such items are removed from `registry.json` so the
> route owns `/r/{name}.json`, and the install command is the full-URL form
> `shadcn add "https://godui.design/r/{name}.json?variant=…"`.

- [ ] **Step 5: Commit + update the open PR**

```bash
git add .agents/skills/godui-component-creation/SKILL.md
git commit -m "docs(skill): note parameterized registry-route installs"
git push
```

Expected: PR #36 updates with the redesigned approach.

---

## Self-review notes (already reconciled)

- **Runtime source in prod:** the route imports `*Source` strings (bundled), so no `fs`/file-tracing — works on Vercel.
- **`.source.ts` ↔ `.tsx` sync:** the generator writes `.source.ts` from the post-biome `.tsx`; the Task 3 test asserts `buildBackgroundFileContent(default) === on-disk .tsx`, catching any drift.
- **Static/route collision:** backgrounds are deleted from `public/r` and dropped from `registry.json`, so the route is the sole owner; all other items remain static (route never reached for them).
- **Presets with missing keys:** `block()` / `propLines()` omit absent keys consistently in the generator, lib, and showcase.
