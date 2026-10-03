"use client";

import { useReducedMotion } from "framer-motion";
import * as React from "react";

export type SpotlightRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The hidden layer exposed under the spotlight (image, text, anything). */
  reveal: React.ReactNode;
  /** The top/cover layer is passed as children. */
  children?: React.ReactNode;
  /** Spotlight radius in px. */
  radius?: number;
  /** Edge feather, 0 (hard) – 1 (very soft). */
  softness?: number;
  /** Follow easing per frame, 0 (frozen) – 1 (instant). Lower = more lag. */
  ease?: number;
};

const SpotlightReveal = React.forwardRef<HTMLDivElement, SpotlightRevealProps>(
  (
    {
      reveal,
      children,
      radius = 150,
      softness = 0.55,
      ease = 0.16,
      className,
      onPointerMove,
      onPointerEnter,
      onPointerLeave,
      onClick,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const coverRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const reduce = useReducedMotion();

    const cur = React.useRef({ x: 0, y: 0 });
    const target = React.useRef({ x: 0, y: 0 });
    const hovering = React.useRef(false);
    const pinned = React.useRef(false);
    const raf = React.useRef<number | null>(null);

    // Eased follow + idle breathing, written straight to CSS vars on the cover.
    React.useEffect(() => {
      if (reduce) return;
      const start = performance.now();
      const frame = (now: number) => {
        const el = ref.current;
        const cover = coverRef.current;
        if (el && cover) {
          const w = el.clientWidth;
          const h = el.clientHeight;
          if (!hovering.current && !pinned.current) {
            // Drift the spotlight in a slow ellipse to invite interaction.
            const t = (now - start) / 1000;
            target.current = {
              x: w / 2 + Math.cos(t * 0.6) * w * 0.18,
              y: h / 2 + Math.sin(t * 0.8) * h * 0.16,
            };
            if (cur.current.x === 0 && cur.current.y === 0) {
              cur.current = { x: w / 2, y: h / 2 };
            }
          }
          cur.current.x += (target.current.x - cur.current.x) * ease;
          cur.current.y += (target.current.y - cur.current.y) * ease;
          cover.style.setProperty("--x", `${cur.current.x}px`);
          cover.style.setProperty("--y", `${cur.current.y}px`);
        }
        raf.current = requestAnimationFrame(frame);
      };
      raf.current = requestAnimationFrame(frame);
      return () => {
        if (raf.current != null) cancelAnimationFrame(raf.current);
      };
    }, [ease, reduce]);

    const setFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const inner = Math.max(0, radius * (1 - softness));
    const maskImage = `radial-gradient(circle ${radius}px at var(--x, 50%) var(--y, 50%), transparent 0, transparent ${inner}px, #000 ${radius}px)`;

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: decorative reveal surface; layered content stays accessible
      // biome-ignore lint/a11y/useKeyWithClickEvents: click only pins the spotlight (pointer enhancement, not an action)
      <div
        ref={ref}
        data-slot="spotlight-reveal"
        onPointerMove={(e) => {
          onPointerMove?.(e);
          if (!pinned.current) setFromEvent(e);
        }}
        onPointerEnter={(e) => {
          onPointerEnter?.(e);
          hovering.current = true;
          setFromEvent(e);
        }}
        onPointerLeave={(e) => {
          onPointerLeave?.(e);
          hovering.current = false;
        }}
        onClick={(e) => {
          onClick?.(e);
          pinned.current = !pinned.current;
        }}
        className={`relative overflow-hidden rounded-xl ${className ?? ""}`}
        {...props}
      >
        {/* Hidden layer underneath. */}
        <div className="absolute inset-0">{reveal}</div>

        {/* Cover layer — punched through by the spotlight mask. With reduced
            motion the mask is dropped so both layers read as a calm blend. */}
        <div
          ref={coverRef}
          className="absolute inset-0"
          style={
            reduce
              ? { opacity: 0.9 }
              : { WebkitMaskImage: maskImage, maskImage }
          }
        >
          {children}
        </div>
      </div>
    );
  },
);
SpotlightReveal.displayName = "SpotlightReveal";

export { SpotlightReveal };
