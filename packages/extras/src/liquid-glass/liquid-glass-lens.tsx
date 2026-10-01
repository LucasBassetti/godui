"use client";

import * as React from "react";
import {
  buildDisplacementMap,
  mergeRefs,
  RefractionFilter,
  useRefractionSupport,
} from "./liquid-glass-utils";

export type LiquidGlassLensProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Diameter of the circular lens in px. */
  size?: number;
  /** Frost (backdrop blur) in px. */
  blur?: number;
  /** Refraction displacement scale in px — how hard the lens bends light. */
  strength?: number;
  /** Chromatic aberration amount, `0`–`1`. Splits the R/G/B refraction. */
  dispersion?: number;
  /** Backdrop saturation multiplier. */
  saturation?: number;
  /** Glass tint color. Defaults to a subtle translucent white. */
  tint?: string;
  /** Specular highlight intensity, `0`–`1`. */
  sheen?: number;
};

/**
 * A circular glass lens that floats over its parent's content and follows the
 * cursor, refracting everything beneath it. The parent must be positioned
 * (`relative`); the lens is `pointer-events-none` so it never blocks clicks,
 * and it appears only while the pointer is over the parent.
 */
const LiquidGlassLens = React.forwardRef<HTMLDivElement, LiquidGlassLensProps>(
  (
    {
      children,
      className,
      style,
      size = 160,
      blur = 2,
      strength = 80,
      dispersion = 0.15,
      saturation = 1.6,
      tint,
      sheen = 0.5,
      ...props
    },
    ref,
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const filterId = `lgl-${React.useId().replace(/:/g, "")}`;
    const [hovering, setHovering] = React.useState(false);
    const refract = useRefractionSupport();

    React.useEffect(() => {
      const node = rootRef.current;
      const parent = node?.parentElement;
      if (!node || !parent) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const move = (e: PointerEvent) => {
        if (reduced.matches) return;
        const rect = parent.getBoundingClientRect();
        node.style.setProperty("--lg-px", `${e.clientX - rect.left}px`);
        node.style.setProperty("--lg-py", `${e.clientY - rect.top}px`);
      };
      const enter = () => setHovering(true);
      const leave = () => setHovering(false);

      parent.addEventListener("pointermove", move);
      parent.addEventListener("pointerenter", enter);
      parent.addEventListener("pointerleave", leave);
      return () => {
        parent.removeEventListener("pointermove", move);
        parent.removeEventListener("pointerenter", enter);
        parent.removeEventListener("pointerleave", leave);
      };
    }, []);

    const map = React.useMemo(
      () => buildDisplacementMap(size, size, 0),
      [size],
    );

    const backdrop = refract
      ? `blur(${blur}px) saturate(${saturation}) url(#${filterId})`
      : `blur(${blur}px) saturate(${saturation})`;

    return (
      <div
        ref={mergeRefs(rootRef, ref)}
        data-slot="liquid-glass-lens"
        className={`pointer-events-none absolute left-0 top-0 isolate z-popover flex items-center justify-center overflow-hidden rounded-full border border-white/30 text-center shadow-xl transition-opacity duration-200 [will-change:transform] motion-reduce:hidden ${className ?? ""}`}
        style={
          {
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: tint ?? "rgba(255,255,255,0.08)",
            opacity: hovering ? 1 : 0,
            transform:
              "translate(calc(var(--lg-px, 0px) - 50%), calc(var(--lg-py, 0px) - 50%))",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Refraction / frost layer — samples the live DOM beneath the lens. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backdropFilter: backdrop,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
          }}
        />

        {/* Fixed top-left sphere glint + inset depth. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backgroundImage: `radial-gradient(circle at 32% 28%, rgba(255,255,255,${0.7 * sheen}) 0%, rgba(255,255,255,0) 55%)`,
            boxShadow: `inset 0 2px 2px 0 rgba(255,255,255,${0.6 * sheen}), inset 0 -6px 12px 0 rgba(0,0,0,0.22)`,
          }}
        />

        {refract && (
          <svg aria-hidden="true" className="absolute size-0">
            <RefractionFilter
              id={filterId}
              map={map}
              strength={strength}
              dispersion={dispersion}
            />
          </svg>
        )}

        <div className="relative z-raised">{children}</div>
      </div>
    );
  },
);
LiquidGlassLens.displayName = "LiquidGlassLens";

export { LiquidGlassLens };
