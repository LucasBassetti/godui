"use client";

import * as React from "react";

export type MarqueeDirection = "left" | "right" | "up" | "down";

export type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Scroll direction. Horizontal: `"left"` / `"right"`; vertical: `"up"` / `"down"`. */
  direction?: MarqueeDirection;
  /** Loop duration in seconds — higher is slower. */
  speed?: number;
  /** Pause the animation while the pointer is over the marquee. */
  pauseOnHover?: boolean;
  /** Fade the leading and trailing edges into the background. */
  fade?: boolean;
  /** Number of times the children are duplicated to fill the track seamlessly. */
  repeat?: number;
};

const ROOT_BASE =
  "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]";

const TRACK_BASE =
  "flex shrink-0 justify-around [gap:var(--gap)] [animation-play-state:running] motion-reduce:animate-none";

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      direction = "left",
      speed = 40,
      pauseOnHover = true,
      fade = true,
      repeat = 4,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const vertical = direction === "up" || direction === "down";
    const reverse = direction === "right" || direction === "down";

    const trackClass = [
      TRACK_BASE,
      vertical
        ? "flex-col animate-marquee-vertical"
        : "flex-row animate-marquee",
      reverse ? "[animation-direction:reverse]" : "",
      pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const fadeClass = fade
      ? vertical
        ? "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        : "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      : "";

    return (
      <div
        ref={ref}
        data-slot="marquee"
        className={`${ROOT_BASE} ${vertical ? "flex-col" : "flex-row"} ${fadeClass} ${className ?? ""}`}
        style={{ ["--duration" as string]: `${speed}s`, ...style }}
        {...props}
      >
        {Array.from({ length: Math.max(2, repeat) }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: duplicated tracks are identical and static
          <div key={i} aria-hidden={i > 0} className={trackClass}>
            {children}
          </div>
        ))}
      </div>
    );
  },
);
Marquee.displayName = "Marquee";

export { Marquee };
