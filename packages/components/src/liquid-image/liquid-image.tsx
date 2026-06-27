"use client";

import { useReducedMotion } from "framer-motion";
import * as React from "react";

export type LiquidImageProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Image source. */
  src: string;
  /** Accessible description of the image. */
  alt: string;
  /** Peak ripple displacement on interaction, in px. */
  strength?: number;
  /** Turbulence frequency — smaller values give larger, smoother ripples. */
  frequency?: number;
  /** When the ripple is active. */
  trigger?: "hover" | "always";
  /** Classes for the inner `<img>` (sizing, aspect, object-fit). */
  imgClassName?: string;
};

function useFilterSupport(): boolean {
  const [ok, setOk] = React.useState(true);
  React.useEffect(() => {
    setOk(
      typeof CSS !== "undefined" &&
        typeof CSS.supports === "function" &&
        CSS.supports("filter", "url(#a)"),
    );
  }, []);
  return ok;
}

const LiquidImage = React.forwardRef<HTMLDivElement, LiquidImageProps>(
  (
    {
      src,
      alt,
      strength = 28,
      frequency = 0.012,
      trigger = "hover",
      className,
      imgClassName,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduce = useReducedMotion();
    const supported = useFilterSupport();
    const id = `liquid-${React.useId().replace(/:/g, "")}`;

    const dispRef = React.useRef<SVGFEDisplacementMapElement>(null);
    const current = React.useRef(0);
    const target = React.useRef(trigger === "always" ? strength * 0.45 : 0);
    const raf = React.useRef<number | null>(null);
    const lastMove = React.useRef<{ x: number; y: number; t: number } | null>(
      null,
    );

    const active = supported && !reduce;

    // Single rAF loop eases the live displacement toward its target and writes
    // it straight to the SVG filter — the image never re-renders.
    const tick = React.useCallback(() => {
      const el = dispRef.current;
      const next = current.current + (target.current - current.current) * 0.12;
      current.current = next;
      if (el) el.setAttribute("scale", next.toFixed(2));
      // Keep running while there's motion to settle, or while always-on.
      if (target.current > 0.01 || next > 0.05) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
      }
    }, []);

    const ensureLoop = React.useCallback(() => {
      if (raf.current == null) raf.current = requestAnimationFrame(tick);
    }, [tick]);

    React.useEffect(() => {
      if (active && trigger === "always") {
        target.current = strength * 0.45;
        ensureLoop();
      }
      return () => {
        if (raf.current != null) cancelAnimationFrame(raf.current);
        raf.current = null;
      };
    }, [active, trigger, strength, ensureLoop]);

    const handleEnter = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(e);
      if (!active || trigger !== "hover") return;
      target.current = strength * 0.5;
      ensureLoop();
    };

    const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e);
      lastMove.current = null;
      if (!active || trigger !== "hover") return;
      target.current = 0;
    };

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (!active) return;
      const now = performance.now();
      const prev = lastMove.current;
      if (prev) {
        const dt = Math.max(16, now - prev.t);
        const speed = Math.hypot(e.clientX - prev.x, e.clientY - prev.y) / dt;
        // Faster cursor intensifies the ripple, capped at `strength`.
        const boost = Math.min(strength, strength * 0.5 + speed * 60);
        if (trigger === "hover" || boost > target.current) {
          target.current = boost;
          ensureLoop();
        }
      }
      lastMove.current = { x: e.clientX, y: e.clientY, t: now };
    };

    return (
      <div
        ref={ref}
        data-slot="liquid-image"
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onPointerMove={handleMove}
        className={`group relative overflow-hidden rounded-xl ${className ?? ""}`}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`block h-full w-full select-none object-cover ${
            active
              ? ""
              : "[transition:transform_500ms_ease,filter_500ms_ease] group-hover:scale-[1.04] group-hover:brightness-105 motion-reduce:transform-none motion-reduce:transition-none"
          } ${imgClassName ?? ""}`}
          style={active ? { filter: `url(#${id})` } : undefined}
        />

        {active ? (
          <svg
            aria-hidden
            className="absolute size-0"
            width="0"
            height="0"
            role="presentation"
          >
            <title>liquid displacement filter</title>
            <filter
              id={id}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={frequency}
                numOctaves={2}
                seed={2}
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="16s"
                  values={`${frequency};${frequency * 1.7};${frequency}`}
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                ref={dispRef}
                in="SourceGraphic"
                in2="noise"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>
        ) : null}
      </div>
    );
  },
);
LiquidImage.displayName = "LiquidImage";

export { LiquidImage };
