import type { Decorator } from "@storybook/react";

/**
 * Framing decorators for the GodUI Playground. They replace the ad-hoc
 * `<div style={{ maxWidth }}>` wrappers scattered across stories so every
 * component is presented on a consistent, premium-feeling stage.
 */

/** Center the component in the canvas, optionally capping its width. */
export const centered =
  (maxWidth?: number): Decorator =>
  (Story) => (
    <div className="flex w-full items-center justify-center">
      <div style={maxWidth ? { width: "100%", maxWidth } : undefined}>
        <Story />
      </div>
    </div>
  );

/** Constrained, left-aligned column for wider components (forms, composers). */
export const padded =
  (maxWidth = 640): Decorator =>
  (Story) => (
    <div className="mx-auto w-full" style={{ maxWidth }}>
      <Story />
    </div>
  );

export type EffectStageOptions = {
  /** Headline overlaid on the effect. */
  title?: string;
  /** Sub-line under the headline. */
  subtitle?: string;
  /** Stage height. Number → px, string → raw CSS (e.g. "60vh"). */
  height?: number | string;
  /** Hide the overlay text entirely (let the effect speak for itself). */
  bare?: boolean;
};

/**
 * Full-bleed framed stage for background / effect components: a `relative`,
 * `overflow-hidden` surface that hosts the effect as its first child with an
 * optional centered heading floating above it.
 */
export const effectStage =
  ({
    title,
    subtitle,
    height = "60vh",
    bare = false,
  }: EffectStageOptions = {}): Decorator =>
  (Story) => (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-background"
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
    >
      <Story />
      {!bare && (title || subtitle) ? (
        <div className="pointer-events-none relative z-raised px-6 text-center">
          {title ? (
            <h1 className="font-semibold text-4xl tracking-tight">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

/** Generic fixed-size box for components that just need room to render. */
export const box =
  (width: number | string, height: number | string): Decorator =>
  (Story) => (
    <div
      className="flex items-center justify-center"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <Story />
    </div>
  );
