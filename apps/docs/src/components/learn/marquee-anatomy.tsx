"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Marquee never scrolls one row of children — it clones them `repeat` times
 * (clamped to a minimum of 2) into identical tracks that sit edge-to-edge.
 * Track `i > 0` gets `aria-hidden` so screen readers only announce the first
 * copy. This scene shows two tracks side-by-side so the seam is visible.
 */

const CSS = `
@keyframes mqa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mqa-el { animation: mqa-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mqa-static .mqa-el { animation: none; opacity: 1; transform: none; }
`;

const ITEMS = [0, 1, 2, 3] as const;

const LEGEND: {
  name: string;
  desc: string;
  kind: "track0" | "trackN" | "repeat";
}[] = [
  {
    name: "Track 0",
    desc: "live copy — readable to AT",
    kind: "track0",
  },
  {
    name: "Track 1…n",
    desc: "identical clones, aria-hidden",
    kind: "trackN",
  },
  {
    name: "repeat",
    desc: "Math.max(2, repeat) tracks",
    kind: "repeat",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "track0") {
    return (
      <span className="h-3 w-5 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "trackN") {
    return (
      <span className="h-3 w-5 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
  );
}

function Track({ tone, delay }: { tone: "muted" | "card"; delay: string }) {
  return (
    <div
      className="mqa-el flex shrink-0 gap-2"
      style={{ "--d": delay } as CSSProperties}
    >
      {ITEMS.map((i) => (
        <span
          key={i}
          className={`flex h-10 w-14 items-center justify-center rounded-md ${
            tone === "muted"
              ? "bg-[var(--muted)]"
              : "border border-fd-border bg-[var(--card)]"
          }`}
        >
          <span className="h-1.5 w-6 rounded-full bg-[var(--foreground)]/30" />
        </span>
      ))}
    </div>
  );
}

export function MarqueeAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="duplicated tracks · min 2">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "mqa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="mqa-el flex w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] p-3 [--gap:0.5rem]">
            <div className="flex gap-2" style={{ gap: "var(--gap)" }}>
              <Track tone="muted" delay="0ms" />
              <Track tone="card" delay="120ms" />
            </div>
          </div>

          <p className="font-mono text-[11px] text-fd-muted-foreground">
            {"Array.from({ length: Math.max(2, repeat) })"}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
