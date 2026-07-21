"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every suggestion is a `motion.button` with the same enter — `initial={{
 * opacity: 0, y: 8 }}`, `animate={{ opacity: 1, y: 0 }}` — on a `{
 * type: "spring", stiffness: 320, damping: 32, mass: 0.9 }` transition whose
 * only per-item variable is `delay: index * 0.05`. Four items, four delays:
 * 0, 50, 100, 150ms — same curve, same distance, offset in time. Looped here
 * with `animation-iteration-count: infinite alternate`, so the relative
 * 50ms gap between cards holds on every pass, not just the first.
 */
const CSS = `
@keyframes pss-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.pss-card { opacity: 0; animation: pss-rise 900ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) infinite alternate; }
.pss-static .pss-card { opacity: 1; animation: none; transform: none; }
`;

const ITEMS = [0, 1, 2, 3];

export function PromptSuggestionsStagger() {
  return (
    <ScrollScene
      label="The motion"
      note="delay: index * 0.05 · spring 320/32/0.9"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[340px] flex-col gap-9 ${reduced ? "pss-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="grid grid-cols-2 gap-2">
            {ITEMS.map((i) => (
              <div
                key={i}
                className="pss-card flex flex-col gap-1.5 rounded-xl border border-border bg-[var(--card)] p-3"
                style={{ "--d": `${i * 50}ms` } as CSSProperties}
              >
                <span className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/35" />
                <span className="h-2 w-3/5 rounded-full bg-[var(--foreground)]/18" />
              </div>
            ))}
          </div>

          <dl className="grid grid-cols-4 gap-x-4 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {ITEMS.map((i) => (
              <dt key={i} className="text-fd-foreground">
                #{i}
              </dt>
            ))}
            {ITEMS.map((i) => (
              <dd key={i}>{i * 50}ms</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
