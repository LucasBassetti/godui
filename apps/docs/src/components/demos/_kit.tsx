"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "none";

const maxWidthClass: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  none: "",
};

/**
 * Center a compact demo in the stage. Use with the default (non-fullWidth)
 * Example layout — buttons, inputs, cards, small widgets.
 */
export function DemoCenter({
  children,
  className,
  max = "none",
}: {
  children: ReactNode;
  className?: string;
  /** Optional max-width on the centering shell. */
  max?: MaxWidth;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center",
        maxWidthClass[max],
        className,
      )}
    >
      {children}
    </div>
  );
}

type MediaAspect = "square" | "video" | "photo" | "portrait" | "wide";

const aspectClass: Record<MediaAspect, string> = {
  square: "aspect-square",
  video: "aspect-video",
  photo: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  wide: "aspect-[5/2]",
};

/**
 * Media / image demos — one width + aspect language across compare, accordion,
 * galleries, and tilt/holo cards. Stays centered (no Example fullWidth).
 */
export function DemoMedia({
  children,
  className,
  max = "md",
  aspect,
}: {
  children: ReactNode;
  className?: string;
  max?: Exclude<MaxWidth, "none">;
  aspect?: MediaAspect;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClass[max],
        aspect ? aspectClass[aspect] : null,
        className,
      )}
    >
      {children}
    </div>
  );
}

type ScrollPortVariant = "fill" | "framed";

type DemoScrollPortProps = {
  children: ReactNode;
  className?: string;
  /**
   * `fill` — fills the stage (pair with Example `fullWidth`).
   * `framed` — fixed-height bordered card, centered (no `fullWidth`).
   */
  variant?: ScrollPortVariant;
  /** Height for the framed variant (CSS length). Default `26rem`. */
  height?: string;
  /** Max width for the framed variant. Default `md`. */
  max?: Exclude<MaxWidth, "none">;
  /** Sticky cue at the top of the port (e.g. "Scroll to reveal"). */
  hint?: string;
};

/**
 * Scroll viewport for scroll-driven demos. Forward the ref into the component's
 * `scrollContainer` / `container` prop so the preview stage (not the window)
 * drives the scrub.
 */
function ScrollHint({ hint }: { hint: string }) {
  return (
    <div className="sticky top-0 z-10 flex justify-center bg-gradient-to-b from-card/90 to-transparent py-3">
      <span className="rounded-full border border-border/60 bg-card/80 px-2.5 py-1 font-medium text-[11px] text-muted-foreground backdrop-blur-sm">
        {hint}
      </span>
    </div>
  );
}

export const DemoScrollPort = forwardRef<HTMLDivElement, DemoScrollPortProps>(
  function DemoScrollPort(
    {
      children,
      className,
      variant = "fill",
      height = "26rem",
      max = "md",
      hint,
    },
    ref,
  ) {
    if (variant === "framed") {
      return (
        <div
          ref={ref}
          data-scroll-container
          className={cn(
            "relative mx-auto w-full overflow-x-hidden overflow-y-auto rounded-2xl border border-border bg-card/40 [scrollbar-width:thin]",
            maxWidthClass[max],
            className,
          )}
          style={{ height }}
        >
          {hint ? <ScrollHint hint={hint} /> : null}
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-scroll-container
        className={cn(
          "relative h-full min-h-0 w-full overflow-x-hidden overflow-y-auto",
          className,
        )}
      >
        {hint ? <ScrollHint hint={hint} /> : null}
        {children}
      </div>
    );
  },
);

/**
 * Vertical runway inside a scroll port so scrubbing demos have distance to
 * travel before / after the focal content.
 */
export function DemoScrollRunway({
  children,
  className,
  pad = "lg",
}: {
  children: ReactNode;
  className?: string;
  pad?: "md" | "lg" | "xl";
}) {
  const padClass = {
    md: "py-[22vh]",
    lg: "py-[40vh]",
    xl: "py-[55vh]",
  }[pad];

  return (
    <div className={cn("mx-auto w-full", padClass, className)}>{children}</div>
  );
}

/**
 * Full-bleed scene that fills the stage. Pair with Example `fullWidth` —
 * backgrounds, docks, pointer playgrounds, glass surfaces.
 */
export function DemoScene({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-1 flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
}
