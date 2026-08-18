"use client";

import * as React from "react";

export type AsciiDitherVariant = "ascii" | "dither";
export type AsciiDitherColor = "theme" | "source" | (string & {});

export type AsciiDitherProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Image or video URL to render. */
  src: string;
  /** Accessible label — the component is exposed as `role="img"`. */
  alt?: string;
  /** Source kind. `"auto"` infers video from the file extension. */
  type?: "auto" | "image" | "video";
  /** `"ascii"` draws luminance-mapped characters; `"dither"` draws halftone dots. */
  variant?: AsciiDitherVariant;
  /** Size of one cell in CSS px — smaller is finer (and heavier). */
  cellSize?: number;
  /** ASCII ramp from brightest to darkest. */
  charset?: string;
  /** Font family for the ASCII glyphs. */
  fontFamily?: string;
  /** Dither algorithm. */
  ditherType?: "bayer" | "floyd-steinberg";
  /** Quantization levels for dithering — `2` is 1-bit. */
  levels?: number;
  /** Dot shape for the dither variant. */
  dotShape?: "square" | "circle";
  /**
   * `"theme"` inks with the `--foreground` token, `"source"` tints each cell with
   * the underlying pixel, or pass any CSS color string.
   */
  color?: AsciiDitherColor;
  /** Canvas background. Defaults to transparent. */
  background?: string;
  /** Invert the luminance mapping. */
  invert?: boolean;
  /** Contrast multiplier around mid-gray — `>1` sharpens features, `1` is linear. */
  contrast?: number;
  /** Stagger the cells in from the center on first view. */
  reveal?: boolean;
  /** Pointer acts as a focus lens — cells outside the radius fade back. */
  interactive?: boolean;
  /** Ambient retro flicker — occasional row offsets and glyph scramble. */
  glitch?: boolean;
  /** Focus-lens radius in CSS px (with `interactive`). */
  lensRadius?: number;
  /** Autoplay a video source. */
  autoPlay?: boolean;
  /** Loop a video source. */
  loop?: boolean;
  /** Mute a video source (required for most browsers to autoplay). */
  muted?: boolean;
  /** Frame cap for video / glitch animation. */
  fps?: number;
};

// 4x4 Bayer matrix, normalized to (0,1) thresholds.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

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
    return [r as number, g as number, b as number];
  } catch {
    return [0, 0, 0];
  }
}

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function isVideoSrc(src: string, type: AsciiDitherProps["type"]) {
  if (type === "video") return true;
  if (type === "image") return false;
  return /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i.test(src);
}

/**
 * Renders an image or video as a live field of ASCII characters or halftone
 * dither dots on a canvas. Ink follows the theme, the source colors, or any CSS
 * color; cells can stagger in on view, follow a pointer focus-lens, and flicker
 * with a retro glitch. View-only — drop it in any sized container.
 */
