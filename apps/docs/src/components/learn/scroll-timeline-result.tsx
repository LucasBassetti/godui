"use client";

import { ScrollTimeline } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `ScrollTimeline`. It measures its own track against the page scroll, so
 * (like `ContainerScroll`) this panel isn't height-clamped — scroll the page
 * through it to draw the rail. Kept to two short entries so the panel stays
 * compact.
 */
export function ScrollTimelineResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll the page through it
        </span>
      </div>
      <div className="px-4 py-10 md:px-8">
        <ScrollTimeline
          data={[
            {
              date: "2021",
              title: "The first commit",
              content: (
                <p className="text-sm text-muted-foreground md:text-base">
                  A single component and a big idea.
                </p>
              ),
            },
            {
              date: "2025",
              title: "One hundred components",
              content: (
                <p className="text-sm text-muted-foreground md:text-base">
                  Every surface, polished — you&apos;re looking at the rail
                  right now.
                </p>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
