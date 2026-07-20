"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Focus on what happens to a single tab when it becomes active: the icon
 * pops on a `scale: [1, 1.18, 1]` keyframe, and the label reveals. The real
 * component reveals the label with `width: 0 → auto` (a `motion.span` with
 * `layout`) — here it's faked as a compositor-only `scaleX` expand from the
 * left edge, same read, no layout thrash.
 */
const CSS = `
@keyframes tp-icon {
  0%, 30%, 100% { transform: scale(1); }
  15% { transform: scale(1.18); }
}
@keyframes tp-label {
  0%, 22% { opacity: 0; transform: scaleX(0); }
  40%, 100% { opacity: 1; transform: scaleX(1); }
}
.tp-icon  { animation: tp-icon 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.tp-label { transform-origin: left center; animation: tp-label 3.4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.tp-static .tp-icon  { animation: none; transform: none; }
.tp-static .tp-label { animation: none; opacity: 1; transform: none; }
`;

export function TabBarPop() {
  return (
    <ScrollScene label="Becoming active" note="icon pops · label expands">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${reduced ? "tp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative flex h-14 items-center gap-2 rounded-full bg-[var(--foreground)] px-5 shadow-lg"
          >
            <span className="tp-icon flex size-5 items-center justify-center">
              <span className="size-4 rounded-full bg-[var(--background)]" />
            </span>
            <span className="tp-label h-2 w-14 rounded-full bg-[var(--background)]/80" />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            real label uses width: 0 → auto (layout) — faked here as scaleX
            (transform)
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
