"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The structure behind SegmentedControl: one `role="tablist"` track
 * (`bg-muted`, rounded, padded) holding one `role="tab"` button per option,
 * and a single pill. The pill is `absolute inset-0` of the *active* button —
 * it lives inside exactly one segment at a time, never in the track itself.
 * Matches the real component: no gap between segments, track `p-1` + fixed
 * height so the pill sits flush in the content box.
 */
const SEGMENTS = 3;
const ACTIVE = 1;

const CSS = `
@keyframes sca-bar {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes sca-pill {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: none; }
}
.sca-bar  { opacity: 0; animation: sca-bar 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.sca-pill { opacity: 0; animation: sca-pill 520ms cubic-bezier(0.3,0.7,0.4,1.2) 640ms both; }
.sca-static .sca-bar  { opacity: 1; animation: none; transform: none; }
.sca-static .sca-pill { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Track",
    desc: 'role="tablist" — bg-muted, rounded, p-1',
    swatch:
      "h-3 w-8 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Segment buttons",
    desc: 'one role="tab" per option',
    swatch:
      "h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Sliding pill",
    desc: "bg-background, absolute inset-0 of the active tab",
    swatch:
      "h-3 w-8 rounded-md bg-[var(--background)] shadow-sm ring-1 ring-fd-border ring-inset",
  },
];

export function SegmentedControlAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one track · three tabs · one pill">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`inline-flex h-10 items-stretch rounded-lg border border-fd-border bg-[var(--muted)] p-1 ${reduced ? "sca-static" : ""}`}
          >
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segment row
                key={i}
                className="relative flex w-24 items-center justify-center px-3"
              >
                {i === ACTIVE && (
                  <div className="sca-pill absolute inset-0 rounded-md bg-[var(--background)] shadow-sm ring-1 ring-fd-border" />
                )}
                <span
                  className={`sca-bar relative z-10 h-2 w-12 rounded-full ${
                    i === ACTIVE
                      ? "bg-[var(--foreground)]/80"
                      : "bg-[var(--foreground)]/30"
                  }`}
                  style={{ "--d": `${i * 90}ms` } as CSSProperties}
                />
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
