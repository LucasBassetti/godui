import type { CSSProperties } from "react";
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
import backgroundCatalog from "./background-catalog.json";

type Entry = {
  description: string;
  registryDependencies: string[];
  source: string;
  presets: Record<string, CSSProperties>;
  defaultVariant: string;
  title: string;
};

const REGISTRY: Record<string, Entry> = {
  "gradient-background": {
    ...backgroundCatalog["gradient-background"],
    source: gradientBackgroundSource,
    presets: gradientBackgroundPresets,
    defaultVariant: "dark-radial-glow",
  },
  "geometric-background": {
    ...backgroundCatalog["geometric-background"],
    source: geometricBackgroundSource,
    presets: geometricBackgroundPresets,
    defaultVariant: "purple-gradient-grid-right",
  },
  "decorative-background": {
    ...backgroundCatalog["decorative-background"],
    source: decorativeBackgroundSource,
    presets: decorativeBackgroundPresets,
    defaultVariant: "top-gradient-radial",
  },
  "effect-background": {
    ...backgroundCatalog["effect-background"],
    source: effectBackgroundSource,
    presets: effectBackgroundPresets,
    defaultVariant: "aurora-dream-corner-whispers",
  },
};

export const BACKGROUND_ITEMS = Object.keys(REGISTRY);

// The component's `baseStyle` block sits between these markers, indented two
// spaces (inside the object literal). Re-serialize a variant's style the same
// way so a swapped block matches the surrounding format.
function styleBlock(style: CSSProperties): string {
  return Object.entries(style)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join("\n");
}

export function buildBackgroundFileContent(
  name: string,
  variant?: string,
): string | null {
  const entry = REGISTRY[name];
  if (!entry) return null;
  const id =
    variant && Object.hasOwn(entry.presets, variant)
      ? variant
      : entry.defaultVariant;
  // The committed source already bakes the default variant.
  if (id === entry.defaultVariant) return entry.source;
  return entry.source.replace(
    /\/\/ @default-props:start[\s\S]*?\/\/ @default-props:end/,
    `// @default-props:start\n${styleBlock(entry.presets[id])}\n  // @default-props:end`,
  );
}

export type BackgroundRegistryItem = {
  $schema: string;
  name: string;
  type: "registry:ui";
  title: string;
  description: string;
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
    description: entry.description,
    registryDependencies: entry.registryDependencies,
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
