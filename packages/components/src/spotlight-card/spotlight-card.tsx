"use client";

import * as React from "react";

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Color of the spotlight glow. Accepts any CSS color. */
  glowColor?: string;
  /** Radius of the spotlight in pixels. */
  radius?: number;
  /** Also light up the card border as the pointer moves. */
  border?: boolean;
};

const ROOT_BASE =
  "group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground";

// Radial glow that follows the pointer. `--x` / `--y` are written on pointer move;
// they default to the center so the very first paint isn't a hard corner flash.
const GLOW_BASE =
  "pointer-events-none absolute inset-0 opacity-0 [transition:opacity_400ms_ease] group-hover:opacity-100 motion-reduce:[transition:none] [background:radial-gradient(var(--spotlight-radius)_circle_at_var(--x,50%)_var(--y,50%),var(--spotlight-color),transparent_65%)]";

// Border highlight: the same gradient masked to the 1px ring only.
const BORDER_BASE =
  "pointer-events-none absolute inset-0 rounded-xl opacity-0 [transition:opacity_400ms_ease] group-hover:opacity-100 motion-reduce:[transition:none] [background:radial-gradient(var(--spotlight-radius)_circle_at_var(--x,50%)_var(--y,50%),var(--spotlight-color),transparent_65%)] [-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude] p-px";

const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      glowColor = "color-mix(in oklch, var(--primary) 40%, transparent)",
      radius = 350,
      border = true,
      className,
      style,
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

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
      onPointerMove?.(e);
    };

    return (
      <div
        ref={ref}
        data-slot="spotlight-card"
        onPointerMove={handlePointerMove}
        className={`${ROOT_BASE} ${className ?? ""}`}
        style={{
          ["--spotlight-color" as string]: glowColor,
          ["--spotlight-radius" as string]: `${radius}px`,
          ...style,
        }}
        {...props}
      >
        <div aria-hidden className={GLOW_BASE} />
        {border ? <div aria-hidden className={BORDER_BASE} /> : null}
        <div className="relative z-raised">{children}</div>
      </div>
    );
  },
);
SpotlightCard.displayName = "SpotlightCard";

export { SpotlightCard };
