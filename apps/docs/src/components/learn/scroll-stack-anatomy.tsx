"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The resting silhouette: every card is `position: sticky` at the same
 * `pinTop`, so once a card is buried it doesn't move up the page — it just
 * sits there while the next card's own `h-screen` track scrolls over it.
 * The only per-card offset is `translateY: index * peek`, which is what
 * lets a sliver of each buried card show below the one in front of it.
 */
const CSS = `
@keyframes ssa-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ssa-card { opacity: 0; animation: ssa-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.ssa-static .ssa-card { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Front card",
    desc: "index N-1, sticky top: pinTop, scale 1",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Buried card",
    desc: "same pinTop, dimmed + scaled toward baseScale",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Peek",
    desc: "translateY = index × peek — the sliver that shows below",
    swatch: "bg-[var(--foreground)]/30",
  },
];

export function ScrollStackAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one pinTop, three sticky cards">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative flex h-40 w-full flex-col items-center ${reduced ? "ssa-static" : ""}`}
          >
            <div
              className="ssa-card absolute top-0 h-24 w-44 rounded-xl bg-[var(--muted)] opacity-70 blur-[2px]"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="ssa-card absolute top-4 h-24 w-48 rounded-xl bg-[var(--muted)] opacity-85 blur-[1px]"
              style={{ animationDelay: "90ms" }}
            />
            <div
              className="ssa-card absolute top-8 flex h-24 w-52 items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] shadow-lg"
              style={{ animationDelay: "180ms" }}
            >
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/40" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={`h-1.5 w-8 rounded-full ${item.swatch}`} />
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
