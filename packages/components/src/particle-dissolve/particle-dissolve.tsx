"use client";

import { useReducedMotion } from "framer-motion";
import * as React from "react";

export type ParticleDissolveProps = Omit<
  React.HTMLAttributes<HTMLCanvasElement>,
  "children"
> & {
  /** Text to render as particles. Ignored when `src` is set. */
  text?: string;
  /** Image URL to sample into particles. */
  src?: string;
  /** Canvas width in CSS px. */
  width?: number;
  /** Canvas height in CSS px. */
  height?: number;
  /** Resting behaviour once triggered. */
  mode?: "assemble" | "disperse" | "loop";
  /** When the animation starts. */
  trigger?: "mount" | "in-view" | "hover";
  /** Pixel sampling step — smaller is denser (and heavier). */
  density?: number;
  /** Particle dot size in px. */
  particleSize?: number;
  /** Fill color for text particles (any CSS color). Defaults to the text color. */
  color?: string;
  /** Font for text particles. */
  font?: string;
};

type Particle = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  delay: number;
  jitter: number;
  color: string;
};

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

const ParticleDissolve = React.forwardRef<
  HTMLCanvasElement,
  ParticleDissolveProps
>(
  (
    {
      text,
      src,
      width = 640,
      height = 240,
      mode = "assemble",
      trigger = "in-view",
      density = 4,
      particleSize = 2,
      color,
      font = "bold 140px ui-sans-serif, system-ui, sans-serif",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => canvasRef.current as HTMLCanvasElement,
    );
    const reduce = useReducedMotion();

    const particles = React.useRef<Particle[]>([]);
    const p = React.useRef(mode === "disperse" ? 1 : 0); // 0 = scattered, 1 = formed
    const goal = React.useRef(mode === "disperse" ? 1 : 0); // hold until triggered
    const raf = React.useRef<number | null>(null);
    const phaseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Build particle targets by rendering the source offscreen and sampling it.
    const build = React.useCallback(
      (resolvedColor: string) => {
        const off = document.createElement("canvas");
        off.width = width;
        off.height = height;
        const octx = off.getContext("2d", { willReadFrequently: true });
        if (!octx) return Promise.resolve();

        const sample = () => {
          const data = octx.getImageData(0, 0, width, height).data;
          const next: Particle[] = [];
          for (let y = 0; y < height; y += density) {
            for (let x = 0; x < width; x += density) {
              const i = (y * width + x) * 4;
              if ((data[i + 3] as number) > 128) {
                const r = data[i] as number;
                const g = data[i + 1] as number;
                const b = data[i + 2] as number;
                next.push({
                  tx: x,
                  ty: y,
                  sx: Math.random() * width,
                  sy: Math.random() * height,
                  delay: Math.random() * 0.4,
                  jitter: Math.random() * Math.PI * 2,
                  color: src ? `rgb(${r},${g},${b})` : resolvedColor,
                });
              }
            }
          }
          particles.current = next;
        };

        if (src) {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              // Contain the image within the canvas.
              const scale = Math.min(width / img.width, height / img.height);
              const w = img.width * scale;
              const h = img.height * scale;
              octx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
              try {
                sample();
              } catch {
                // Cross-origin image without CORS — leave particles empty.
              }
              resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
          });
        }

        octx.fillStyle = "#fff";
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.font = font;
        octx.fillText(text ?? "", width / 2, height / 2);
        sample();
        return Promise.resolve();
      },
      [width, height, density, src, text, font],
    );

    const draw = React.useCallback(
      (ctx: CanvasRenderingContext2D, time: number) => {
        ctx.clearRect(0, 0, width, height);
        const prog = p.current;
        for (const pt of particles.current) {
          const eff =
            prog <= 0
              ? 0
              : easeInOut(
                  Math.max(0, Math.min(1, (prog - pt.delay) / (1 - pt.delay))),
                );
          // Idle shimmer once formed so the shape stays alive.
          const breathe = eff > 0.98 ? Math.sin(time / 600 + pt.jitter) : 0;
          const x = pt.sx + (pt.tx - pt.sx) * eff + breathe;
          const y = pt.sy + (pt.ty - pt.sy) * eff + breathe;
          ctx.globalAlpha = Math.max(0.1, eff);
          ctx.fillStyle = pt.color;
          ctx.fillRect(x, y, particleSize, particleSize);
        }
        ctx.globalAlpha = 1;
      },
      [width, height, particleSize],
    );

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const resolved = color || getComputedStyle(canvas).color || "rgb(0,0,0)";

      let cancelled = false;
      build(resolved).then(() => {
        if (cancelled) return;

        // Reduced motion: render the formed shape once, no animation.
        if (reduce) {
          p.current = 1;
          draw(ctx, 0);
          return;
        }

        const loop = (time: number) => {
          p.current += (goal.current - p.current) * 0.06;
          draw(ctx, time);
          raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);

        const runLoopMode = () => {
          const cycle = () => {
            goal.current = goal.current > 0.5 ? 0 : 1;
            phaseTimer.current = setTimeout(cycle, 2600);
          };
          cycle();
        };

        const start = () => {
          if (mode === "loop") runLoopMode();
          else goal.current = mode === "disperse" ? 0 : 1;
        };

        if (trigger === "mount") {
          start();
        } else if (trigger === "in-view") {
          const io = new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                start();
                io.disconnect();
              }
            },
            { threshold: 0.3 },
          );
          io.observe(canvas);
        }
        // `hover` is handled by the pointer handlers below.
      });

      return () => {
        cancelled = true;
        if (raf.current != null) cancelAnimationFrame(raf.current);
        if (phaseTimer.current != null) clearTimeout(phaseTimer.current);
      };
    }, [build, draw, reduce, mode, trigger, width, height, color]);

    const hoverProps =
      trigger === "hover" && !reduce
        ? {
            onPointerEnter: () => {
              goal.current = mode === "disperse" ? 0 : 1;
            },
            onPointerLeave: () => {
              goal.current = mode === "disperse" ? 1 : 0;
            },
          }
        : {};

    return (
      <canvas
        ref={canvasRef}
        data-slot="particle-dissolve"
        role="img"
        aria-label={text ? text : "Particle image"}
        className={className}
        style={{ width, height, maxWidth: "100%" }}
        {...hoverProps}
        {...props}
      />
    );
  },
);
ParticleDissolve.displayName = "ParticleDissolve";

export { ParticleDissolve };
