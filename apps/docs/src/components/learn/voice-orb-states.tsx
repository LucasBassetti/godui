"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Looping idle → listening → speaking cycle. Ring only on listening;
 * amplitude swell only when not idle. Grayscale plates — color lives on
 * the live Result orb.
 */
const CSS = `
@keyframes vos-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}
@keyframes vos-ring {
  0%   { opacity: 0.7; transform: scale(0.92); }
  100% { opacity: 0;   transform: scale(1.28); }
}
@keyframes vos-swell {
  0%, 100% { transform: scale(1); }
  40%      { transform: scale(1.14); }
  70%      { transform: scale(1.04); }
}
@keyframes vos-cycle {
  0%, 28%   { opacity: 1; }
  33%, 100% { opacity: 0; }
}
@keyframes vos-cycle-mid {
  0%, 28%   { opacity: 0; }
  33%, 61%  { opacity: 1; }
  66%, 100% { opacity: 0; }
}
@keyframes vos-cycle-end {
  0%, 61%   { opacity: 0; }
  66%, 100% { opacity: 1; }
}
.vos-orb { position: absolute; inset: 0; }
.vos-idle { animation: vos-cycle 4.8s ease-in-out infinite; }
.vos-listen { animation: vos-cycle-mid 4.8s ease-in-out infinite; }
.vos-speak { animation: vos-cycle-end 4.8s ease-in-out infinite; }
.vos-core-breathe { animation: vos-breathe 2.4s ease-in-out infinite; }
.vos-ring-el { animation: vos-ring 1.2s ease-out infinite; }
.vos-core-swell { animation: vos-swell 1.1s ease-in-out infinite; }
.vos-static .vos-idle,
.vos-static .vos-listen { opacity: 0; animation: none; }
.vos-static .vos-speak { opacity: 1; animation: none; }
.vos-static .vos-core-breathe,
.vos-static .vos-ring-el,
.vos-static .vos-core-swell { animation: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "idle" | "listening" | "speaking";
}[] = [
  {
    name: "Idle",
    desc: "amp → 0 · breathe only",
    kind: "idle",
  },
  {
    name: "Listening",
    desc: "ring duration ∝ amp",
    kind: "listening",
  },
  {
    name: "Speaking",
    desc: "core + corona swell",
    kind: "speaking",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "listening") {
    return (
      <span className="size-3 rounded-full border border-[var(--ring)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "speaking") {
    return (
      <span className="relative flex size-3 items-center justify-center">
        <span className="absolute inset-0 scale-125 rounded-full bg-[var(--foreground)]/10 blur-[2px]" />
        <span className="relative size-3 rounded-full border border-border bg-[var(--card)] shadow-sm" />
      </span>
    );
  }
  return (
    <span className="size-3 rounded-full border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function VoiceOrbStates() {
  return (
    <ScrollScene label="States" note="idle → listening → speaking">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "vos-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative size-36">
            {cycle > 0 || reduced ? (
              <>
                <div className="vos-orb vos-idle flex items-center justify-center">
                  <div className="vos-core-breathe size-[78%] rounded-full border border-border bg-[var(--card)]" />
                </div>
                <div className="vos-orb vos-listen flex items-center justify-center">
                  <div className="vos-ring-el absolute inset-0 rounded-full border border-[var(--ring)]" />
                  <div className="size-[78%] rounded-full border border-border bg-[var(--card)]" />
                </div>
                <div className="vos-orb vos-speak flex items-center justify-center">
                  <div className="absolute inset-0 scale-110 rounded-full bg-[var(--foreground)]/10 blur-xl" />
                  <div className="vos-core-swell size-[78%] rounded-full border border-border bg-[var(--card)] shadow-md" />
                </div>
              </>
            ) : null}
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
