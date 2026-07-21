"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The signature move: as `scrollY` crosses `scrollThreshold` the nav flips from a
 * wide `rounded-2xl` bar (`max-w-5xl`) to a compact `rounded-full` pill
 * (`max-w-2xl`). The real component does this with Framer `layout` + a class
 * swap — children keep their size; only the shell width/radius/padding change.
 * This scene mirrors that: animate `width` + `border-radius` + padding, never
 * `scaleX`/`scaleY` (those squash the logo into an ellipse). Radius stays
 * pill-shaped while width changes, then settles to `rounded-2xl` only when
 * fully expanded — so expand never flashes boxy corners.
 */
const CSS = `
@keyframes rhm-scroll {
  0%, 14%  { transform: translateY(0); }
  46%, 66% { transform: translateY(60px); }
  100%     { transform: translateY(0); }
}
/* Radius stays pill while width changes — only settle to rounded-2xl
   once fully expanded. Otherwise expand interpolates 9999px→1rem on a
   still-narrow bar and corners go boxy mid-flight. */
@keyframes rhm-bar {
  0%, 16% {
    width: 100%;
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
  28% {
    width: 100%;
    border-radius: 9999px;
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
  46%, 66% {
    width: 68%;
    border-radius: 9999px;
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }
  82% {
    width: 100%;
    border-radius: 9999px;
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
  92%, 100% {
    width: 100%;
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    gap: 1rem;
  }
}
.rhm-scroll { animation: rhm-scroll 4.4s cubic-bezier(0.4,0,0.2,1) infinite; }
/* No spring overshoot — a 1.4 bounce on border-radius undershoots
   past 1rem toward 0 and the corners flash square on expand. */
.rhm-bar {
  animation: rhm-bar 4.4s cubic-bezier(0.4,0,0.2,1) infinite;
  width: 100%;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  gap: 1rem;
}
.rhm-static .rhm-scroll { animation: none; transform: translateY(60px); }
.rhm-static .rhm-bar {
  animation: none;
  width: 68%;
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  gap: 0.75rem;
}
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "expanded" | "collapsed";
}[] = [
  {
    name: "Expanded",
    desc: "max-w-5xl · rounded-2xl · scrollY ≤ threshold",
    kind: "expanded",
  },
  {
    name: "Collapsed",
    desc: "max-w-2xl · rounded-full pill · past threshold",
    kind: "collapsed",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "expanded") {
    return (
      <span className="flex h-5 w-11 items-center gap-1 rounded-2xl border border-border bg-[var(--card)] px-1.5 shadow-sm">
        <span className="size-1.5 shrink-0 rounded-full bg-[var(--foreground)]/45" />
        <span className="h-1 flex-1 rounded-full bg-[var(--foreground)]/28" />
        <span className="h-2 w-3 shrink-0 rounded-full bg-[var(--foreground)]/25" />
      </span>
    );
  }
  return (
    <span className="flex h-4 w-8 items-center gap-0.5 rounded-full border border-border bg-[var(--card)] px-1 shadow-sm">
      <span className="size-1.5 shrink-0 rounded-full bg-[var(--foreground)]/45" />
      <span className="h-1 flex-1 rounded-full bg-[var(--foreground)]/28" />
      <span className="h-1.5 w-2.5 shrink-0 rounded-full bg-[var(--foreground)]/25" />
    </span>
  );
}

export function ResizableHeaderMorph() {
  return (
    <ScrollScene label="Scroll morph" note="wide bar → floating pill">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full items-start gap-6 ${reduced ? "rhm-static" : ""}`}
          >
            {/* Scroll rail: thumb travels down past the threshold tick. */}
            <div className="relative mt-1 h-[88px] w-1.5 shrink-0 rounded-full bg-[var(--foreground)]/10">
              <div className="absolute inset-x-[-5px] top-[18px] h-px bg-[var(--foreground)]/40" />
              <div className="rhm-scroll absolute inset-x-0 top-0 h-6 rounded-full bg-[var(--foreground)]/40" />
            </div>

            {/* Shell width/radius morph — children stay unscaled. */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="rhm-bar mx-auto flex items-center justify-between border border-border bg-[var(--card)] shadow-sm">
                <span className="size-5 shrink-0 rounded-full bg-[var(--foreground)]/45" />
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <span className="h-2 w-10 shrink-0 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-2 w-10 shrink-0 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-2 w-10 shrink-0 rounded-full bg-[var(--foreground)]/30" />
                </div>
                <span className="h-6 w-16 shrink-0 rounded-full bg-[var(--foreground)]/25" />
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
