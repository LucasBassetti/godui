"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type FluidCursorProps = {
  /** Diameter of the leading dot in pixels. Defaults to `18`. */
  size?: number;
  /** Dot color. With `blend` on, `white` reads as a clean invert. Defaults to `white`. */
  color?: string;
  /** Invert whatever is underneath via `mix-blend-mode: difference`. Defaults to `true`. */
  blend?: boolean;
  /** Render a soft lagging smear behind the dot. Defaults to `true`. */
  trail?: boolean;
  /**
   * Scope the cursor to an element instead of the whole page. The element must
   * be positioned (e.g. `relative`). Omit for a global cursor.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Selector for elements that enlarge the cursor on hover. */
  interactiveSelector?: string;
  className?: string;
};

const FluidCursor = ({
  size = 18,
  color = "white",
  blend = true,
  trail = true,
  containerRef,
  interactiveSelector = "a, button, [role='button'], [data-cursor]",
  className,
}: FluidCursorProps) => {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const trailRef = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(false);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const motion = React.useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    sx: 0,
    sy: 0,
    hover: 0,
    thover: 0,
    inside: 0,
    seen: false,
  });

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(fine && !reduce);
    setTarget(containerRef ? containerRef.current : document.body);
  }, [containerRef]);

  React.useEffect(() => {
    if (!enabled || !target) return;
    const s = motion.current;
    const scoped = Boolean(containerRef);
    const host: HTMLElement | Window = scoped ? target : window;

    const point = (e: PointerEvent) => {
      if (scoped) {
        const r = target.getBoundingClientRect();
        s.tx = e.clientX - r.left;
        s.ty = e.clientY - r.top;
      } else {
        s.tx = e.clientX;
        s.ty = e.clientY;
      }
    };

    const move = (e: PointerEvent) => {
      point(e);
      if (!s.seen) {
        s.x = s.sx = s.tx;
        s.y = s.sy = s.ty;
        s.seen = true;
      }
      if (!scoped) s.inside = 1;
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      s.thover = el?.closest?.(interactiveSelector) ? 1 : 0;
    };
    const enter = () => {
      s.inside = 1;
    };
    const leave = () => {
      s.inside = 0;
    };

    host.addEventListener("pointermove", move as EventListener, {
      passive: true,
    });
    host.addEventListener("pointerover", over as EventListener, {
      passive: true,
    });
    if (scoped) {
      host.addEventListener("pointerenter", enter as EventListener);
      host.addEventListener("pointerleave", leave as EventListener);
    }

    let raf = 0;
    const loop = () => {
      s.x += (s.tx - s.x) * 0.25;
      s.y += (s.ty - s.y) * 0.25;
      s.sx += (s.tx - s.sx) * 0.12;
      s.sy += (s.ty - s.sy) * 0.12;
      s.hover += (s.thover - s.hover) * 0.15;

      const visible = s.seen && s.inside ? "1" : "0";
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) scale(${1 + s.hover * 1.6})`;
        dot.style.opacity = visible;
      }
      const tr = trailRef.current;
      if (tr) {
        tr.style.transform = `translate3d(${s.sx}px, ${s.sy}px, 0) translate(-50%, -50%) scale(${1 + s.hover * 0.8})`;
        tr.style.opacity = visible;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerover", over as EventListener);
      if (scoped) {
        host.removeEventListener("pointerenter", enter as EventListener);
        host.removeEventListener("pointerleave", leave as EventListener);
      }
    };
  }, [enabled, target, containerRef, interactiveSelector]);

  if (!enabled || !target) return null;

  const scoped = Boolean(containerRef);

  return createPortal(
    <div
      aria-hidden
      data-slot="fluid-cursor"
      className={`pointer-events-none ${scoped ? "absolute" : "fixed"} inset-0 z-toast overflow-hidden ${blend ? "mix-blend-difference" : ""} ${className ?? ""}`}
    >
      {trail ? (
        <div
          ref={trailRef}
          className="absolute left-0 top-0 rounded-full opacity-0 blur-md [transition:opacity_250ms_ease]"
          style={{ width: size * 2.4, height: size * 2.4, background: color }}
        />
      ) : null}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full opacity-0 [transition:opacity_250ms_ease]"
        style={{ width: size, height: size, background: color }}
      />
    </div>,
    target,
  );
};
FluidCursor.displayName = "FluidCursor";

export { FluidCursor };
