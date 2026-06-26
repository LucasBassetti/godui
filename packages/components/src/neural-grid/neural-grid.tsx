"use client";

import * as React from "react";

export type NeuralGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Approximate number of nodes. The lattice is sized to roughly match. */
  nodeCount?: number;
  /** How fast signal pulses travel an edge. `1` is the calm default. */
  pulseSpeed?: number;
  /**
   * Node / edge / pulse color, any CSS color string. Defaults to the
   * `--color-primary` token, re-resolved on theme change.
   */
  color?: string;
  /** Pulse frequency, `0`–`1`. Higher fires more signals at once. */
  density?: number;
  /** Node radius in px. */
  nodeSize?: number;
};

type Node = { x: number; y: number };
type Edge = { a: number; b: number };
type Pulse = { edge: number; t: number; speed: number };

/** Normalize any CSS color string to an `"r, g, b"` triple via a 1×1 canvas. */
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

/**
 * A neural lattice — nodes wired into a grid with signal pulses traveling the
 * edges. The AI-product hero. Drop it as the first child of a `relative`
 * container; your content sits above it.
 */
const NeuralGrid = React.forwardRef<HTMLDivElement, NeuralGridProps>(
  (
    {
      className,
      style,
      nodeCount = 48,
      pulseSpeed = 1,
      color,
      density = 0.5,
      nodeSize = 2,
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
        probe.style.cssText =
          "position:absolute;width:0;height:0;opacity:0;color:var(--primary)";
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
      let w = 0;
      let h = 0;
      let nodes: Node[] = [];
      let edges: Edge[] = [];
      let pulses: Pulse[] = [];
      let rafId = 0;
      let visible = true;
      let lastTime = performance.now();

      const setup = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Build a jittered lattice sized to roughly match nodeCount.
        const aspect = w / Math.max(h, 1);
        const cols = Math.max(2, Math.round(Math.sqrt(nodeCount * aspect)));
        const rows = Math.max(2, Math.round(nodeCount / cols));
        const cw = w / cols;
        const ch = h / rows;
        nodes = [];
        for (let j = 0; j <= rows; j++) {
          for (let i = 0; i <= cols; i++) {
            nodes.push({
              x: i * cw + (Math.random() - 0.5) * cw * 0.5,
              y: j * ch + (Math.random() - 0.5) * ch * 0.5,
            });
          }
        }
        const stride = cols + 1;
        edges = [];
        for (let j = 0; j <= rows; j++) {
          for (let i = 0; i <= cols; i++) {
            const idx = j * stride + i;
            if (i < cols) edges.push({ a: idx, b: idx + 1 });
            if (j < rows) edges.push({ a: idx, b: idx + stride });
          }
        }
        pulses = [];
      };

      const spawn = () => {
        if (edges.length === 0) return;
        pulses.push({
          edge: Math.floor(Math.random() * edges.length),
          t: 0,
          speed: (0.4 + Math.random() * 0.6) * pulseSpeed,
        });
      };

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const rgb = colorRef.current;
        // Edges.
        ctx.strokeStyle = `rgba(${rgb}, 0.12)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const e of edges) {
          const a = nodes[e.a];
          const b = nodes[e.b];
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
        // Nodes.
        ctx.fillStyle = `rgba(${rgb}, 0.55)`;
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, nodeSize, 0, Math.PI * 2);
          ctx.fill();
        }
        // Pulses.
        for (const p of pulses) {
          const e = edges[p.edge];
          const a = nodes[e.a];
          const b = nodes[e.b];
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 6);
          glow.addColorStop(0, `rgba(${rgb}, 0.9)`);
          glow.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const tick = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        // Spawn rate scales with density and edge count.
        if (Math.random() < density * dt * 6) spawn();
        for (const p of pulses) p.t += p.speed * dt;
        pulses = pulses.filter((p) => p.t <= 1);
        draw();
        rafId = requestAnimationFrame(tick);
      };

      const start = () => {
        if (rafId || reduced.matches) return;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      setup();
      if (reduced.matches) draw();
      else start();

      const resizeObserver = new ResizeObserver(() => {
        setup();
        if (reduced.matches) draw();
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
    }, [nodeCount, pulseSpeed, density, nodeSize]);

    return (
      <div
        ref={containerRef}
        data-slot="neural-grid"
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
NeuralGrid.displayName = "NeuralGrid";

export { NeuralGrid };
