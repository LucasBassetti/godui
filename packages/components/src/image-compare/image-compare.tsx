"use client";

import * as React from "react";

export type ImageCompareProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Content revealed on the left / top (the "before" state). */
  before: React.ReactNode;
  /** Content underneath, revealed as the handle moves (the "after" state). */
  after: React.ReactNode;
  /** Starting handle position, 0–100. */
  initial?: number;
  orientation?: "horizontal" | "vertical";
  beforeLabel?: string;
  afterLabel?: string;
  onChange?: (position: number) => void;
};

const clamp = (n: number) => Math.min(100, Math.max(0, n));

const ImageCompare = React.forwardRef<HTMLDivElement, ImageCompareProps>(
  (
    {
      before,
      after,
      initial = 50,
      orientation = "horizontal",
      beforeLabel,
      afterLabel,
      onChange,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      ref,
      () => containerRef.current as HTMLDivElement,
    );
    const [pos, setPos] = React.useState(clamp(initial));
    const [dragging, setDragging] = React.useState(false);
    const horizontal = orientation === "horizontal";

    const updateFromPointer = React.useCallback(
      (clientX: number, clientY: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const next = horizontal
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
        const clamped = clamp(next);
        setPos(clamped);
        onChange?.(clamped);
      },
      [horizontal, onChange],
    );

    const handlePointerDown = (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      updateFromPointer(e.clientX, e.clientY);
    };
    const handlePointerMove = (e: React.PointerEvent) => {
      if (!dragging) return;
      updateFromPointer(e.clientX, e.clientY);
    };
    const stop = () => setDragging(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2;
      const dec = horizontal ? "ArrowLeft" : "ArrowUp";
      const inc = horizontal ? "ArrowRight" : "ArrowDown";
      if (e.key === dec) {
        e.preventDefault();
        setPos((p) => {
          const n = clamp(p - step);
          onChange?.(n);
          return n;
        });
      } else if (e.key === inc) {
        e.preventDefault();
        setPos((p) => {
          const n = clamp(p + step);
          onChange?.(n);
          return n;
        });
      }
    };

    // The "before" layer is clipped to the handle position.
    const clip = horizontal
      ? `inset(0 ${100 - pos}% 0 0)`
      : `inset(0 0 ${100 - pos}% 0)`;
    // Full-span divider line.
    const lineStyle: React.CSSProperties = horizontal
      ? { left: `${pos}%`, top: 0, bottom: 0, transform: "translateX(-50%)" }
      : { top: `${pos}%`, left: 0, right: 0, transform: "translateY(-50%)" };
    // Grabber centered on the opposite axis (uses the `translate` property so
    // the `scale` hover utilities stay independent).
    const handleStyle: React.CSSProperties = horizontal
      ? { left: `${pos}%`, top: "50%", translate: "-50% -50%" }
      : { top: `${pos}%`, left: "50%", translate: "-50% -50%" };
    const transition = dragging ? "" : "[transition:clip-path_120ms_ease-out]";

    return (
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        className={`group relative touch-none select-none overflow-hidden rounded-xl border border-border ${
          className ?? ""
        }`}
        {...props}
      >
        {/* After (base) layer */}
        <div className="[&_img]:pointer-events-none [&_img]:block [&_img]:size-full [&_img]:object-cover">
          {after}
        </div>
        {afterLabel && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {afterLabel}
          </span>
        )}

        {/* Before (clipped) layer */}
        <div
          aria-hidden="true"
          style={{ clipPath: clip }}
          className={`absolute inset-0 ${transition} [&_img]:pointer-events-none [&_img]:block [&_img]:size-full [&_img]:object-cover`}
        >
          {before}
        </div>
        {beforeLabel && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {beforeLabel}
          </span>
        )}

        {/* Divider + grabber */}
        <div
          aria-hidden="true"
          style={lineStyle}
          className={`pointer-events-none absolute bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] ${
            horizontal ? "w-0.5" : "h-0.5"
          }`}
        />
        <button
          type="button"
          role="slider"
          aria-label="Comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          style={handleStyle}
          className="absolute grid size-9 cursor-grab touch-none place-items-center rounded-full border-2 border-white bg-white/20 text-white shadow-lg backdrop-blur-sm [transition:scale_150ms_ease] active:scale-95 active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-hover:scale-110"
        >
          <span className="absolute inset-0 animate-pulse rounded-full ring-2 ring-white/40 group-hover:hidden" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`size-4 ${horizontal ? "" : "rotate-90"}`}
            aria-hidden="true"
          >
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </button>
      </div>
    );
  },
);
ImageCompare.displayName = "ImageCompare";

export { ImageCompare };
