"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two outcomes of the same gesture, side by side: release before the hold
 * completes and the fill springs back to 0 (stiffness 320 / damping 32 /
 * mass 0.9); hold through and it fills linearly to 1, then draws the check.
 */
const CSS = `
@keyframes hc-cancel {
  0%, 6%    { transform: scaleX(0); }
  38%, 44%  { transform: scaleX(0.55); }
  70%, 100% { transform: scaleX(0); }
}
@keyframes hc-confirm {
  0%, 6%    { transform: scaleX(0); }
  62%       { transform: scaleX(1); }
  100%      { transform: scaleX(1); }
}
@keyframes hc-check {
  0%, 62%   { stroke-dashoffset: 1; opacity: 0; }
  68%       { opacity: 1; }
  74%, 100% { stroke-dashoffset: 0; opacity: 1; }
}
.hc-cancel  { animation: hc-cancel 4.2s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.hc-confirm { animation: hc-confirm 4.2s linear infinite; }
.hc-check   { animation: hc-check 4.2s linear infinite; }
.hc-static .hc-cancel  { animation: none; transform: scaleX(0); }
.hc-static .hc-confirm { animation: none; transform: scaleX(1); }
.hc-static .hc-check   { animation: none; stroke-dashoffset: 0; opacity: 1; }
`;

function Pill({ fillClass }: { fillClass: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex h-12 w-[150px] items-center justify-center overflow-hidden rounded-xl bg-[var(--foreground)]"
        aria-hidden="true"
      >
        <span
          className={`absolute inset-0 origin-left bg-[var(--background)]/30 ${fillClass}`}
        />
        {fillClass === "hc-confirm" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="relative size-5 text-[var(--background)]"
            aria-hidden="true"
          >
            <path
              className="hc-check"
              d="M5 12.5 10 17.5 19 7"
              pathLength={1}
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 1 }}
            />
          </svg>
        )}
      </div>
      <p className="font-mono text-[11px] text-fd-muted-foreground">
        {fillClass === "hc-cancel" ? "released early" : "held to 900ms"}
      </p>
    </div>
  );
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "cancel" | "confirm";
}[] = [
  {
    name: "Cancel",
    desc: "spring(320, 32, 0.9) back to 0",
    kind: "cancel",
  },
  {
    name: "Confirm",
    desc: "linear to 1, then check draws in 0.3s",
    kind: "confirm",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "cancel") {
    return (
      <span className="relative h-3.5 w-8 overflow-hidden rounded-lg ring-1 ring-fd-border ring-inset">
        <span className="absolute inset-0 bg-[var(--foreground)]" />
        <span className="absolute inset-y-0 left-0 w-[55%] bg-[var(--background)]/30" />
      </span>
    );
  }
  return (
    <span className="relative h-3.5 w-8 overflow-hidden rounded-lg ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-0 bg-[var(--foreground)]" />
      <span className="absolute inset-0 bg-[var(--background)]/30" />
    </span>
  );
}

export function HoldCancel() {
  return (
    <ScrollScene label="Cancel vs confirm" note="release early · hold through">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "hc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div key={cycle} className="flex items-center justify-center gap-8">
            <Pill fillClass="hc-cancel" />
            <Pill fillClass="hc-confirm" />
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
