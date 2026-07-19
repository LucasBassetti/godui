"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/cn";

/**
 * `prefers-reduced-motion`, read the SSR-safe way. `useSyncExternalStore`
 * serves the server snapshot (`false`) during render/hydration, then swaps to
 * the live match afterward — no hydration mismatch, and no derived setState in
 * an effect (which `react-hooks/set-state-in-effect` rightly flags).
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof matchMedia === "undefined") return () => {};
      const mq = matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** State handed to a scene's render-prop. */
export type SceneAnim = {
  /**
   * Bumped each time the scene should play: 0 before it scrolls in, 1 on
   * scroll-in, then +1 per replay. Use it as a React `key` on the animated
   * subtree so CSS animations restart cleanly on replay.
   */
  cycle: number;
  /** True when the user prefers reduced motion — render the resolved state. */
  reduced: boolean;
};

type ScrollSceneProps = {
  /** Bar label, e.g. "Anatomy". */
  label: string;
  /** Optional muted sub-label to the right of the label. */
  note?: string;
  children: (anim: SceneAnim) => ReactNode;
  className?: string;
};

export function ScrollScene({
  label,
  note,
  children,
  className,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cycle, setCycle] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el || typeof IntersectionObserver === "undefined") {
      setCycle(1);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCycle((c) => (c === 0 ? 1 : c));
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const replay = () => setCycle((c) => c + 1);

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
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
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
        {children({ cycle, reduced })}
      </div>
    </div>
  );
}
