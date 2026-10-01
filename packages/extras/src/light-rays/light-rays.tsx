"use client";

import * as React from "react";

export type LightRaysProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of rays in the fan. */
  rayCount?: number;
  /**
   * Ray color, any CSS color string. Defaults to the `--color-primary` token.
   */
  color?: string;
  /** Sweep speed multiplier. `1` is the calm default. */
  speed?: number;
  /** Base angle (deg) the fan points from. */
  angle?: number;
  /** Overall ray opacity, `0`–`1`. */
  intensity?: number;
  /** Film-grain amount, `0`–`1`. `0` disables the grain layer. */
  grain?: number;
};

/**
 * Volumetric light rays — a soft fan of god-rays that slowly sweeps and
 * breathes, with optional film grain. Pure CSS. Drop it as the first child of a
 * `relative overflow-hidden` container; your content sits above it.
 */
const LightRays = React.forwardRef<HTMLDivElement, LightRaysProps>(
  (
    {
      className,
      style,
      rayCount = 14,
      color = "var(--primary)",
      speed = 1,
      angle = 0,
      intensity = 0.6,
      grain = 0.05,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
    const grainId = `light-rays-grain-${React.useId().replace(/:/g, "")}`;

    const step = 360 / rayCount;
    const rayColor = `color-mix(in oklab, ${color}, transparent 55%)`;

    return (
      <div
        ref={rootRef}
        data-slot="light-rays"
        aria-hidden="true"
        className={`absolute inset-0 z-base overflow-hidden ${className ?? ""}`}
        style={
          {
            "--rays-speed": `${14 / speed}s`,
            "--rays-angle": `${angle}deg`,
            "--rays-intensity": `${intensity}`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Source glow at the top. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 40% at 50% -5%, color-mix(in oklab, ${color}, transparent 70%), transparent 70%)`,
          }}
        />

        {/* The ray fan — oversized so rotation never reveals an edge, blurred for
            softness, and faded out toward the bottom. */}
        <div
          className="absolute inset-[-50%] origin-top motion-reduce:animate-none animate-light-rays-sweep [will-change:transform,opacity]"
          style={{
            backgroundImage: `repeating-conic-gradient(from ${angle}deg at 50% 0%, transparent 0deg, ${rayColor} ${step * 0.16}deg, transparent ${step}deg)`,
            filter: "blur(8px)",
            opacity: intensity,
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 10%, transparent 75%)",
            maskImage: "linear-gradient(to bottom, #000 10%, transparent 75%)",
          }}
        />

        {/* Film grain. */}
        {grain > 0 && (
          <svg
            className="absolute inset-0 size-full mix-blend-overlay"
            style={{ opacity: grain }}
            role="presentation"
          >
            <filter id={grainId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${grainId})`} />
          </svg>
        )}
      </div>
    );
  },
);
LightRays.displayName = "LightRays";

export { LightRays };
