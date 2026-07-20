"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The bottom-nav silhouette: one blob, bound to whichever tab is active via a
 * shared `layoutId`. When the active tab changes, the blob springs from its
 * old slot to the new one. Faked here as a looping `translateX` sweep across
 * four equal-width icon slots.
 *
 * Pitch must match the layout: each slot is `size-11` (44px) with `gap-1`
 * (4px) between them → 48px. A larger pitch walked the blob clean off the
 * right edge of the bar.
 */
const TABS = 4;
const SLOT = 44; // size-11
const GAP = 4; // gap-1
const PITCH = SLOT + GAP;

const CSS = `
@keyframes tbb-slide {
  0%, 18%   { transform: translateX(0); }
  25%, 43%  { transform: translateX(${PITCH}px); }
  50%, 68%  { transform: translateX(${PITCH * 2}px); }
  75%, 93%  { transform: translateX(${PITCH * 3}px); }
  100%      { transform: translateX(0); }
}
@keyframes tbb-pop {
  0%, 18%, 100% { transform: scale(1); }
  4% { transform: scale(1.18); }
}
.tbb-blob { animation: tbb-slide 5.2s cubic-bezier(0.34, 1.2, 0.64, 1) infinite; }
.tbb-icon-0 { animation: tbb-pop 5.2s cubic-bezier(0.3,0.7,0.4,1.2) 0s infinite; }
.tbb-icon-1 { animation: tbb-pop 5.2s cubic-bezier(0.3,0.7,0.4,1.2) 1.3s infinite; }
.tbb-icon-2 { animation: tbb-pop 5.2s cubic-bezier(0.3,0.7,0.4,1.2) 2.6s infinite; }
.tbb-icon-3 { animation: tbb-pop 5.2s cubic-bezier(0.3,0.7,0.4,1.2) 3.9s infinite; }
.tbb-static .tbb-blob { animation: none; transform: none; }
.tbb-static [class*="tbb-icon-"] { animation: none; transform: none; }
`;

export function TabBarBlob() {
  return (
    <ScrollScene label="The motion" note="one blob · layoutId spring">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${reduced ? "tbb-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-fd-border bg-[var(--card)] p-1.5 shadow-lg"
          >
            <span
              aria-hidden="true"
              className="tbb-blob pointer-events-none absolute top-1.5 left-1.5 size-11 rounded-full bg-[var(--foreground)]"
            />
            {Array.from({ length: TABS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length tab row
                key={i}
                className="relative z-10 flex size-11 items-center justify-center"
              >
                <span
                  className={`tbb-icon-${i} size-4 rounded-full bg-[var(--foreground)]/35`}
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
