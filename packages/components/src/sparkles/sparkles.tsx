"use client";

import { useReducedMotion } from "framer-motion";
import * as React from "react";

export type SparklesProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Particle color. Accepts any CSS color the canvas understands. */
  color?: string;
  /** Particles per 10,000 px² of canvas area. */
  density?: number;
  /** Minimum particle radius in pixels. */
  minSize?: number;
  /** Maximum particle radius in pixels. */
  maxSize?: number;
  /** Twinkle speed multiplier. */
  speed?: number;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  a: number;
  da: number;
};

const Sparkles = React.forwardRef<HTMLDivElement, SparklesProps>(
  (
    {
      color = "var(--primary)",
      density = 30,
      minSize = 0.6,
      maxSize = 1.6,
      speed = 1,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const wrapRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => wrapRef.current as HTMLDivElement,
    );
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const reduceMotion = useReducedMotion();

    React.useEffect(() => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Resolve the CSS color to a concrete value via a probe element.
      const probe = document.createElement("span");
      probe.style.color = color;
      wrap.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      wrap.removeChild(probe);

      let particles: Particle[] = [];
      let raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const seed = () => {
        const { width, height } = wrap.getBoundingClientRect();
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.round(((width * height) / 10000) * density);
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: minSize + Math.random() * (maxSize - minSize),
          a: Math.random(),
          da: (0.005 + Math.random() * 0.02) * speed,
        }));
      };

      const draw = () => {
        const { width, height } = wrap.getBoundingClientRect();
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          p.a += p.da;
          if (p.a > 1 || p.a < 0) {
            p.da = -p.da;
            p.a = Math.max(0, Math.min(1, p.a));
          }
          ctx.globalAlpha = p.a;
          ctx.fillStyle = resolved;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      };

      seed();
      if (reduceMotion) {
        draw();
        cancelAnimationFrame(raf);
      } else {
        draw();
      }

      const ro = new ResizeObserver(seed);
      ro.observe(wrap);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
      };
    }, [color, density, minSize, maxSize, speed, reduceMotion]);

    return (
      <div
        ref={wrapRef}
        data-slot="sparkles"
        className={`relative ${className ?? ""}`}
        {...props}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full"
        />
        <div className="relative z-raised">{children}</div>
      </div>
    );
  },
);
Sparkles.displayName = "Sparkles";

export { Sparkles };
