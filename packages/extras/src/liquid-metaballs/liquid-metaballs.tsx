"use client";

import * as React from "react";

export type LiquidMetaballsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of floating blobs. */
  blobCount?: number;
  /** Blob colors, any CSS color string. Cycled across the blobs. */
  colors?: string[];
  /** Drift speed multiplier. `1` is the calm default. */
  speed?: number;
  /** Goo strength (blur stdDeviation). Higher means blobs merge more. */
  gooeyness?: number;
  /**
   * When `true`, an extra blob follows the cursor and merges with the rest.
   * When `false` there is no pointer listener.
   */
  interactive?: boolean;
};

const DEFAULT_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4"];

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  el: SVGCircleElement | null;
};

/**
 * Gooey liquid metaballs — soft blobs that drift, collide, and merge under an
 * SVG goo filter, with an optional cursor blob. Drop it as the first child of a
 * `relative` container; your content sits above it.
 */
const LiquidMetaballs = React.forwardRef<HTMLDivElement, LiquidMetaballsProps>(
  (
    {
      className,
      style,
      blobCount = 7,
      colors = DEFAULT_COLORS,
      speed = 1,
      gooeyness = 16,
      interactive = true,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const svgRef = React.useRef<SVGSVGElement>(null);
    const cursorRef = React.useRef<SVGCircleElement>(null);
    const blobsRef = React.useRef<Blob[]>([]);
    const filterId = React.useId().replace(/:/g, "");

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    const colorList = colors.length ? colors : DEFAULT_COLORS;

    React.useEffect(() => {
      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;

      // Drop stale blob state if the count shrank (the ref array outlives the
      // circles); also re-inits positions whenever blobCount changes.
      blobsRef.current.length = Math.min(blobsRef.current.length, blobCount);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      let w = 0;
      let h = 0;
      let rafId = 0;
      let visible = true;
      const cursor = { x: -9999, y: -9999, active: false };

      const setup = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        const min = Math.min(w, h) || 1;
        for (const b of blobsRef.current) {
          if (b.r === 0) {
            b.x = Math.random() * w;
            b.y = Math.random() * h;
            b.r = min * (0.08 + Math.random() * 0.08);
            b.vx = (Math.random() - 0.5) * 0.6 * speed;
            b.vy = (Math.random() - 0.5) * 0.6 * speed;
          }
          b.el?.setAttribute("r", `${b.r}`);
        }
      };

      const paint = () => {
        for (const b of blobsRef.current) {
          b.el?.setAttribute("cx", `${b.x}`);
          b.el?.setAttribute("cy", `${b.y}`);
        }
      };

      const step = () => {
        for (const b of blobsRef.current) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < -b.r) b.x = w + b.r;
          if (b.x > w + b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = h + b.r;
          if (b.y > h + b.r) b.y = -b.r;
        }
        if (interactive && cursorRef.current) {
          if (cursor.active) {
            cursorRef.current.setAttribute("cx", `${cursor.x}`);
            cursorRef.current.setAttribute("cy", `${cursor.y}`);
            cursorRef.current.setAttribute("r", `${Math.min(w, h) * 0.1}`);
          } else {
            cursorRef.current.setAttribute("r", "0");
          }
        }
        paint();
        rafId = requestAnimationFrame(step);
      };

      const start = () => {
        if (rafId || reduced.matches) return;
        rafId = requestAnimationFrame(step);
      };
      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      setup();
      paint();
      if (!reduced.matches) start();

      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top;
        cursor.active = true;
      };
      const onLeave = () => {
        cursor.active = false;
      };
      if (interactive) {
        container.addEventListener("pointermove", onMove);
        container.addEventListener("pointerleave", onLeave);
      }

      const resizeObserver = new ResizeObserver(() => {
        setup();
        paint();
      });
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(container);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (visible) start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onReducedChange = () => {
        if (reduced.matches) stop();
        else if (visible) start();
      };
      reduced.addEventListener("change", onReducedChange);

      return () => {
        stop();
        if (interactive) {
          container.removeEventListener("pointermove", onMove);
          container.removeEventListener("pointerleave", onLeave);
        }
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", onReducedChange);
      };
    }, [blobCount, speed, interactive]);

    return (
      <div
        ref={containerRef}
        data-slot="liquid-metaballs"
        aria-hidden="true"
        className={`absolute inset-0 z-base size-full overflow-hidden ${className ?? ""}`}
        style={style}
        {...props}
      >
        <svg
          ref={svgRef}
          className="pointer-events-none size-full"
          preserveAspectRatio="xMidYMid slice"
          role="presentation"
        >
          <defs>
            <filter id={`goo-${filterId}`}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={gooeyness}
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
          <g filter={`url(#goo-${filterId})`}>
            {Array.from({ length: blobCount }).map((_, i) => (
              <circle
                // biome-ignore lint/suspicious/noArrayIndexKey: positional blobs
                key={i}
                r={0}
                fill={colorList[i % colorList.length]}
                ref={(el) => {
                  blobsRef.current[i] = blobsRef.current[i] ?? {
                    x: 0,
                    y: 0,
                    vx: 0,
                    vy: 0,
                    r: 0,
                    el: null,
                  };
                  blobsRef.current[i].el = el;
                }}
              />
            ))}
            {interactive && (
              <circle ref={cursorRef} r={0} fill={colorList[0]} />
            )}
          </g>
        </svg>
      </div>
    );
  },
);
LiquidMetaballs.displayName = "LiquidMetaballs";

export { LiquidMetaballs };
