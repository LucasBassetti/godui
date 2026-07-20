"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The signature move: one highlight, not four. A single `motion.span` carries a
 * shared `layoutId` and renders only under whichever trigger is hot
 * (`hovered ?? active`). When the hot index changes, framer animates that one
 * element from its old box to the new one — so the pill *slides* between
 * triggers on a spring instead of cross-fading in place. Direction-aware for
 * free: it always travels from wherever it just was.
 */
const BARS = ["w-12", "w-16", "w-10", "w-14"];
const PITCH = 100; // 96px trigger + 4px gap

const CSS = `
@keyframes mh-slide {
  0%   { transform: translateX(0); }
  16%  { transform: translateX(${PITCH}px); }
  33%  { transform: translateX(${PITCH * 2}px); }
  50%  { transform: translateX(${PITCH * 3}px); }
  66%  { transform: translateX(${PITCH * 2}px); }
  83%  { transform: translateX(${PITCH}px); }
  100% { transform: translateX(0); }
}
.mh-pill { animation: mh-slide 5s cubic-bezier(0.34, 1.4, 0.64, 1) infinite; }
.mh-static .mh-pill { animation: none; transform: none; }
`;

export function MegaMenuHighlight() {
  return (
    <ScrollScene
      label="Shared highlight"
      note="one pill slides between triggers"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[520px] flex-col items-center gap-9 ${reduced ? "mh-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative inline-flex items-center gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 p-1"
          >
            {/* The one shared element — springs from trigger to trigger. */}
            <span
              aria-hidden="true"
              className="mh-pill pointer-events-none absolute top-1 left-1 h-9 w-24 rounded-lg bg-[var(--foreground)]/10 ring-1 ring-fd-border ring-inset"
            />
            {BARS.map((w, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed trigger row
                key={i}
                className="relative flex h-9 w-24 items-center justify-center"
              >
                <span
                  className={`h-2 ${w} rounded-full bg-[var(--foreground)]/30`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            layoutId binds the pill to one node; framer springs it (stiffness
            320, damping 32, mass 0.9) from box to box
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