const AsciiDither = React.forwardRef<HTMLDivElement, AsciiDitherProps>(
  (
    {
      src,
      alt = "",
      type = "auto",
      variant = "ascii",
      cellSize = 8,
      charset = " .:-=+*#%@",
      fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace",
      ditherType = "bayer",
      levels = 2,
      dotShape = "square",
      color = "theme",
      background = "transparent",
      invert = false,
      contrast = 1,
      reveal = true,
      interactive = false,
      glitch = false,
      lensRadius = 120,
      autoPlay = true,
      loop = true,
      muted = true,
      fps = 30,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const fgRef = React.useRef<[number, number, number]>([0, 0, 0]);
    const pointerRef = React.useRef<{ x: number; y: number; active: boolean }>({
      x: 0,
      y: 0,
      active: false,
    });

    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );

    const isVideo = isVideoSrc(src, type);
    const usesTheme = color === "theme";

    // Resolve the theme ink color and keep it in sync with theme switches.
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || !usesTheme) return;
      const resolve = () => {
        const span = document.createElement("span");
        span.style.cssText =
          "position:absolute;width:0;height:0;opacity:0;color:var(--foreground)";
        container.appendChild(span);
        fgRef.current = rgbTriple(getComputedStyle(span).color);
        span.remove();
      };
      resolve();
      const observer = new MutationObserver(resolve);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      });
      return () => observer.disconnect();
    }, [usesTheme]);

    React.useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const off = document.createElement("canvas");
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      let w = 0;
      let h = 0;
      let cols = 0;
      let rows = 0;
      let cellW = cellSize;
      let cellH = cellSize;
      let pixels: Uint8ClampedArray | null = null;
      let source: HTMLImageElement | HTMLVideoElement | null = null;
      let ready = false;
      let cancelled = false;

      let rafId = 0;
      let visible = true;
      let last = 0;
      let revealStart = 0;
      let scramble = 0; // glitch phase counter

      const frameGap = () => 1000 / Math.max(1, fps);
      const needsLoop = () =>
        !reduced.matches &&
        (isVideo || glitch || (interactive && pointerRef.current.active));

      const measure = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        cols = Math.max(1, Math.floor(w / cellSize));
        rows = Math.max(1, Math.floor(h / cellSize));
        cellW = w / cols;
        cellH = h / rows;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        off.width = cols;
        off.height = rows;
      };

      // Draw the source "contain" into the low-res offscreen and read it back.
      const sample = () => {
        if (!source) return;
        const sw =
          source instanceof HTMLVideoElement
            ? source.videoWidth
            : source.naturalWidth;
        const sh =
          source instanceof HTMLVideoElement
            ? source.videoHeight
            : source.naturalHeight;
        if (!sw || !sh) return;
        const scale = Math.min(cols / sw, rows / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        octx.clearRect(0, 0, cols, rows);
        octx.drawImage(source, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
        try {
          pixels = octx.getImageData(0, 0, cols, rows).data;
        } catch {
          pixels = null; // cross-origin without CORS
        }
      };

      // Per-cell ink coverage 0..1 (1 = full ink). Honors invert.
      const inkAt = (i: number) => {
        if (!pixels) return 0;
        const r = pixels[i] as number;
        const g = pixels[i + 1] as number;
        const b = pixels[i + 2] as number;
        const a = (pixels[i + 3] as number) / 255;
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        let ink = invert ? luma : 1 - luma;
        // Stretch around mid-gray so faces/features separate instead of muddying.
        if (contrast !== 1) ink = clamp01((ink - 0.5) * contrast + 0.5);
        return ink * a;
      };

      const inkStyle = (i: number) => {
        if (color === "source" && pixels) {
          return `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`;
        }
        if (usesTheme) {
          const [r, g, b] = fgRef.current;
          return `rgb(${r},${g},${b})`;
        }
        return color as string;
      };

      // Floyd–Steinberg error diffusion → quantized level grid (0..1).
      const diffuse = () => {
        const buf = new Float32Array(cols * rows);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            buf[y * cols + x] = inkAt((y * cols + x) * 4);
          }
        }
        const step = 1 / (levels - 1);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = y * cols + x;
            const oldV = buf[idx] as number;
            const q = Math.round(oldV / step) * step;
            buf[idx] = q;
            const err = oldV - q;
            if (x + 1 < cols) buf[idx + 1] += (err * 7) / 16;
            if (y + 1 < rows) {
              if (x > 0) buf[idx + cols - 1] += (err * 3) / 16;
              buf[idx + cols] += (err * 5) / 16;
              if (x + 1 < cols) buf[idx + cols + 1] += (err * 1) / 16;
            }
          }
        }
        return buf;
      };

      const render = (time: number) => {
        ctx.clearRect(0, 0, w, h);
        if (background !== "transparent") {
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, w, h);
        }
        if (!ready || !pixels) return;

        const revealMs = 700;
        const revealP =
          reveal && !reduced.matches && revealStart
            ? clamp01((time - revealStart) / revealMs)
            : 1;
        const ptr = pointerRef.current;
        const diffused =
          variant === "dither" && ditherType === "floyd-steinberg"
            ? diffuse()
            : null;
        const lvlStep = 1 / (levels - 1);

        if (variant === "ascii") {
          ctx.font = `${Math.ceil(cellH * 1.05)}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
        }
        const maxLen = charset.length - 1;

        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            const i = (cy * cols + cx) * 4;
            const ink = inkAt(i);

            // Reveal wipe from the center outward.
            let alpha = 1;
            if (revealP < 1) {
              const dx = cx / cols - 0.5;
              const dy = cy / rows - 0.5;
              const dist = Math.hypot(dx, dy) / 0.72;
              alpha = clamp01((revealP * 1.35 - dist) / 0.25);
              if (alpha <= 0) continue;
            }

            // Pointer focus-lens.
            let ox = 0;
            if (interactive && ptr.active) {
              const px = cx * cellW + cellW / 2;
              const py = cy * cellH + cellH / 2;
              const focus = clamp01(
                1 - Math.hypot(px - ptr.x, py - ptr.y) / lensRadius,
              );
              alpha *= 0.25 + 0.75 * easeInOut(focus);
            }

            // Ambient glitch — offset and scramble a few rows.
            let charIndex = -1;
            if (glitch && !reduced.matches) {
              const rowSeed = Math.sin(cy * 12.9898 + scramble) * 43758.5453;
              const rowActive = rowSeed - Math.floor(rowSeed) > 0.86;
              if (rowActive) {
                ox = ((Math.floor(rowSeed * 7) % 5) - 2) * cellW;
                if ((cx + Math.floor(scramble)) % 3 === 0) {
                  const s = Math.abs(Math.sin(cx * 78.233 + scramble * 3.1));
                  charIndex = Math.floor(s * maxLen);
                }
              }
            }

            if (variant === "ascii") {
              if (ink <= 0.001 && charIndex < 0) continue;
              const idx = charIndex >= 0 ? charIndex : Math.round(ink * maxLen);
              const ch = charset[idx] ?? " ";
              if (ch === " ") continue;
              ctx.globalAlpha = alpha;
              ctx.fillStyle = inkStyle(i);
              ctx.fillText(
                ch,
                cx * cellW + cellW / 2 + ox,
                cy * cellH + cellH / 2,
              );
            } else {
              const level =
                diffused != null
                  ? (diffused[cy * cols + cx] as number)
                  : (() => {
                      const t = BAYER[cy % 4]?.[cx % 4] ?? 0.5;
                      const v = ink + (t - 0.5) / levels;
                      return clamp01(Math.round(v / lvlStep) * lvlStep);
                    })();
              if (level <= 0) continue;
              const size = level * Math.min(cellW, cellH);
              const dxp = cx * cellW + (cellW - size) / 2 + ox;
              const dyp = cy * cellH + (cellH - size) / 2;
              ctx.globalAlpha = alpha;
              ctx.fillStyle = inkStyle(i);
              if (dotShape === "circle") {
                ctx.beginPath();
                ctx.arc(
                  dxp + size / 2,
                  dyp + size / 2,
                  size / 2,
                  0,
                  Math.PI * 2,
                );
                ctx.fill();
              } else {
                ctx.fillRect(dxp, dyp, size, size);
              }
            }
          }
        }
        ctx.globalAlpha = 1;
      };

      const tick = (time: number) => {
        if (time - last >= frameGap()) {
          last = time;
          if (isVideo) sample();
          if (glitch) scramble += 0.6;
          render(time);
        } else {
          render(time);
        }
        // Keep looping while there's motion, or to finish the reveal.
        const revealing =
          reveal &&
          !reduced.matches &&
          revealStart > 0 &&
          time - revealStart < 700;
        if (needsLoop() || revealing) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };

      const start = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      const kickoff = () => {
        if (cancelled) return;
        ready = true;
        measure();
        sample();
        if (reveal && !reduced.matches) {
          revealStart = performance.now();
        }
        // Static image with no ongoing motion: draw once, no rAF.
        if (needsLoop() || (reveal && !reduced.matches)) start();
        else render(performance.now());
      };

      // Load the source.
      if (isVideo) {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.muted = muted;
        video.loop = loop;
        video.playsInline = true;
        video.preload = "auto";
        source = video;
        const onReady = () => {
          if (reduced.matches || !autoPlay) {
            video.currentTime = 0.001;
          } else {
            video.play().catch(() => {});
          }
          kickoff();
        };
        video.addEventListener("loadeddata", onReady, { once: true });
        video.src = src;
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = kickoff;
        img.onerror = () => {
          ready = true;
          render(performance.now());
        };
        source = img;
        img.src = src;
      }

      // Observers.
      const resizeObserver = new ResizeObserver(() => {
        if (!ready) return;
        measure();
        sample();
        if (rafId) return;
        render(performance.now());
      });
      resizeObserver.observe(container);

      // A portaled preview can live in a different window (the docs mobile
      // preview uses an iframe). IntersectionObserver is scoped to the window
      // that creates it, so use the container's realm instead of the module's
      // parent window; otherwise the iframe canvas is reported as not visible.
      const view = container.ownerDocument.defaultView ?? window;
      const intersectionObserver =
        "IntersectionObserver" in view
          ? new view.IntersectionObserver(
              ([entry]) => {
                visible = !!entry?.isIntersecting;
                if (!visible) stop();
                else if (needsLoop()) start();
                else if (ready) render(performance.now());
              },
              { threshold: 0 },
            )
          : undefined;
      intersectionObserver?.observe(container);

      const onVisibility = () => {
        if (document.hidden) stop();
        else if (visible && needsLoop()) start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onPointerMove = (e: PointerEvent) => {
        if (!interactive) return;
        const rect = container.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
        if (visible) start();
      };
      const onPointerLeave = () => {
        pointerRef.current.active = false;
      };
      if (interactive) {
        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerleave", onPointerLeave);
      }

      return () => {
        cancelled = true;
        stop();
        resizeObserver.disconnect();
        intersectionObserver?.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        if (source instanceof HTMLVideoElement) {
          source.pause();
          source.removeAttribute("src");
          source.load();
        }
      };
    }, [
      src,
      isVideo,
      variant,
      cellSize,
      charset,
      fontFamily,
      ditherType,
      levels,
      dotShape,
      color,
      usesTheme,
      background,
      invert,
      contrast,
      reveal,
      interactive,
      glitch,
      lensRadius,
      autoPlay,
      loop,
      muted,
      fps,
    ]);

    return (
      <div
        ref={containerRef}
        data-slot="ascii-dither"
        role="img"
        aria-label={alt}
        className={`relative size-full overflow-hidden ${className ?? ""}`}
        style={{ ...style, touchAction: interactive ? "none" : undefined }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          className={
            interactive ? "size-full" : "pointer-events-none size-full"
          }
        />
      </div>
    );
  },
);
AsciiDither.displayName = "AsciiDither";

export { AsciiDither };
