"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ScrollSceneProps = {
  /** Bar label, e.g. "Anatomy". */
  label: string;
  /** Optional muted sub-label to the right of the label. */
  note?: string;
  /** Render-prop; `play` flips true on scroll-in and on replay. */
  children: (play: boolean) => ReactNode;
  className?: string;
};

export function ScrollScene({
  label,
  note,
  children,
  className,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !el || typeof IntersectionObserver === "undefined") {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    setPlay(false);
    // Two frames: let the reset state paint before re-arming, so CSS
    // transitions run again from the start.
    requestAnimationFrame(() => requestAnimationFrame(() => setPlay(true)));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          {label}
        </span>
        {note ? (
          <span className="font-mono text-fd-muted-foreground text-xs">
            {note}
          </span>
        ) : null}
        <button
          type="button"
          onClick={replay}
          aria-label="Replay animation"
          title="Replay"
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
      <div className="relative flex min-h-[360px] items-center justify-center p-6 md:min-h-[420px] md:p-10">
        {children(play)}
      </div>
    </div>
  );
}
