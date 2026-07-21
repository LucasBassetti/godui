"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One `useScroll({ target: containerRef })` value — `scrollYProgress`, `0` at
 * the top of the section, `1` at the bottom — feeds three independent
 * `useTransform`s, each wrapped in its own `useSpring` for the smoothing.
 * Scroll down and all three resolve together; scroll back up and they
 * reverse together, because they're reading the same number. Looped here as
 * a ping-pong (`alternate`) to stand in for scrolling down and back up.
 */
const CSS = `
@keyframes csrs-scrub {
  from { transform: rotateX(20deg) scale(1.05); }
  to   { transform: rotateX(0deg) scale(1); }
}
@keyframes csrs-header { from { transform: translateY(0); } to { transform: translateY(-14px); } }
@keyframes csrs-track  { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.csrs-frame  { animation: csrs-scrub 3.6s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.csrs-header { animation: csrs-header 3.6s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.csrs-track  { animation: csrs-track 3.6s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.csrs-static .csrs-frame,
.csrs-static .csrs-header { animation: none; transform: none; }
.csrs-static .csrs-track { animation: none; transform: scaleX(0.5); }
`;

function LegendSwatch({ kind }: { kind: "frame" | "header" | "track" }) {
  if (kind === "header") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "track") {
    return (
      <span className="relative h-1 w-8 overflow-hidden rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset">
        <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-[var(--foreground)]/60" />
      </span>
    );
  }
  return (
    <span className="h-3 w-6 rounded-xl border border-fd-border bg-[var(--card)] [transform:rotateX(12deg)_scale(1.05)] ring-1 ring-fd-border ring-inset" />
  );
}

export function ContainerScrollScrub() {
  return (
    <ScrollScene label="The scrub" note="one scrollYProgress, three transforms">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-4 ${reduced ? "csrs-static" : ""}`}
          >
            <div className="csrs-header flex flex-col items-center gap-2">
              <span className="h-2.5 w-28 rounded-full bg-[var(--foreground)]/50" />
            </div>

            <div className="flex h-24 w-full items-center justify-center [perspective:700px]">
              <div className="csrs-frame w-48 rounded-xl border border-fd-border bg-[var(--card)] p-1.5 shadow-lg [transform-style:preserve-3d]">
                <div className="aspect-[16/10] w-full rounded-md bg-[var(--muted)]" />
              </div>
            </div>

            <div className="relative mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="csrs-track absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/60" />
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              scrollYProgress
            </p>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <LegendSwatch kind="frame" />
              <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                frame
              </dt>
              <dd className="text-[11px] text-fd-muted-foreground">
                rotateX 20°→0° · scale 1.05→1
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <LegendSwatch kind="header" />
              <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                header y
              </dt>
              <dd className="text-[11px] text-fd-muted-foreground">0 → -100</dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <LegendSwatch kind="track" />
              <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                progress
              </dt>
              <dd className="text-[11px] text-fd-muted-foreground">
                scrollYProgress fill
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
