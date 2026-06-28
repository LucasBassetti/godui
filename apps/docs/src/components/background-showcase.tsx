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
import {
  type ComponentType,
  type CSSProperties,
  useMemo,
  useState,
} from "react";
import { ComponentInstall } from "@/components/component-install";
import { ComponentPreview } from "@/components/component-preview";
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

/** Serialize a preset's CSSProperties into the usage snippet for the Code tab. */
function buildCode(set: (typeof SETS)[Key], preset: CSSProperties) {
  const style = Object.entries(preset)
    .map(([key, value]) => `          ${key}: ${JSON.stringify(value)},`)
    .join("\n");
  return `import { ${set.component} } from "@/components/godui/${set.name}";

export function ${set.component}Demo() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-border">
      <${set.component}
        style={{
${style}
        }}
      />
    </div>
  );
}`;
}

export function BackgroundShowcase({ component }: { component: Key }) {
  const set = SETS[component];
  const [selected, setSelected] = useState(set.variants[0]);
  const preset = set.presets[selected];
  const Bg = set.Component;
  const code = useMemo(() => buildCode(set, preset), [set, preset]);

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

      {/* live preview — the selected variant drives both the canvas and the
          Code tab, full-bleed inside the preview box */}
      <ComponentPreview fullWidth className="my-0!" code={code}>
        <div className="relative w-full flex-1 overflow-hidden">
          <Bg style={preset} />
        </div>
      </ComponentPreview>

      {/* install — same tabbed pattern as every component, with the selected
          variant baked into the command + Manual source */}
      <ComponentInstall name={set.name} variant={selected} />
    </div>
  );
}
