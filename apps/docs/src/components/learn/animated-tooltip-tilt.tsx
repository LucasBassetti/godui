"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `onMouseMove` reads `clientX` relative to the trigger's own center and
 * writes it to a `useMotionValue`. Two `useTransform`s remap that raw
 * `[-60, 60]` pixel range to `rotate [-14, 14]` and `x [-12, 12]`, and both
 * are wrapped in the *same* `useSpring` — so the panel doesn't track the
 * pointer 1:1, it chases a target through the 170/12/0.1 spring, lagging
 * a beat behind the raw cursor position.
 */
const CSS = `
@keyframes att-cursor {
  0%, 100% { transform: translateX(0); }
  28%      { transform: translateX(52px); }
  72%      { transform: translateX(-52px); }
}
@keyframes att-panel {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  32%      { transform: translateX(11px) rotate(13deg); }
  76%      { transform: translateX(-11px) rotate(-13deg); }
}
.att-cursor { animation: att-cursor 4.4s cubic-bezier(0.65,0,0.35,1) infinite; }
.att-panel  { animation: att-panel 4.4s cubic-bezier(0.34,1.4,0.64,1) infinite 90ms; }
.att-static .att-cursor,
.att-static .att-panel { animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "pointer" | "rotate" | "translate";
}[] = [
  {
    name: "Pointer",
    desc: "clientX − trigger center, raw px",
    kind: "pointer",
  },
  {
    name: "Rotate",
    desc: "useTransform [-60,60] → [-14,14]",
    kind: "rotate",
  },
  {
    name: "TranslateX",
    desc: "useTransform [-60,60] → [-12,12]",
    kind: "translate",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pointer") {
    return (
      <span className="size-2 rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "rotate") {
    return (
      <span className="h-3 w-6 rounded-lg bg-[var(--foreground)] [transform:rotate(8deg)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative h-3 w-7">
      <span className="absolute inset-y-0 left-0 w-5 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
      <span className="absolute inset-y-1 left-3 w-3 rounded-lg bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
    </span>
  );
}

export function AnimatedTooltipTilt() {
  return (
    <ScrollScene label="Pointer tilt" note="x → spring → rotate + x">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "att-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="relative flex flex-col items-center">
            {/* the pointer, sweeping across the trigger's width */}
            <div className="relative mb-2 h-4 w-32">
              <span className="att-cursor absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-[var(--foreground)]/50" />
            </div>

            <div className="flex flex-col items-center [transform-style:preserve-3d]">
              <div className="att-panel flex flex-col items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5">
                <span className="h-2 w-16 rounded-full bg-[var(--background)]/70" />
                <span className="h-2 w-10 rounded-full bg-[var(--background)]/40" />
              </div>
              <div className="h-5" />
              <div className="flex size-12 items-center justify-center rounded-full border border-border bg-[var(--muted)]">
                <span className="size-4 rounded-full bg-[var(--foreground)]/30" />
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            useSpring(useTransform(x, [-60, 60], [...]), {"{"} stiffness: 170,
            damping: 12, mass: 0.1 {"}"})
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
