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
