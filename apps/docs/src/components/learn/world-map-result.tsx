"use client";

import { WorldMap } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `WorldMap`. It needs its natural aspect ratio to lay the dots and arcs out
 * correctly, so this panel isn't height-clamped like the smaller Result
 * panels.
 */
export function WorldMapResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — the arcs draw and loop
        </span>
      </div>
      <div className="p-6 md:p-10">
        <WorldMap
          connections={[
            {
              start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
              end: { lat: 51.5074, lng: -0.1278, label: "London" },
            },
            {
              start: { lat: 51.5074, lng: -0.1278, label: "London" },
              end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
            },
            {
              start: { lat: 40.7128, lng: -74.006, label: "New York" },
              end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
            },
          ]}
        />
      </div>
    </div>
  );
}
