"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The listbox is a single `AnimatePresence` child that springs out of the
 * field (`opacity 0 → 1`, `scale 0.97 → 1`, `y -4 → 0`, stiffness 520 /
 * damping 32), and inside it every `<li>` runs its own tiny entrance —
 * `y 4 → 0` with `delay: i * 0.02s`. The rows don't wait on the popover;
 * they cascade the instant it mounts, so the whole thing reads as one motion.
 */
const ROWS = 6;

const CSS = `
@keyframes cs-pop {
  from { opacity: 0; transform: translateY(-6px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}
@keyframes cs-row {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: none; }
}
.cs-pop { opacity: 0; transform-origin: top center; animation: cs-pop 420ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.cs-row { opacity: 0; animation: cs-row 320ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cs-static .cs-pop,
.cs-static .cs-row { opacity: 1; animation: none; transform: none; }
`;

export function ComboboxStagger() {
  return (
    <ScrollScene label="Reveal" note="spring popover · per-row stagger">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full max-w-[288px] flex-col ${reduced ? "cs-static" : ""}`}
          >
            {/* Field — stays put; the listbox grows from its bottom edge. */}
            <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-[var(--card)] px-3.5">
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
            </div>

            {/* Listbox — one AnimatePresence child, origin-top. */}
            <div className="cs-pop mt-2 rounded-xl border border-border bg-[var(--card)] p-1 shadow-xl">
              {Array.from({ length: ROWS }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                  key={i}
                  className="cs-row flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ "--d": `${200 + i * 90}ms` } as CSSProperties}
                >
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span
                      className="h-2 rounded-full bg-[var(--foreground)]/30"
                      style={{ width: `${56 + ((i * 11) % 32)}%` }}
                    />
                    <span
                      className="h-1.5 rounded-full bg-[var(--foreground)]/15"
                      style={{ width: `${32 + ((i * 19) % 22)}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            popover: spring stiffness 520 · damping 32 — rows: delay i × 0.02s
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
