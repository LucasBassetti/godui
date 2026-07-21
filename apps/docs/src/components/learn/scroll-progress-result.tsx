"use client";

import { ScrollProgress } from "@godui/components";
import * as React from "react";

/**
 * Closing panel — real ScrollProgress tracking a scrollable box (bar +
 * circle stacked so both variants are one scroll away).
 */

const FILLER = Array.from({ length: 12 });

export function ScrollProgressResult() {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll the panel
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-6 md:p-10">
        <div
          ref={ref}
          data-scroll-container
          className="relative h-72 w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card"
        >
          <ScrollProgress container={ref} />
          <div className="space-y-4 p-6 pb-16">
            <p className="font-medium text-foreground text-sm">
              Scroll this panel
            </p>
            {FILLER.map((_, i) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: static filler
                key={i}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                Progress springs toward the scroll position — paragraph {i + 1}{" "}
                of {FILLER.length}.
              </p>
            ))}
          </div>
          <ScrollProgress
            variant="circle"
            container={ref}
            showAfter={0.05}
            position="bottom-right"
          />
        </div>
      </div>
    </div>
  );
}
