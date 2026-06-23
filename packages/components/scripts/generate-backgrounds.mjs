// Generates the four PatternCraft background components from the vendored
// `gridPatterns` data. Re-run with `pnpm --filter @godui/components generate:backgrounds`.
//
// Per category it emits:
//   {dir}/{dir}.tsx          generic component, default variant's full style baked
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

// Longhands the `background` shorthand resets. When a preset sets `background`
// alongside any of these, `background` is the color layer — store it as
// backgroundColor so a single style object never mixes shorthand + longhand
// (which triggers React's re-render styling warning).
const BG_LONGHANDS = [
  "backgroundColor",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
];

const CATEGORIES = {
  gradients: { component: "GradientBackground", dir: "gradient-background" },
  geometric: { component: "GeometricBackground", dir: "geometric-background" },
  decorative: {
    component: "DecorativeBackground",
    dir: "decorative-background",
  },
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

const camel = (component) =>
  component.charAt(0).toLowerCase() + component.slice(1);

// Normalize a PatternCraft style for safe inline use:
//  - drop `animation` (its @keyframes live in the upstream JSX, not the data)
//  - demote the `background` shorthand to backgroundColor when a longhand is set
function normalize(style) {
  const out = {};
  for (const [k, v] of Object.entries(style)) {
    if (k === "animation") continue;
    out[k] = v;
  }
  if (
    out.background !== undefined &&
    BG_LONGHANDS.some((k) => out[k] !== undefined)
  ) {
    if (out.backgroundColor === undefined) out.backgroundColor = out.background;
    delete out.background;
  }
  return out;
}

// Serialize a style object into `key: value,` lines at the given indent.
function styleLines(style, indent) {
  const pad = " ".repeat(indent);
  return Object.entries(style)
    .map(([k, v]) => `${pad}${k}: ${JSON.stringify(v)},`)
    .join("\n");
}

function componentSource({ component, dir, defaultStyle }) {
  const propsType = `${component}Props`;
  return `import * as React from "react";

export type ${propsType} = React.HTMLAttributes<HTMLDivElement>;

// Background-defining keys. When the caller supplies any of these via \`style\`,
// they own the background and the baked default is dropped — merging a partial
// override with the default would mix CSS shorthand + longhand.
const BACKGROUND_KEYS = [
  "background",
  "backgroundColor",
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundBlendMode",
] as const;

const baseStyle = {
  // @default-props:start
${styleLines(defaultStyle, 2)}
  // @default-props:end
} as React.CSSProperties;

/**
 * Full-bleed background. Drop it as the first child of a \`relative\` container;
 * your content sits above it at \`z-raised\` or higher. Renders the baked pattern
 * by default; pass \`style\` to supply your own background.
 */
const ${component} = React.forwardRef<HTMLDivElement, ${propsType}>(
  ({ className, style, ...props }, ref) => {
    const ownsBackground =
      style != null && BACKGROUND_KEYS.some((key) => key in style);
    return (
      <div
        ref={ref}
        data-slot="${dir}"
        aria-hidden="true"
        className={\`absolute inset-0 z-base \${className ?? ""}\`}
        style={ownsBackground ? style : { ...baseStyle, ...style }}
        {...props}
      />
    );
  },
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
    .map(
      (p) =>
        `  ${JSON.stringify(p.id)}: {\n${styleLines(normalize(p.style), 4)}\n  },`,
    )
    .join("\n");
  return `// AUTO-GENERATED by scripts/generate-backgrounds.mjs — do not edit by hand.
// Ported from PatternCraft (https://github.com/megh-bari/pattern-craft).
import type { CSSProperties } from "react";

/** Every ${component} pattern id, in source order. */
export const ${variantsConst} = [
${list}
] as const;

export type ${variantType} = (typeof ${variantsConst})[number];

/** The full inline style for each ${component} variant. */
export const ${presetsConst}: Record<${variantType}, CSSProperties> = {
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
      console.warn(
        `! category "${category}" empty — skipping ${meta.component}`,
      );
      continue;
    }
    const dir = path.join(srcDir, meta.dir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${meta.dir}.tsx`),
      componentSource({
        component: meta.component,
        dir: meta.dir,
        defaultStyle: normalize(group[0].style),
      }),
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
    summary.push({
      component: meta.component,
      dir: meta.dir,
      count: group.length,
    });
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
