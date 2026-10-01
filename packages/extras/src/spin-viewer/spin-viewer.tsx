"use client";

import * as React from "react";

export type SpinViewerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Ordered image URLs, one per rotation frame. */
  frames: string[];
  /** Spin on its own until the first interaction. */
  autoRotate?: boolean;
  /** Auto-rotate speed, in frames per second. */
  autoRotateSpeed?: number;
  /** Pixels of horizontal drag per frame step. */
  sensitivity?: number;
  /** Reverse the drag/spin direction. */
  reverse?: boolean;
  /** Frame index to start on. */
  initialFrame?: number;
  /** Show the "drag to rotate" hint until the first interaction. */
  hint?: boolean;
  /** Accessible label for the viewer. */
  label?: string;
};

const ROOT_BASE =
  "group relative select-none overflow-hidden rounded-xl border border-border bg-card [touch-action:pan-y]";

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const SpinViewer = React.forwardRef<HTMLDivElement, SpinViewerProps>(
  (
    {
      frames,
      autoRotate = false,
      autoRotateSpeed = 12,
      sensitivity = 6,
      reverse = false,
      initialFrame = 0,
      hint = true,
      label = "360-degree view. Drag to rotate.",
      className,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    const reduced = usePrefersReducedMotion();
    const count = frames.length;
    const [index, setIndex] = React.useState(() =>
      mod(initialFrame, count || 1),
    );
    const [ready, setReady] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const [showHint, setShowHint] = React.useState(hint);
    const drag = React.useRef<{ x: number; i: number } | null>(null);

    // Preload every frame so swapping `src` is instant while dragging.
    React.useEffect(() => {
      setReady(false);
      if (count === 0) return;
      let mounted = true;
      let loaded = 0;
      const done = () => {
        loaded += 1;
        if (mounted && loaded >= count) setReady(true);
      };
      for (const src of frames) {
        const img = new Image();
        img.onload = done;
        img.onerror = done;
        img.src = src;
      }
      return () => {
        mounted = false;
      };
    }, [frames, count]);

    // Auto-rotate until the user grabs it (and never under reduced motion).
    React.useEffect(() => {
      if (!autoRotate || reduced || dragging || !ready || count === 0) return;
      let raf = 0;
      let last: number | undefined;
      let acc = 0;
      const dir = reverse ? -1 : 1;
      const step = (t: number) => {
        if (last !== undefined) {
          acc += ((t - last) / 1000) * autoRotateSpeed * dir;
          if (Math.abs(acc) >= 1) {
            const inc = Math.trunc(acc);
            acc -= inc;
            setIndex((i) => mod(i + inc, count));
          }
        }
        last = t;
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [autoRotate, reduced, dragging, ready, autoRotateSpeed, reverse, count]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (count > 0) {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, i: index };
        setDragging(true);
        setShowHint(false);
      }
      onPointerDown?.(e);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (drag.current && count > 0) {
        const dx = e.clientX - drag.current.x;
        const stepped = Math.round(dx / sensitivity) * (reverse ? -1 : 1);
        setIndex(mod(drag.current.i + stepped, count));
      }
      onPointerMove?.(e);
    };

    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      drag.current = null;
      setDragging(false);
      onPointerUp?.(e);
    };

    return (
      <div
        ref={ref}
        data-slot="spin-viewer"
        role="img"
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`${ROOT_BASE} ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className ?? ""}`}
        {...props}
      >
        {ready && count > 0 ? (
          <img
            src={frames[index]}
            alt=""
            draggable={false}
            className="pointer-events-none size-full select-none object-contain"
          />
        ) : (
          <div className="size-full animate-pulse bg-muted" aria-hidden />
        )}

        {showHint && ready ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-100 transition-opacity duration-300 group-active:opacity-0 motion-reduce:[transition:none]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="text-sm leading-none">⟲</span>
              Drag to rotate
            </span>
          </div>
        ) : null}
      </div>
    );
  },
);
SpinViewer.displayName = "SpinViewer";

export { SpinViewer };
