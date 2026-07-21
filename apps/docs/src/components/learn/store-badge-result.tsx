"use client";

import { StoreBadge, StoreBadgeGroup } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * StoreBadgeGroup. Hover (or focus) a badge for the scan-to-download QR.
 */
export function StoreBadgeResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover for the QR
        </span>
      </div>
      <div className="flex min-h-[220px] flex-wrap items-center justify-center gap-4 p-10">
        <StoreBadgeGroup>
          <StoreBadge
            store="app-store"
            href="https://apps.apple.com/app/id6761287549"
            qr
          />
          <StoreBadge
            store="google-play"
            href="https://play.google.com/store/apps/details?id=lol.hivemind"
            qr
          />
        </StoreBadgeGroup>
      </div>
    </div>
  );
}
