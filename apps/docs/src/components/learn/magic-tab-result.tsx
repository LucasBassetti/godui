"use client";

import { MagicTab, type MagicTabItem } from "@godui/components";

const ITEMS: MagicTabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "settings", label: "Settings" },
];

/**
 * Closing "here's the finished thing" panel — the real, interactive Magic
 * Tab. Click between tabs to feel the lift, tab in with the keyboard to see
 * the deeper focus-visible lift, and watch the rainbow edge run under the
 * selected tab.
 */
export function MagicTabResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click, or tab in with the keyboard
        </span>
      </div>
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <MagicTab items={ITEMS} defaultValue="overview" rainbow />
      </div>
    </div>
  );
}
