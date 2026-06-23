"use client";

import {
  DecorativeBackground,
  decorativeBackgroundPresets,
  decorativeBackgroundVariants,
  EffectBackground,
  effectBackgroundPresets,
  effectBackgroundVariants,
  GeometricBackground,
  GradientBackground,
  geometricBackgroundPresets,
  geometricBackgroundVariants,
  gradientBackgroundPresets,
  gradientBackgroundVariants,
} from "@godui/components";
import { type ComponentType, useState } from "react";
import { ComponentInstall } from "@/components/component-install";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/cn";

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

  return (
    <div className="not-prose my-8 flex flex-col gap-4">
      {/* horizontal variant picker — p-2 leaves room for the selected ring,
          which the overflow-x-auto row would otherwise clip */}
      <div className="flex gap-2 overflow-x-auto p-2">
        {set.variants.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => setSelected(variant)}
            aria-pressed={variant === selected}
            title={variant}
            className={cn(
              "relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition",
              variant === selected
                ? "border-fd-primary ring-2 ring-fd-primary ring-offset-2 ring-offset-fd-background"
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

      {/* install — same tabbed pattern as every component, with the selected
          variant baked into the command + Manual source */}
      <ComponentInstall name={set.name} variant={selected} />

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
