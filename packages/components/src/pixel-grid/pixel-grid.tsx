"use client";

import * as React from "react";

export type PixelGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Side length of each square in px. */
  squareSize?: number;
  /** Gap between squares in px. */
  gridGap?: number;
  /** Per-second probability that a square re-rolls its opacity. */
  flickerChance?: number;
  /**
   * Square color, any CSS color string (`#fff`, `rgb(...)`, `oklch(...)`).
   * Defaults to the `--color-foreground` theme token, re-resolved on theme
   * change so it tracks light/dark automatically.
   */
  color?: string;
  /** Upper bound on square opacity, `0`–`1`. */
  maxOpacity?: number;
  /**
   * Cursor mode. When `true`, only squares within `interactionRadius` of the
   * cursor animate; the rest are governed by `cursorReveal`. When `false`, the
   * whole field flickers on its own — an automatic animated background.
   */
  interactive?: boolean;
  /** Radius of the cursor reveal in px. */
  interactionRadius?: number;
  /** How strongly the cursor reveals squares within the radius, `0`–`1`. */
  interactionStrength?: number;
  /**
   * How squares outside the cursor radius render in `interactive` mode.
   * `"hidden"` keeps them invisible (a spotlight that follows the cursor);
   * `"dim"` keeps them visible at a static low opacity, frozen.
   */
  cursorReveal?: "hidden" | "dim";
  /** Fixed width in px. Defaults to filling the parent. */
  width?: number;
  /** Fixed height in px. Defaults to filling the parent. */
  height?: number;
};

type Pointer = { x: number; y: number; intensity: number; target: number };

/** Normalize any CSS color string to an `"r, g, b"` triple via a 1×1 canvas. */
function toRGB(input: string): string {
  if (typeof document === "undefined") return "0, 0, 0";
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "0, 0, 0";
    ctx.fillStyle = input;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `${r}, ${g}, ${b}`;
  } catch {
    return "0, 0, 0";
  }
}

/**
 * A grid of squares that flicker their opacity, with an optional cursor
 * spotlight that eases nearby squares toward full brightness. Drop it as the
 * first child of a `relative` container; your content sits above it.
 */
const PixelGrid = React.forwardRef<HTMLDivElement, PixelGridProps>(
  (
    {
      className,
      style,
      squareSize = 4,
      gridGap = 6,
      flickerChance = 0.3,
      color,
      maxOpacity = 0.3,
      interactive = true,
      interactionRadius = 120,
      interactionStrength = 1,
      cursorReveal = "hidden",
      width,
      height,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const colorRef = React.useRef<string>("0, 0, 0");
    const pointerRef = React.useRef<Pointer>({
      x: 0,
      y: 0,
      intensity: 0,
      target: 0,
    });

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    // Resolve the square color. An explicit `color` wins; otherwise probe the
    // `--color-foreground` token and re-resolve whenever the theme class flips.
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const resolve = () => {
        if (color) {
          colorRef.current = toRGB(color);
          return;
        }
        const probe = document.createElement("span");
        probe.className = "text-foreground";
        probe.style.cssText = "position:absolute;width:0;height:0;opacity:0";
        container.appendChild(probe);
        colorRef.current = toRGB(getComputedStyle(probe).color);
        probe.remove();
      };

      resolve();
      if (color) return;

      const observer = new MutationObserver(resolve);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      });
      return () => observer.disconnect();
    }, [color]);

    React.useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const ctx = (() => {
        try {
          return canvas.getContext("2d");
        } catch {
          return null;
        }
      })();
      if (!ctx) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const step = squareSize + gridGap;

      let cols = 0;
      let rows = 0;
      let squares = new Float32Array(0);
      let dpr = 1;
      let rafId = 0;
      let lastTime = performance.now();
      let visible = true;

      const setup = () => {
        const w = width ?? container.clientWidth;
        const h = height ?? container.clientHeight;
        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        cols = Math.max(0, Math.floor(w / step));
        rows = Math.max(0, Math.floor(h / step));
        squares = new Float32Array(cols * rows);
        for (let i = 0; i < squares.length; i++) {
          squares[i] = Math.random() * maxOpacity;
        }
      };

      // Resting opacity for squares outside the cursor radius (interactive mode).
      const baseline = cursorReveal === "dim" ? maxOpacity * 0.18 : 0;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pointer = pointerRef.current;
        const cursorActive = interactive && pointer.intensity > 0.001;
        const sizePx = squareSize * dpr;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const base = squares[i * rows + j];
            let opacity: number;
            if (!interactive) {
              // Automatic mode: the whole field flickers.
              opacity = base;
            } else if (cursorActive) {
              const cx = i * step + squareSize / 2;
              const cy = j * step + squareSize / 2;
              const dist = Math.hypot(cx - pointer.x, cy - pointer.y);
              const t = Math.max(0, 1 - dist / interactionRadius);
              // smoothstep falloff, scaled by strength and the lerped intensity.
              const reveal = Math.min(
                1,
                t * t * (3 - 2 * t) * interactionStrength * pointer.intensity,
              );
              // Only squares inside the radius animate; the rest rest at the
              // baseline (hidden or static dim).
              opacity = baseline + (base - baseline) * reveal;
            } else {
              // Interactive, cursor absent: field rests at the baseline.
              opacity = baseline;
            }
            if (opacity <= 0.001) continue;
            ctx.fillStyle = `rgba(${colorRef.current}, ${opacity})`;
            ctx.fillRect(i * step * dpr, j * step * dpr, sizePx, sizePx);
          }
        }
      };

      const animate = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < flickerChance * dt) {
            squares[i] = Math.random() * maxOpacity;
          }
        }
        const pointer = pointerRef.current;
        pointer.intensity +=
          (pointer.target - pointer.intensity) * Math.min(dt * 8, 1);
        draw();
        rafId = requestAnimationFrame(animate);
      };

      const start = () => {
        if (rafId || reduced.matches) return;
        lastTime = performance.now();
        rafId = requestAnimationFrame(animate);
      };
      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      setup();
      if (reduced.matches) {
        draw();
      } else {
        start();
      }

      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const pointer = pointerRef.current;
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.target = 1;
      };
      const onLeave = () => {
        pointerRef.current.target = 0;
      };
      if (interactive) {
        container.addEventListener("pointermove", onMove);
        container.addEventListener("pointerleave", onLeave);
      }

      const resizeObserver = new ResizeObserver(() => {
        setup();
        if (reduced.matches) draw();
      });
      if (width == null || height == null) resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0 },
      );
      intersectionObserver.observe(container);

      const onReducedChange = () => {
        if (reduced.matches) {
          stop();
          draw();
        } else if (visible) {
          start();
        }
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
        reduced.removeEventListener("change", onReducedChange);
      };
    }, [
      squareSize,
      gridGap,
      flickerChance,
      maxOpacity,
      interactive,
      interactionRadius,
      interactionStrength,
      cursorReveal,
      width,
      height,
    ]);

    return (
      <div
        ref={containerRef}
        data-slot="pixel-grid"
        aria-hidden="true"
        className={`absolute inset-0 z-base size-full overflow-hidden ${className ?? ""}`}
        style={style}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none size-full"
          style={
            width != null && height != null ? { width, height } : undefined
          }
        />
      </div>
    );
  },
);
PixelGrid.displayName = "PixelGrid";

export { PixelGrid };
