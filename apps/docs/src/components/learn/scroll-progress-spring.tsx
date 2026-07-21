"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Pipeline: `useScroll` → `scrollYProgress` → `useSpring` (stiffness 120,
 * damping 24) → `scaleX`. Reduced motion swaps in a near-instant spring
 * (stiffness 1000, damping 100) so the bar still tracks, just without lag.
 */

const CSS = `
@keyframes sps-raw {
  0%, 10%  { transform: scaleX(0); }
  40%      { transform: scaleX(0.7); }
  55%      { transform: scaleX(0.55); }
  80%      { transform: scaleX(1); }
  100%     { transform: scaleX(0); }
}
@keyframes sps-spring {
  0%, 10%  { transform: scaleX(0); }
  45%      { transform: scaleX(0.68); }
  60%      { transform: scaleX(0.58); }
  85%      { transform: scaleX(0.98); }
  100%     { transform: scaleX(0); }
}
.sps-raw    { animation: sps-raw 3.6s cubic-bezier(0.45,0,0.55,1) infinite; }
.sps-spring { animation: sps-spring 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.sps-static .sps-raw    { animation: none; transform: scaleX(0.7); }
.sps-static .sps-spring { animation: none; transform: scaleX(0.65); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "raw" | "spring" | "reduced";
}[] = [
  {
    name: "Raw",
    desc: "scrollYProgress — jumps with scroll",
    kind: "raw",
  },
  {
    name: "Spring",
    desc: "stiffness 120 · damping 24",
    kind: "spring",
  },
  {
    name: "Reduced",
    desc: "stiffness 1000 · damping 100",
    kind: "reduced",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "spring") {
    return (
      <span className="h-1 w-8 rounded-full bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "reduced") {
    return (
      <span className="h-1 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
  );
}

export function ScrollProgressSpring() {
  return (
    <ScrollScene label="The spring" note="useScroll → useSpring → scaleX">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "sps-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <span className="sps-raw absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/35" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                scrollYProgress
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <span className="sps-spring absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/70" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                useSpring(scrollYProgress, SPRING)
              </p>
            </div>
          </div>

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
