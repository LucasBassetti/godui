"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The real drag reveal is a `clip-path` on the before layer. For this
 * *looping* illustration we stand in for that with a plain opacity
 * crossfade between two full-bleed plates — compositor-only — while the
 * divider + handle actually slide via `translateX`. Same read (drag right,
 * more "before" shows), no clip-path animating on a timer.
 */
const CSS = `
@keyframes ics-handle {
  0%, 100% { transform: translateX(-38%); }
  50%      { transform: translateX(38%); }
}
@keyframes ics-before {
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.88; }
}
.ics-handle { animation: ics-handle 3.6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.ics-before { animation: ics-before 3.6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.ics-static .ics-handle { animation: none; transform: translateX(0%); }
.ics-static .ics-before { animation: none; opacity: 0.5; }
`;

export function ImageCompareScrub() {
  return (
    <ScrollScene label="The drag" note="clip-path in prod, opacity here">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "ics-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-40 w-64 overflow-hidden rounded-2xl border border-white/10">
            <div className="absolute inset-0 bg-[var(--muted)]" />
            <div className="ics-before absolute inset-0 bg-[var(--foreground)]/60" />
            <div className="ics-handle absolute inset-y-0 left-1/2 flex items-center justify-center">
              <span className="absolute inset-y-0 w-px bg-white/90" />
              <span className="relative grid size-8 place-items-center rounded-full border-2 border-white bg-white/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                  aria-hidden="true"
                >
                  <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
                </svg>
              </span>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3.5 w-6 rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                After
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                static base
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-3.5 w-6 rounded-lg bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Before
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                opacity stands in for clip
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="relative flex size-3.5 items-center justify-center rounded-full border-2 border-white/90 bg-white/20 ring-1 ring-fd-border ring-inset">
                <span className="absolute inset-y-0 w-px bg-white/90" />
              </span>
              <dt className="font-medium text-[13px] text-fd-foreground">
                Handle
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                translateX, no clip involved
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
