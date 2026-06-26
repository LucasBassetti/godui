"use client";

import * as React from "react";

export type WarpStarfieldProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Number of stars. Auto-scaled down on small surfaces. */
  starCount?: number;
  /** Forward speed multiplier. `1` is the calm default. */
  speed?: number;
  /** Field depth — larger means a deeper, slower-feeling field. */
  depth?: number;
  /**
   * Star color, any CSS color string. Defaults to the `--color-foreground`
   * token, re-resolved on theme change.
   */
  color?: string;
  /** Hyperspace mode: stars stretch into streaks. */
  warp?: boolean;
  /** Cursor parallax strength (px of center shift at the edges). */
  parallax?: number;
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

type Star = { x: number; y: number; z: number };

/**
 * A depth starfield you fly through — stars stream toward the viewer with cursor
 * parallax and an optional hyperspace warp. Drop it as the first child of a
 * `relative` container; your content sits above it.
 */
const WarpStarfield = React.forwardRef<HTMLDivElement, WarpStarfieldProps>(
  (
    {
      className,
      style,
      starCount = 400,
      speed = 1,
      depth = 1.5,
      color,
      warp = false,
      parallax = 30,
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
      const maxZ = depth;
      let w = 0;
      let h = 0;
      let focal = 0;
      let stars: Star[] = [];
      let rafId = 0;
      let visible = true;
      const pointer = { tx: 0, ty: 0, x: 0, y: 0 };

      const spawn = (z?: number): Star => ({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: z ?? Math.random() * maxZ,
      });

      const setup = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        focal = Math.max(w, h) * 0.6;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.max(
          80,
          Math.min(starCount, Math.round((w * h) / 2200)),
        );
        stars = Array.from({ length: count }, () => spawn());
      };

      const dz = 0.004 * speed * (warp ? 2 : 1);

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        // Eased cursor parallax.
        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;
        const cx = w / 2 + pointer.x * parallax;
        const cy = h / 2 + pointer.y * parallax;
        const rgb = colorRef.current;
        for (const s of stars) {
          const pz = s.z + dz;
          s.z -= dz;
          if (s.z <= 0.02) {
            Object.assign(s, spawn(maxZ));
            continue;
          }
          const k = focal / s.z;
          const sx = cx + s.x * k;
          const sy = cy + s.y * k;
          if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
          const t = 1 - s.z / maxZ;
          const size = Math.max(0.4, t * 2.2);
          const alpha = Math.min(1, t * 1.2);
          if (warp) {
            const k2 = focal / pz;
            const px = cx + s.x * k2;
            const py = cy + s.y * k2;
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          } else {
            ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };

      const tick = () => {
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

      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        pointer.tx = (e.clientX - rect.left) / rect.width - 0.5;
        pointer.ty = (e.clientY - rect.top) / rect.height - 0.5;
      };
      const onLeave = () => {
        pointer.tx = 0;
        pointer.ty = 0;
      };
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);

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
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", onReducedChange);
      };
    }, [starCount, speed, depth, warp, parallax]);

    return (
      <div
        ref={containerRef}
        data-slot="warp-starfield"
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
WarpStarfield.displayName = "WarpStarfield";

export { WarpStarfield };
