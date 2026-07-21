"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Side-by-side: default scrub reverses on scroll-up; `keepRevealed` latches
 * each segment at Math.max(prev, raw) so dim never returns once lit.
 */
const CSS = `
@keyframes strl-track {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
/* reverse scrub — dims on the way back */
@keyframes strl-rev0 {
  0% { opacity: 0.15; }
  10%, 50% { opacity: 1; }
  60%, 100% { opacity: 0.15; }
}
@keyframes strl-rev1 {
  0%, 10% { opacity: 0.15; }
  20%, 50% { opacity: 1; }
  70%, 100% { opacity: 0.15; }
}
@keyframes strl-rev2 {
  0%, 20% { opacity: 0.15; }
  30%, 50% { opacity: 1; }
  80%, 100% { opacity: 0.15; }
}
@keyframes strl-rev3 {
  0%, 30% { opacity: 0.15; }
  40%, 50% { opacity: 1; }
  90%, 100% { opacity: 0.15; }
}
/* latch — stays lit after peak */
@keyframes strl-lat0 {
  0% { opacity: 0.15; }
  10%, 100% { opacity: 1; }
}
@keyframes strl-lat1 {
  0%, 10% { opacity: 0.15; }
  20%, 100% { opacity: 1; }
}
@keyframes strl-lat2 {
  0%, 20% { opacity: 0.15; }
  30%, 100% { opacity: 1; }
}
@keyframes strl-lat3 {
  0%, 30% { opacity: 0.15; }
  40%, 100% { opacity: 1; }
}
.strl-track {
  transform-origin: left center;
  animation: strl-track 3.2s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
}
.strl-rev0 { animation: strl-rev0 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-rev1 { animation: strl-rev1 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-rev2 { animation: strl-rev2 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-rev3 { animation: strl-rev3 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-lat0 { animation: strl-lat0 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-lat1 { animation: strl-lat1 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-lat2 { animation: strl-lat2 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-lat3 { animation: strl-lat3 6.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strl-static .strl-track { animation: none; transform: scaleX(0.35); }
.strl-static .strl-rev0,
.strl-static .strl-rev1 { animation: none; opacity: 1; }
.strl-static .strl-rev2,
.strl-static .strl-rev3 { animation: none; opacity: 0.15; }
.strl-static .strl-lat0,
.strl-static .strl-lat1,
.strl-static .strl-lat2,
.strl-static .strl-lat3 { animation: none; opacity: 1; }
`;

const REV = ["strl-rev0", "strl-rev1", "strl-rev2", "strl-rev3"] as const;
const LAT = ["strl-lat0", "strl-lat1", "strl-lat2", "strl-lat3"] as const;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Scrub",
    desc: "reveal tracks raw progress — dims on scroll-up",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Latch",
    desc: "Math.max(prev, v) — stays lit once revealed",
    swatch: "bg-[var(--foreground)]",
  },
];

function SlotRow({ classes }: { classes: readonly string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {classes.map((cls) => (
        <span
          key={cls}
          aria-hidden="true"
          className={`${cls} h-2 w-10 rounded-full bg-[var(--foreground)]`}
        />
      ))}
    </div>
  );
}

export function ScrollTextRevealLatch() {
  return (
    <ScrollScene label="keepRevealed" note="latch vs reverse on scroll-up">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-2 gap-6 sm:gap-8 ${reduced ? "strl-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex min-h-[72px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-fd-border bg-[var(--card)] px-3 py-4">
                <SlotRow classes={REV} />
                <div className="relative h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-[var(--muted)]">
                  <span className="strl-track absolute inset-y-0 left-0 w-full rounded-full bg-[var(--foreground)]/45" />
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                default scrub
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex min-h-[72px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-fd-border bg-[var(--card)] px-3 py-4">
                <SlotRow classes={LAT} />
                <div className="relative h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-[var(--muted)]">
                  <span className="strl-track absolute inset-y-0 left-0 w-full rounded-full bg-[var(--foreground)]/45" />
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                keepRevealed
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
                />
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
