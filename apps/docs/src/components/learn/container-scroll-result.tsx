"use client";

import { ContainerScroll } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `ContainerScroll`. It needs real scroll room to run its transforms, so
 * this panel isn't height-clamped like the other Result panels — scroll the
 * page through it to watch the frame settle.
 */
export function ContainerScrollResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll through it
        </span>
      </div>
      <ContainerScroll
        header={
          <>
            <h2 className="text-3xl font-bold text-foreground md:text-5xl">
              Scroll to bring it to life
            </h2>
            <p className="mt-4 text-muted-foreground">
              The frame un-tilts and settles as you scroll.
            </p>
          </>
        }
      >
        <img src="https://picsum.photos/id/1005/1200/750" alt="Dashboard" />
      </ContainerScroll>
    </div>
  );
}
