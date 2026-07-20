"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The panel never animates `top` or `height` — it's pinned in place with
 * `inset-x-0 bottom-0` and slides purely on `transform`. Hidden is
 * `y: "100%"` (fully below its own edge), shown is `y: 0`, and the same
 * spring — `{ damping: 32, stiffness: 320, mass: 0.9 }` — drives both the
 * open and the close. `side="right"` is the identical spring on `x` instead.
 */
const CSS = `
@keyframes dws-panel {
  0%, 8%    { transform: translateY(100%); }
  32%, 76%  { transform: translateY(0%); }
  96%, 100% { transform: translateY(100%); }
}
@keyframes dws-backdrop {
  0%, 8%    { opacity: 0; }
  28%, 80%  { opacity: 1; }
  100%      { opacity: 0; }
}
.dws-panel    { animation: dws-panel 4.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.dws-backdrop { animation: dws-backdrop 4.6s ease infinite; }
.dws-static .dws-panel    { animation: none; transform: translateY(0%); }
.dws-static .dws-backdrop { animation: none; opacity: 1; }
`;

export function DrawerSpring() {
  return (
    <ScrollScene
      label="Enter / exit"
      note="damping 32 · stiffness 320 · mass 0.9"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "dws-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-56 w-72 overflow-hidden rounded-xl border border-fd-border border-dashed bg-[var(--foreground)]/[0.04]">
            <span className="dws-backdrop absolute inset-0 bg-[var(--foreground)]/[0.06]" />
            <div className="dws-panel absolute inset-x-0 bottom-0 h-40 rounded-t-2xl border-t border-border bg-card p-4 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--muted-foreground)]/40" />
              <div className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              'initial/exit: y "100%" · animate: y 0 · transform-only, no top or height'
            }
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
