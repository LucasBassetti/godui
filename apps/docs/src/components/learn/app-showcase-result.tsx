"use client";

import { AppShowcase } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * AppShowcase in `loop` mode: the screen auto-scrolls on the CSS track while
 * the phone is in view, no scroll-linked JS required.
 */
export function AppShowcaseResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — auto-scrolling while in view
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-10">
        <AppShowcase
          device="iphone"
          mode="loop"
          width={220}
          src="https://picsum.photos/seed/godui-learn-app/600/1300"
          alt="App home screen"
        />
      </div>
    </div>
  );
}
