"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Advancing one step is three separate techniques layered together: the
 * circle's color/border swap is a plain 250ms CSS `transition`, the
 * checkmark draws in via an SVG `pathLength` tween, and the connector fills
 * on `spring(320, 32, 0.9)` — the one piece that's allowed to overshoot.
 */
const CSS = `
@keyframes stp-fill      { 0%, 10% { opacity: 0; } 24%, 100% { opacity: 1; } }
@keyframes stp-check     { 0%, 20% { stroke-dashoffset: 1; opacity: 0; } 26% { opacity: 1; } 32%, 100% { stroke-dashoffset: 0; opacity: 1; } }
@keyframes stp-connector { 0%, 30% { transform: scaleX(0); } 46% { transform: scaleX(1.06); } 55%, 100% { transform: scaleX(1); } }
@keyframes stp-ring      { 0%, 55% { opacity: 0; transform: scale(0.8); } 65%, 100% { opacity: 1; transform: scale(1); } }
.stp-fill      { animation: stp-fill 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stp-check     { animation: stp-check 3.6s linear infinite; }
.stp-connector { animation: stp-connector 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stp-ring      { animation: stp-ring 3.6s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.stp-static .stp-fill,
.stp-static .stp-ring { animation: none; opacity: 1; transform: scale(1); }
.stp-static .stp-check { animation: none; stroke-dashoffset: 0; opacity: 1; }
.stp-static .stp-connector { animation: none; transform: scaleX(1); }
`;

export function StepperProgress() {
  return (
    <ScrollScene label="The motion" note="250ms color · spring fill · SVG draw">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-start ${reduced ? "stp-static" : ""}`}
          >
            <div className="flex flex-col items-center">
              <div className="relative grid size-9 place-items-center rounded-full border-2 border-[var(--foreground)] text-sm font-medium text-[var(--foreground)]">
                <span className="stp-fill absolute inset-0 rounded-full bg-[var(--foreground)]" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative size-4 text-[var(--background)]"
                  aria-hidden="true"
                >
                  <path
                    className="stp-check"
                    d="M5 13l4 4L19 7"
                    pathLength={1}
                    style={{ strokeDasharray: 1 }}
                  />
                </svg>
              </div>
              <p className="mt-2 font-mono text-[11px] text-fd-muted-foreground">
                complete
              </p>
            </div>

            <div className="mt-[17px] h-0.5 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="stp-connector block h-full w-full origin-left rounded-full bg-[var(--foreground)]/70" />
            </div>

            <div className="flex flex-col items-center">
              <div className="relative grid size-9 place-items-center rounded-full border-2 border-[var(--foreground)] bg-transparent text-sm font-medium text-[var(--foreground)]">
                <span className="stp-ring absolute -inset-1.5 rounded-full border border-[var(--foreground)]/25" />
                <span className="relative">•</span>
              </div>
              <p className="mt-2 font-mono text-[11px] text-fd-muted-foreground">
                active
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Circle
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                CSS transition, 250ms ease
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Connector
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                spring(320, 32, 0.9), slight overshoot
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Check
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                pathLength 0 → 1, 0.3s easeOut
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
