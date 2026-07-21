"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The enter transition is a genuinely underdamped spring — `stiffness: 170,
 * damping: 12, mass: 0.1`. Low mass and low damping relative to that
 * stiffness means it doesn't just ease to rest, it overshoots past `scale: 1`
 * and settles back, which a plain easing curve can't reproduce. Looped here
 * as mount → overshoot → settle → exit (a quick, non-spring fade).
 */
const CSS = `
@keyframes ats-cycle {
  0%, 6%   { opacity: 0; transform: translateY(8px) scale(0.85); }
  32%      { opacity: 1; transform: translateY(-3px) scale(1.09); }
  46%      { transform: translateY(1px) scale(0.97); }
  58%, 84% { opacity: 1; transform: translateY(0) scale(1); }
  94%, 100%{ opacity: 0; transform: translateY(6px) scale(0.9); }
}
.ats-panel { animation: ats-cycle 3.2s cubic-bezier(0.33,0.62,0.4,1) infinite; }
.ats-static .ats-panel { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "panel" | "overshoot" | "trigger";
}[] = [
  {
    name: "Tooltip panel",
    desc: "opacity 0 → 1, tied to the same spring",
    kind: "panel",
  },
  {
    name: "Overshoot",
    desc: "scale 0.85 → 1, overshoots to ~1.09 first",
    kind: "overshoot",
  },
  {
    name: "Trigger",
    desc: "8px → 0, settles a beat after scale peaks",
    kind: "trigger",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "trigger") {
    return (
      <span className="size-3 rounded-full border border-border bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "overshoot") {
    return (
      <span className="h-3.5 w-8 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-7 rounded-lg bg-[var(--foreground)]/80 ring-1 ring-fd-border ring-inset" />
  );
}

export function AnimatedTooltipSpring() {
  return (
    <ScrollScene label="The motion" note="mount spring · overshoot · settle">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "ats-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex flex-col items-center">
            <div className="ats-panel flex flex-col items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5">
              <span className="h-2 w-16 rounded-full bg-[var(--background)]/70" />
              <span className="h-2 w-10 rounded-full bg-[var(--background)]/40" />
            </div>
            <div className="h-5" />
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-[var(--muted)]">
              <span className="size-4 rounded-full bg-[var(--foreground)]/30" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 170, damping: 12, mass: 0.1 }'}
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
