"use client";

import { Globe } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real `Globe`, tuned with
 * the same dark, understated marker palette as the marketing demo. Drag it.
 */
const GLOBE_CONFIG = {
  dark: 1,
  diffuse: 1.1,
  mapBrightness: 3.4,
  baseColor: [0.22, 0.25, 0.32] as [number, number, number],
  markerColor: [0.62, 0.82, 1] as [number, number, number],
  glowColor: [0.14, 0.22, 0.45] as [number, number, number],
  markers: [
    { location: [37.7595, -122.4367] as [number, number], size: 0.06 },
    { location: [40.7128, -74.006] as [number, number], size: 0.07 },
    { location: [51.5074, -0.1278] as [number, number], size: 0.06 },
    { location: [35.6762, 139.6503] as [number, number], size: 0.06 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.05 },
    { location: [1.3521, 103.8198] as [number, number], size: 0.05 },
  ],
};

export function GlobeResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag it
        </span>
      </div>
      <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#04060f] p-6 md:min-h-[420px] md:p-10">
        <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b50b8]/25 blur-3xl" />
        <Globe config={GLOBE_CONFIG} className="relative max-w-[380px]" />
      </div>
    </div>
  );
}
