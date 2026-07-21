"use client";

import { ThreeDMarquee } from "@godui/components";

const IMAGES = [
  "1015",
  "1016",
  "1018",
  "1019",
  "1024",
  "1025",
  "1027",
  "1035",
  "1036",
  "1039",
  "1043",
  "1044",
  "1047",
  "1050",
  "1051",
  "1060",
].map((id) => `https://picsum.photos/id/${id}/400/400`);

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * ThreeDMarquee, drifting on its tilted plane.
 */
export function ThreeDMarqueeResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — ambient, no interaction needed
        </span>
      </div>
      <div className="h-[26rem] w-full p-6">
        <ThreeDMarquee images={IMAGES} />
      </div>
    </div>
  );
}
