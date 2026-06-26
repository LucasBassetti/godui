"use client";

import * as React from "react";

export type FlowFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of particles tracing the field. */
  particleCount?: number;
  /** Field scale — smaller means broader, smoother currents. */
  noiseScale?: number;
  /** Flow speed multiplier. `1` is the calm default. */
  speed?: number;
  /**
   * Trail color, any CSS color string. Defaults to the `--color-primary`
   * token, re-resolved on theme change.
   */
  color?: string;
  /**
   * Trail fade per frame, `0`–`1`. Lower leaves longer, silkier trails;
   * higher keeps the field crisp.
   */
  fade?: number;
};

function rgbTriple(input: string): [number, number, number] {
  if (typeof document === "undefined") return [0, 0, 0];
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [0, 0, 0];
    ctx.fillStyle = input;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  } catch {
    return [0, 0, 0];
  }
}

// Compact 2D value noise (hash + smooth interpolation) for the flow angles.
function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

type Particle = { x: number; y: number };

/**
 * A field of particles streaming along an evolving noise vector field, leaving
 * silky fading trails. Paints its own themed background. Drop it as the first
 * child of a `relative` container; your content sits above it.
 */
const FlowField = React.forwardRef<HTMLDivElement, FlowFieldProps>(
  (
    {
      className,
      style,
      particleCount = 900,
      noiseScale = 0.0016,
      speed = 1,
      color,
      fade = 0.06,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const fgRef = React.useRef<[number, number, number]>([0, 0, 0]);
    const bgRef = React.useRef<[number, number, number]>([255, 255, 255]);

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const resolve = () => {
        fgRef.current = color
          ? rgbTriple(color)
          : (() => {
              const p = document.createElement("span");
              p.style.cssText =
                "position:absolute;width:0;height:0;opacity:0;color:var(--primary)";
              container.appendChild(p);
              const t = rgbTriple(getComputedStyle(p).color);
              p.remove();
              return t;
            })();
        const pb = document.createElement("span");
        pb.style.cssText =
          "position:absolute;width:0;height:0;opacity:0;background:var(--background)";
        container.appendChild(pb);
        bgRef.current = rgbTriple(getComputedStyle(pb).backgroundColor);
        pb.remove();
      };
      resolve();
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
      let w = 0;
      let h = 0;
      let particles: Particle[] = [];
      let rafId = 0;
      let visible = true;
      let z = 0;

      const setup = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(
          120,
          Math.min(particleCount, Math.round((w * h) / 1400)),
        );
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
        }));
        // Paint the base once.
        const [br, bg, bb] = bgRef.current;
        ctx.fillStyle = `rgb(${br}, ${bg}, ${bb})`;
        ctx.fillRect(0, 0, w, h);
      };

      const step = () => {
        const [br, bg, bb] = bgRef.current;
        ctx.fillStyle = `rgba(${br}, ${bg}, ${bb}, ${fade})`;
        ctx.fillRect(0, 0, w, h);
        const [fr, fg, fb] = fgRef.current;
        ctx.strokeStyle = `rgba(${fr}, ${fg}, ${fb}, 0.5)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const p of particles) {
          const angle =
            valueNoise(p.x * noiseScale, p.y * noiseScale + z) * Math.PI * 4;
          const nx = p.x + Math.cos(angle) * 1.6 * speed;
          const ny = p.y + Math.sin(angle) * 1.6 * speed;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx, ny);
          p.x = nx;
          p.y = ny;
          if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
          }
        }
        ctx.stroke();
        z += 0.0008 * speed;
      };

      const tick = () => {
        step();
        rafId = requestAnimationFrame(tick);
      };
      const start = () => {
        if (rafId || reduced.matches) return;
        rafId = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      setup();
      if (reduced.matches) {
        // Render a frozen still by priming a few hundred steps.
        for (let i = 0; i < 240; i++) step();
      } else {
        start();
      }

      const resizeObserver = new ResizeObserver(() => {
        setup();
        if (reduced.matches) for (let i = 0; i < 240; i++) step();
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
        if (reduced.matches) {
          stop();
          setup();
          for (let i = 0; i < 240; i++) step();
        } else if (visible) start();
      };
      reduced.addEventListener("change", onReducedChange);

      return () => {
        stop();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", onReducedChange);
      };
    }, [particleCount, noiseScale, speed, fade]);

    return (
      <div
        ref={containerRef}
        data-slot="flow-field"
        aria-hidden="true"
        className={`absolute inset-0 z-base size-full overflow-hidden ${className ?? ""}`}
        style={style}
        {...props}
      >
        <canvas ref={canvasRef} className="pointer-events-none size-full" />
      </div>
    );
  },
);
FlowField.displayName = "FlowField";

export { FlowField };
