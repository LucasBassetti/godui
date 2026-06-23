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
import { type ComponentType, type CSSProperties, useState } from "react";
import { ComponentInstall } from "@/components/component-install";
import { cn } from "@/lib/cn";

type Key = "gradient" | "geometric" | "decorative" | "effect";

const SETS: Record<
  Key,
  {
    name: string;
    component: string;
    Component: ComponentType<{ style?: CSSProperties; className?: string }>;
    variants: readonly string[];
    presets: Record<string, CSSProperties>;
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

export function BackgroundShowcase({ component }: { component: Key }) {
  const set = SETS[component];
  const [selected, setSelected] = useState(set.variants[0]);
  const preset = set.presets[selected];
  const Bg = set.Component;

  // Geometric grids/dashes look like flat colour in a tiny swatch (you only see
  // one cell). Render them into a larger, scaled-down box so several tiles show.
  const dense = component === "geometric";

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
            {dense ? (
              <span className="absolute top-0 left-0 h-[250%] w-[250%] origin-top-left scale-[0.4]">
                <Bg style={set.presets[variant]} />
              </span>
            ) : (
              <Bg style={set.presets[variant]} />
            )}
          </button>
        ))}
      </div>

      {/* live preview */}
      <div className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-fd-border">
        <Bg style={preset} />
        <span className="relative z-10 rounded-md bg-fd-background/70 px-3 py-1 text-sm backdrop-blur">
          {selected}
        </span>
      </div>

      {/* install — same tabbed pattern as every component, with the selected
          variant baked into the command + Manual source */}
      <ComponentInstall name={set.name} variant={selected} />
    </div>
  );
}
