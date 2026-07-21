"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The real open state: a `size-7` circular pin (`rounded-full rounded-bl-sm`
 * — the one corner left square reads as a speech-bubble tail) sits at
 * `left/top`, and the thread panel is a sibling `absolute left-0 top-9 w-72`
 * anchored to the pin's own box, not the page — it moves with the pin.
 */
const CSS = `
@keyframes cpa-in {
  from { opacity: 0; transform: translateY(8px) scale(0.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.cpa-el { opacity: 0; animation: cpa-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cpa-static .cpa-el { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; kind: "pin" | "panel" }[] = [
  {
    name: "Pin",
    desc: "rounded-full rounded-bl-sm, presence color, initials or a dot",
    kind: "pin",
  },
  {
    name: "Thread panel",
    desc: "absolute left-0 top-9, origin-top-left, anchored to the pin",
    kind: "panel",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pin") {
    return (
      <span className="size-3 rounded-full rounded-bl-sm bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-6 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function CommentPinAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one anchor, one panel hanging off it">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "cpa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="relative h-56 w-full">
            <div
              className="cpa-el absolute left-0 top-0 flex size-9 items-center justify-center rounded-full rounded-bl-sm bg-[var(--foreground)]/70 shadow-md ring-2 ring-fd-card"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="size-1.5 rounded-full bg-[var(--background)]" />
            </div>

            <div
              className="cpa-el absolute left-0 top-11 w-60 origin-top-left overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-lg"
              style={{ "--d": "90ms" } as CSSProperties}
            >
              <div className="flex flex-col gap-3 p-3">
                {[0, 1].map((row) => (
                  <div key={row} className="flex gap-2.5">
                    <span className="mt-0.5 size-5 shrink-0 rounded-full bg-[var(--foreground)]/25" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="h-1.5 w-16 rounded-full bg-[var(--foreground)]/30" />
                      <span className="h-1.5 w-full rounded-full bg-[var(--foreground)]/15" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-fd-border p-2">
                <span className="h-6 flex-1 rounded-lg bg-[var(--muted)]" />
                <span className="size-6 shrink-0 rounded-lg bg-[var(--foreground)]/20" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
