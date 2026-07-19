"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The bar living behind the folded face, two ways. Source drives determinate
 * fill by transitioning `width` to a CSS var, and the indeterminate sweep by
 * translating a fixed-width segment. This diagram fills with `scaleX` from a
 * left origin instead of `width` — same read, compositor-only.
 */

const CSS = `
@keyframes fp-fill {
  0%, 8%   { transform: scaleX(0); }
  45%, 60% { transform: scaleX(0.6); }
  100%     { transform: scaleX(0); }
}
@keyframes fp-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(250%); }
}
.fp-determinate .fp-fill { animation: fp-fill 2.4s cubic-bezier(0.3, 0.7, 0.4, 1) infinite; }
.fp-indeterminate .fp-fill { animation: fp-sweep 1.2s ease-in-out infinite; }
.fp-static .fp-determinate .fp-fill { animation: none; transform: scaleX(0.6); }
.fp-static .fp-indeterminate .fp-fill { animation: none; transform: translateX(60%); }
`;

export function FoldProgress() {
  return (
    <ScrollScene
      label="The bar"
      note="determinate fill vs. indeterminate sweep"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col gap-8 ${reduced ? "fp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex flex-col gap-2.5">
            <div className="fp-determinate relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="fp-fill absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/70" />
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              determinate — scaleX(progress / 100)
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="fp-indeterminate relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="fp-fill absolute inset-y-0 left-0 w-2/5 rounded-full bg-[var(--foreground)]/70" />
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              indeterminate — translateX(-100% → 250%)
            </p>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                Determinate
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                a `progress` prop is passed
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                Indeterminate
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                no `progress` — fixed segment sweeps
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
