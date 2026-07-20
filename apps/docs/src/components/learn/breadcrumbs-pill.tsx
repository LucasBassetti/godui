"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Every link crumb shares one `layoutId`-bound hover pill (`bg-accent`,
 * `absolute inset-0`). It only exists under whichever crumb is hovered, so
 * moving the pointer along the trail springs the same element from box to
 * box instead of fading four separate highlights. Faked here as a looping
 * `translateX` sweep across four crumb slots.
 */
const CRUMBS = 4;
const WIDTHS = ["w-10", "w-12", "w-10", "w-9"];
const PITCH = 72; // crumb slot width (64px) + gap (8px), px

const CSS = `
@keyframes bp-slide {
  0%, 16%   { transform: translateX(0); }
  33%, 49%  { transform: translateX(${PITCH}px); }
  66%, 82%  { transform: translateX(${PITCH * 2}px); }
  99%, 100% { transform: translateX(${PITCH * 3}px); }
}
.bp-pill { animation: bp-slide 4.8s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.bp-static .bp-pill { animation: none; transform: none; }
`;

export function BreadcrumbsPill() {
  return (
    <ScrollScene label="The motion" note="one hover pill · layoutId spring">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[520px] flex-col items-center gap-9 ${reduced ? "bp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div key={cycle} className="relative flex items-center gap-2">
            <span
              aria-hidden="true"
              className="bp-pill pointer-events-none absolute top-0 left-0 h-8 w-16 rounded-lg bg-[var(--foreground)]/10"
            />
            {Array.from({ length: CRUMBS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length crumb row
                key={i}
                className="relative flex h-8 w-16 items-center justify-center"
              >
                <span
                  className={`h-2 ${WIDTHS[i]} rounded-full bg-[var(--foreground)]/30`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            layoutId spring — stiffness 520, damping 32
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
