"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Lifecycle gates: IntersectionObserver (threshold 0.35) sets active;
 * loop waits 2s then resets count/typed; reduced dumps all lines at once
 * with no caret. Three columns — idle → in view → loop restart.
 */
const CSS = `
@keyframes tl-view {
  0%, 12%  { opacity: 0.35; transform: scale(0.96); }
  28%, 55% { opacity: 1; transform: scale(1); }
  70%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes tl-fill {
  0%, 20% { transform: scaleX(0); opacity: 0; }
  35%, 60% { transform: scaleX(1); opacity: 1; }
  75% { transform: scaleX(1); opacity: 1; }
  88%, 100% { transform: scaleX(0); opacity: 0; }
}
@keyframes tl-loop {
  0%, 60% { opacity: 0; }
  72%, 85% { opacity: 1; }
  100% { opacity: 0; }
}
.tl-panel { animation: tl-view 4.5s ease both infinite; }
.tl-bar {
  transform-origin: left center;
  animation: tl-fill 4.5s ease both infinite;
}
.tl-loop-tag { animation: tl-loop 4.5s ease both infinite; }
.tl-static .tl-panel { animation: none; opacity: 1; transform: none; }
.tl-static .tl-bar {
  animation: none;
  transform: scaleX(1);
  opacity: 1;
}
.tl-static .tl-loop-tag { animation: none; opacity: 0; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "view" | "loop" | "reduced";
}[] = [
  {
    name: "startOnView",
    desc: "IO threshold 0.35 → setActive(true), disconnect",
    kind: "view",
  },
  {
    name: "Loop",
    desc: "2s pause, then count=0 / typed=0",
    kind: "loop",
  },
  {
    name: "Reduced",
    desc: "dump lines.length immediately, no caret",
    kind: "reduced",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "view") {
    return (
      <span className="flex h-7 w-10 flex-col justify-center gap-0.5 rounded-lg border border-dashed border-fd-border bg-[var(--card)] px-1.5 ring-1 ring-fd-border ring-inset">
        <span className="h-1 w-full rounded-full bg-[var(--foreground)]/40" />
        <span className="h-1 w-4/5 rounded-full bg-[var(--foreground)]/18" />
      </span>
    );
  }
  if (kind === "loop") {
    return (
      <svg
        aria-hidden="true"
        className="size-4 text-fd-muted-foreground"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8a5 5 0 0 1 8.5-3.5M13 8a5 5 0 0 1-8.5 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M11 2.5v2.5H13.5M5 13.5V11H2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <span className="flex flex-col gap-0.5">
      <span className="h-1 w-7 rounded-full bg-[var(--foreground)]/40" />
      <span className="h-1 w-8 rounded-full bg-[var(--foreground)]/18" />
      <span className="h-1 w-5 rounded-full bg-[var(--foreground)]/40" />
    </span>
  );
}

export function TerminalLifecycle() {
  return (
    <ScrollScene label="Lifecycle" note="IO 0.35 · loop 2s · reduced dump">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "tl-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex w-full max-w-[340px] flex-col items-center gap-4">
            {/* Viewport frame */}
            <div className="w-full rounded-lg border border-dashed border-fd-border px-4 py-3">
              <p className="mb-3 text-center font-mono text-[10px] text-fd-muted-foreground">
                viewport · threshold 0.35
              </p>
              <div className="tl-panel overflow-hidden rounded-lg border border-fd-border bg-[var(--card)] p-4">
                <div className="space-y-2">
                  <span
                    className="tl-bar block h-2 w-32 rounded-full bg-[var(--foreground)]/40"
                    aria-hidden="true"
                  />
                  <span
                    className="tl-bar block h-2 w-40 rounded-full bg-[var(--foreground)]/18"
                    style={{ animationDelay: "180ms" }}
                    aria-hidden="true"
                  />
                  <span
                    className="tl-bar block h-2 w-24 rounded-full bg-[var(--foreground)]/40"
                    style={{ animationDelay: "360ms" }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
            <svg
              aria-hidden="true"
              className="tl-loop-tag size-4 text-fd-muted-foreground"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8a5 5 0 0 1 8.5-3.5M13 8a5 5 0 0 1-8.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 2.5v2.5H13.5M5 13.5V11H2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
