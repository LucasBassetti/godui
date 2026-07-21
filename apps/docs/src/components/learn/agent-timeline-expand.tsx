"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The collapsible body, looping open and closed. The real component drives
 * `height: "auto"` with a spring (`stiffness: 320, damping: 32, mass: 0.9`)
 * wrapped in `AnimatePresence` — here that's approximated with a `scaleY` +
 * `opacity` keyframe pair on a fixed-content panel, transform-origin top, so
 * the CSS demo stays a compositor-only stand-in for the real spring. The
 * chevron rotates on its own flat 250ms-ish curve, independent of the panel.
 */
const CSS = `
@keyframes ate-panel {
  0%, 6%    { transform: scaleY(0); opacity: 0; }
  20%       { transform: scaleY(1.04); opacity: 1; }
  28%, 68%  { transform: scaleY(1); opacity: 1; }
  86%, 100% { transform: scaleY(0); opacity: 0; }
}
@keyframes ate-chevron {
  0%, 6%    { transform: rotate(0deg); }
  24%, 68%  { transform: rotate(90deg); }
  92%, 100% { transform: rotate(0deg); }
}
@keyframes ate-title {
  0%, 6%    { opacity: 0.55; }
  24%, 68%  { opacity: 1; }
  92%, 100% { opacity: 0.55; }
}
.ate-panel   { transform-origin: top; animation: ate-panel 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.ate-chevron { animation: ate-chevron 3.6s ease infinite; }
.ate-title   { animation: ate-title 3.6s ease infinite; }
.ate-static .ate-panel   { animation: none; transform: scaleY(1); opacity: 1; }
.ate-static .ate-chevron { animation: none; transform: rotate(90deg); }
.ate-static .ate-title   { animation: none; opacity: 1; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Body",
    desc: "scaleY + opacity, spring 320/32/0.9",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Chevron",
    desc: "rotate 0 → 90deg, independent curve",
    swatch: "bg-[var(--foreground)]/60",
  },
];

export function AgentTimelineExpand() {
  return (
    <ScrollScene label="The body" note="collapsed → open, looping">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-9 ${reduced ? "ate-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="size-2.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
              </span>
              <span className="my-1 w-px flex-1 rounded bg-[var(--border)]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 py-0.5">
                <span className="ate-title h-2 w-28 rounded-full bg-[var(--foreground)]/60" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="ate-chevron ml-auto shrink-0 text-fd-muted-foreground"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <div className="ate-panel mt-1.5 overflow-hidden rounded-lg border border-fd-border bg-[var(--muted)]/40 p-2.5">
                <span className="block h-1.5 w-[80%] rounded-full bg-[var(--foreground)]/25" />
                <span className="mt-1.5 block h-1.5 w-[60%] rounded-full bg-[var(--foreground)]/15" />
                <span className="mt-1.5 block h-1.5 w-[35%] rounded-full bg-[var(--foreground)]/15" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
