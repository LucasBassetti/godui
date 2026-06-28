"use client";

import * as React from "react";

export type ImageTrailProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Images cycled through as the pointer moves. */
  images: string[];
  /** Minimum pointer distance (px) between two spawned images. */
  threshold?: number;
  /** Lifespan of each trail image, in ms. */
  duration?: number;
  /** Maximum images alive at once (the recycled DOM pool size). */
  max?: number;
  /** Width/height of each trail image, in px. */
  size?: number;
};

const ImageTrail = React.forwardRef<HTMLDivElement, ImageTrailProps>(
  (
    {
      images,
      threshold = 64,
      duration = 750,
      max = 12,
      size = 180,
      className,
      children,
      onPointerMove,
      ...props
    },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );

    // Pool of <img> slots, recycled round-robin. We drive everything with the
    // Web Animations API and direct style writes — no React re-render per move.
    const slots = React.useRef<(HTMLImageElement | null)[]>([]);
    const last = React.useRef<{ x: number; y: number } | null>(null);
    const slotIndex = React.useRef(0);
    const imageIndex = React.useRef(0);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      const el = ref.current;
      if (!el || images.length === 0) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const prev = last.current;
      if (prev) {
        const dx = x - prev.x;
        const dy = y - prev.y;
        if (Math.hypot(dx, dy) < threshold) return;
        // Tilt the image a touch toward the direction of travel.
        spawn(x, y, Math.atan2(dy, dx));
      } else {
        spawn(x, y, 0);
      }
      last.current = { x, y };
    };

    const spawn = (x: number, y: number, angleRad: number) => {
      const img = slots.current[slotIndex.current % max];
      slotIndex.current += 1;
      if (!img) return;

      img.src = images[imageIndex.current % images.length] as string;
      imageIndex.current += 1;

      const tilt = Math.max(-12, Math.min(12, (angleRad * 180) / Math.PI / 6));
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      img.animate(
        [
          {
            opacity: 0,
            transform: `translate(-50%, -50%) scale(0.4) rotate(${tilt}deg)`,
          },
          {
            opacity: 1,
            transform: `translate(-50%, -50%) scale(1) rotate(${tilt}deg)`,
            offset: 0.18,
          },
          {
            opacity: 0,
            transform: `translate(-50%, -65%) scale(0.92) rotate(${tilt}deg)`,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(0.22,1,0.36,1)",
          fill: "forwards",
        },
      );
    };

    return (
      <div
        ref={ref}
        data-slot="image-trail"
        onPointerMove={handlePointerMove}
        className={`relative overflow-hidden ${className ?? ""}`}
        {...props}
      >
        {/* Reduced-motion users get a calm static gallery instead of a trail. */}
        <div className="pointer-events-none absolute inset-0 hidden place-items-center motion-reduce:grid">
          <div className="flex flex-wrap justify-center gap-3 p-6 opacity-60">
            {images.slice(0, 5).map((src, i) => (
              <img
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed gallery order
                key={i}
                src={src}
                alt=""
                className="size-24 rounded-lg object-cover shadow-md"
              />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 motion-reduce:hidden">
          {Array.from({ length: max }).map((_, i) => (
            <img
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed recycled pool slot
              key={i}
              ref={(node) => {
                slots.current[i] = node;
              }}
              alt=""
              aria-hidden
              className="absolute rounded-xl object-cover opacity-0 shadow-2xl ring-1 ring-border/40 will-change-transform"
              style={{ width: size, height: size, left: 0, top: 0 }}
            />
          ))}
        </div>

        {children}
      </div>
    );
  },
);
ImageTrail.displayName = "ImageTrail";

export { ImageTrail };
