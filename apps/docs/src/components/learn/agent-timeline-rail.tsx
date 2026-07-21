"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One step looping pending → running → success forever, with the connector
 * beneath it tracking the same clock: `scaleY` 0 → 0.5 → 1, origin-top — the
 * exact transform the real spring animates to on each status change. Three
 * absolutely-stacked rings cross-fade instead of animating `border-color`,
 * so a look never has to interpolate through a muddy in-between hue.
 */
const CSS = `
@keyframes atr-pending  { 0%, 28%  { opacity: 1; } 33%, 100% { opacity: 0; } }
@keyframes atr-running  { 0%, 28%  { opacity: 0; } 33%, 61%  { opacity: 1; } 66%, 100% { opacity: 0; } }
@keyframes atr-success  { 0%, 61%  { opacity: 0; } 66%, 100% { opacity: 1; } }
@keyframes atr-fill {
  0%, 30%  { transform: scaleY(0); }
  40%, 60% { transform: scaleY(0.5); }
  72%, 100% { transform: scaleY(1); }
}
@keyframes atr-spin { to { transform: rotate(360deg); } }
@keyframes atr-ping {
  0%   { opacity: 0.6; transform: scale(0.9); }
  100% { opacity: 0;   transform: scale(1.7); }
}
.atr-phase { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.atr-pending  { animation: atr-pending 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.atr-running  { animation: atr-running 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.atr-success  { animation: atr-success 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.atr-fill-el  { animation: atr-fill 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.atr-spinner  { animation: atr-spin 0.7s linear infinite; }
.atr-ping-el  { animation: atr-ping 1.15s ease-out infinite; }
.atr-static .atr-pending,
.atr-static .atr-running { opacity: 0; animation: none; }
.atr-static .atr-success { opacity: 1; animation: none; }
.atr-static .atr-fill-el { animation: none; transform: scaleY(1); }
.atr-static .atr-spinner,
.atr-static .atr-ping-el { animation: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "pending" | "running" | "success";
}[] = [
  {
    name: "Pending",
    desc: "hollow ring, dot",
    kind: "pending",
  },
  {
    name: "Running",
    desc: "spinner + ping, half fill",
    kind: "running",
  },
  {
    name: "Success",
    desc: "solid ring, check, full fill",
    kind: "success",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pending") {
    return (
      <span className="relative flex size-3 items-center justify-center rounded-full border-2 border-fd-border bg-[var(--background)]">
        <span className="size-1 rounded-full bg-fd-muted-foreground" />
      </span>
    );
  }
  if (kind === "running") {
    return (
      <span className="size-3 rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]/10" />
    );
  }
  return (
    <span className="size-3 rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]" />
  );
}

export function AgentTimelineRail() {
  return (
    <ScrollScene label="The motion" note="pending → running → success, looping">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[300px] flex-col items-center gap-8 ${reduced ? "atr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex flex-col items-center">
            <div className="relative size-9">
              <div className="atr-phase atr-pending">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-fd-border bg-[var(--background)]">
                  <span className="size-2 rounded-full bg-fd-muted-foreground" />
                </span>
              </div>
              <div className="atr-phase atr-running">
                <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]/10">
                  <span className="atr-spinner size-3.5 rounded-full border-2 border-[var(--primary)] border-t-transparent" />
                  <span className="atr-ping-el absolute inset-0 rounded-full border border-[var(--primary)]" />
                </span>
              </div>
              <div className="atr-phase atr-success">
                <span className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 text-[var(--primary-foreground)]"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </div>
            </div>

            <span className="relative my-1 h-16 w-px overflow-hidden rounded bg-[var(--border)]">
              <span className="atr-fill-el absolute inset-x-0 top-0 h-full origin-top bg-[var(--primary)]" />
            </span>

            <span className="flex size-9 items-center justify-center rounded-full border-2 border-fd-border bg-[var(--background)] opacity-40">
              <span className="size-2 rounded-full bg-fd-muted-foreground" />
            </span>
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
