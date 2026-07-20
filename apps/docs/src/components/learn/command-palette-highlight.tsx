"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * There's one highlight element, not one per row. A `motion.span` with
 * `layoutId="command-active"` renders only inside whichever row is active;
 * when `activeIndex` changes (arrow keys, or `onMouseMove` re-targeting),
 * framer diffs the old box against the new one and springs that single node
 * between them — `{ stiffness: 500, damping: 35 }`, snappier than the panel's
 * own enter spring since it has to keep up with a held-down arrow key.
 */
const ROW_H = 44; // 44px row incl. padding, matches py-2.5 + text-sm

const CSS = `
@keyframes cph-slide {
  0%   { transform: translateY(0); }
  18%  { transform: translateY(${ROW_H}px); }
  36%  { transform: translateY(${ROW_H * 2}px); }
  54%  { transform: translateY(${ROW_H * 3}px); }
  72%  { transform: translateY(${ROW_H * 2}px); }
  86%  { transform: translateY(${ROW_H}px); }
  100% { transform: translateY(0); }
}
.cph-pill { animation: cph-slide 5.2s cubic-bezier(0.34, 1.4, 0.64, 1) infinite; }
.cph-static .cph-pill { animation: none; transform: none; }
`;

const ROWS = ["w-20", "w-16", "w-24", "w-14"];

export function CommandPaletteHighlight() {
  return (
    <ScrollScene
      label="Active row"
      note="layoutId binds one pill to the hot row"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[300px] flex-col items-center gap-9 ${reduced ? "cph-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative flex w-full flex-col gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-2xl"
          >
            {/* The one shared element — springs from row to row. */}
            <span
              aria-hidden="true"
              className="cph-pill pointer-events-none absolute top-1.5 right-1.5 left-1.5 h-[38px] rounded-lg bg-[var(--foreground)]/[0.07]"
            />
            {ROWS.map((w, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                key={i}
                className="relative flex h-[38px] items-center gap-2.5 px-3"
              >
                <span className="size-3.5 shrink-0 rounded-[5px] bg-[var(--foreground)]/25" />
                <span
                  className={`h-2 ${w} rounded-full bg-[var(--foreground)]/30`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              'layoutId="command-active" · spring 500/35 · re-targets on ArrowUp/Down or mouse move'
            }
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
