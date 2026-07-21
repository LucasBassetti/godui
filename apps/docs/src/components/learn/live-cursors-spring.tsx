"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Every incoming `{ x, y }` is set on a `useSpring` (`stiffness: 700,
 * damping: 40, mass: 0.6`), not written straight to `style`. A raw update
 * would teleport the dot the instant a message arrives; the spring chases
 * it instead, arriving a beat later with a touch of overshoot. Reduced
 * motion calls `.jump()` — the same raw teleport, deliberately.
 *
 * The animated node is a *full-width* rail, not the 14px dot. `translateX`
 * percentages resolve against the transformed element — animating the dot
 * itself with `calc(100% - 14px)` only nudged it ~8px left of the start
 * marker. Sliding the rail moves the inner dot from the left marker to the
 * right one.
 */
const DOT = 14; // size-3.5

const CSS = `
@keyframes lcs-raw {
  0%, 38%   { transform: translateX(0); }
  40%, 88%  { transform: translateX(calc(100% - ${DOT}px)); }
  90%, 100% { transform: translateX(0); }
}
@keyframes lcs-spring {
  0%, 38%  { transform: translateX(0); }
  58%      { transform: translateX(calc(100% - ${DOT}px + 10px)); }
  72%, 88% { transform: translateX(calc(100% - ${DOT}px)); }
  100%     { transform: translateX(0); }
}
.lcs-raw-el    { animation: lcs-raw 5.6s steps(1, jump-end) infinite; }
.lcs-spring-el { animation: lcs-spring 5.6s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.lcs-static .lcs-raw-el,
.lcs-static .lcs-spring-el { animation: none; transform: none; }
`;

const LANES = [
  {
    key: "raw",
    label: "raw · x.jump(cursor.x)",
    railClass: "lcs-raw-el",
  },
  {
    key: "spring",
    label: "spring · useSpring(700, 40, 0.6)",
    railClass: "lcs-spring-el",
  },
];

const LEGEND = [
  {
    name: "Raw",
    desc: "position snaps — no interpolation between updates",
    kind: "raw" as const,
  },
  {
    name: "Spring",
    desc: "chases the target, arrives with a touch of overshoot",
    kind: "spring" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "spring") {
    return (
      <span className="relative h-3 w-8">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--foreground)]/15" />
        <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-dashed border-[var(--foreground)]/30" />
        <span className="absolute right-1 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[var(--foreground)]/70 shadow-sm" />
        <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--foreground)]/35" />
      </span>
    );
  }
  return (
    <span className="relative h-3 w-8">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--foreground)]/15" />
      <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-dashed border-[var(--foreground)]/30" />
      <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[var(--foreground)]/70 shadow-sm" />
    </span>
  );
}

export function LiveCursorsSpring() {
  return (
    <ScrollScene label="The motion" note="same update, two ways to land it">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "lcs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex w-full flex-col gap-8">
            {LANES.map((lane) => (
              <div key={lane.key} className="flex flex-col gap-2">
                <div className="relative h-6 w-full">
                  <span className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-dashed border-[var(--foreground)]/30" />
                  <span className="absolute right-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-dashed border-[var(--foreground)]/30" />
                  <span className="absolute left-1.5 right-1.5 top-1/2 h-px -translate-y-1/2 bg-[var(--foreground)]/15" />
                  {/* Full-width rail so translateX(%) is relative to the track. */}
                  <span
                    className={`${lane.railClass} absolute inset-y-0 left-0 w-full`}
                  >
                    <span className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-[var(--foreground)]/70 shadow-sm" />
                  </span>
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {lane.label}
                </p>
              </div>
            ))}
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
