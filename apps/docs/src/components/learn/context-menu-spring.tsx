"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The open is anchored, not centered. The menu mounts at `position: fixed` with
 * `left/top` set to the exact `clientX/clientY` of the right-click, and its
 * `transformOrigin` pinned to the corner nearest the cursor. A spring
 * (`stiffness 520, damping 32`) runs `scale 0.9 → 1` + `opacity 0 → 1`, so it
 * looks like the panel grows straight out of the pointer.
 */
const ROWS = 5;

const CSS = `
@keyframes cms-open {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes cms-ping {
  0%   { opacity: 0.9; transform: scale(0.4); }
  100% { opacity: 0;   transform: scale(1.8); }
}
@keyframes cms-row { from { opacity: 0; } to { opacity: 1; } }
.cms-menu { opacity: 0; transform-origin: left top; animation: cms-open 460ms cubic-bezier(0.34,1.56,0.64,1) both; }
.cms-ping { animation: cms-ping 700ms ease-out both; }
.cms-row  { opacity: 0; animation: cms-row 300ms ease var(--d) both; }
.cms-static .cms-menu { opacity: 1; animation: none; transform: none; }
.cms-static .cms-ping { display: none; }
.cms-static .cms-row  { opacity: 1; animation: none; }
`;

export function ContextMenuSpring() {
  return (
    <ScrollScene label="Open" note="springs from the cursor point">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[440px] flex-col items-center gap-8 ${reduced ? "cms-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative h-52 w-full rounded-xl border border-fd-border border-dashed bg-[var(--muted)]/40"
          >
            {/* Cursor point — origin of the open. */}
            <div className="absolute top-9 left-16">
              <span className="cms-ping absolute inset-0 size-3 rounded-full bg-[var(--foreground)]/40" />
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="var(--foreground)"
                className="-translate-x-[1px] -translate-y-[1px] relative"
              >
                <path d="M1 1l5.5 13 2-5.5 5.5-2z" />
              </svg>

              {/* Menu — grows out of the cursor corner. */}
              <div className="cms-menu absolute top-2 left-2 w-44 rounded-xl border border-border bg-background p-1 shadow-2xl">
                {Array.from({ length: ROWS }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                    key={i}
                    className="cms-row flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                    style={{ "--d": `${120 + i * 45}ms` } as CSSProperties}
                  >
                    <span className="size-3.5 shrink-0 rounded-[5px] bg-[var(--foreground)]/25" />
                    <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
                  </div>
                ))}
              </div>
            </div>

            {/* Origin marker at the top-left corner of the menu. */}
            <span className="absolute top-[52px] left-[76px] size-1.5 rounded-full bg-[var(--foreground)]/60 ring-2 ring-[var(--card)]" />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            left: clientX · top: clientY · transformOrigin: left top · spring
            520/32
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
