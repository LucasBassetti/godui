"use client";

import * as React from "react";

export type TopographicDriftProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of contour levels drawn across the field. */
  lineCount?: number;
  /** Drift speed multiplier. `1` is the calm default. */
  speed?: number;
  /**
   * Contour color, any CSS color string. Defaults to the `--color-foreground`
   * token, re-resolved on theme change.
   */
  color?: string;
  /** Field scale — smaller means broader, gentler terrain. */
  noiseScale?: number;
  /** Contour line width in px. */
  weight?: number;
};

function toRGB(input: string): string {
  if (typeof document === "undefined") return "0, 0, 0";
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return "0, 0, 0";
    ctx.fillStyle = input;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `${r}, ${g}, ${b}`;
  } catch {
    return "0, 0, 0";
  }
}

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

/**
 * Slowly drifting topographic contour lines — a living elevation map drawn with
 * marching squares. Editorial and calm. Drop it as the first child of a
 * `relative` container; your content sits above it.
 */
const TopographicDrift = React.forwardRef<
  HTMLDivElement,
  TopographicDriftProps
>(
  (
    {
      className,
      style,
      lineCount = 9,
      speed = 1,
      color,
      noiseScale = 0.004,
      weight = 1,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const colorRef = React.useRef<string>("0, 0, 0");

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

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
      const cell = 18;
      let w = 0;
      let h = 0;
      let cols = 0;
      let rows = 0;
      let field = new Float32Array(0);
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
        cols = Math.ceil(w / cell);
        rows = Math.ceil(h / cell);
        field = new Float32Array((cols + 1) * (rows + 1));
      };

      const sampleField = () => {
        const stride = cols + 1;
        for (let j = 0; j <= rows; j++) {
          for (let i = 0; i <= cols; i++) {
            field[j * stride + i] = valueNoise(
              i * cell * noiseScale,
              j * cell * noiseScale + z,
            );
          }
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        sampleField();
        const stride = cols + 1;
        ctx.lineWidth = weight;
        for (let l = 1; l <= lineCount; l++) {
          const level = l / (lineCount + 1);
          ctx.strokeStyle = `rgba(${colorRef.current}, ${0.1 + 0.25 * (1 - Math.abs(0.5 - level) * 2)})`;
          ctx.beginPath();
          for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
              const x = i * cell;
              const y = j * cell;
              const tl = field[j * stride + i];
              const tr = field[j * stride + i + 1];
              const br = field[(j + 1) * stride + i + 1];
              const bl = field[(j + 1) * stride + i];
              let id = 0;
              if (tl > level) id |= 8;
              if (tr > level) id |= 4;
              if (br > level) id |= 2;
              if (bl > level) id |= 1;
              if (id === 0 || id === 15) continue;
              // Edge crossing points (linear interpolation).
              const top = x + cell * ((level - tl) / (tr - tl || 1e-6));
              const right = y + cell * ((level - tr) / (br - tr || 1e-6));
              const bottom = x + cell * ((level - bl) / (br - bl || 1e-6));
              const left = y + cell * ((level - tl) / (bl - tl || 1e-6));
              const seg = (x1: number, y1: number, x2: number, y2: number) => {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
              };
              switch (id) {
                case 1:
                case 14:
                  seg(x, left, bottom, y + cell);
                  break;
                case 2:
                case 13:
                  seg(bottom, y + cell, x + cell, right);
                  break;
                case 3:
                case 12:
                  seg(x, left, x + cell, right);
                  break;
                case 4:
                case 11:
                  seg(top, y, x + cell, right);
                  break;
                case 5:
                  seg(x, left, top, y);
                  seg(bottom, y + cell, x + cell, right);
                  break;
                case 6:
                case 9:
                  seg(top, y, bottom, y + cell);
                  break;
                case 7:
                case 8:
                  seg(x, left, top, y);
                  break;
                case 10:
                  seg(top, y, x + cell, right);
                  seg(x, left, bottom, y + cell);
                  break;
              }
            }
          }
          ctx.stroke();
        }
      };

      const tick = () => {
        z += 0.0015 * speed;
        draw();
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
      draw();
      if (!reduced.matches) start();

      const resizeObserver = new ResizeObserver(() => {
        setup();
        draw();
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
          draw();
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
    }, [lineCount, speed, noiseScale, weight]);

    return (
      <div
        ref={containerRef}
        data-slot="topographic-drift"
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
TopographicDrift.displayName = "TopographicDrift";

export { TopographicDrift };
