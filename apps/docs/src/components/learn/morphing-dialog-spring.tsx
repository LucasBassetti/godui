"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One box, not two. Its resting transform (`translate(0,0) scale(1,1)`) is
 * the content panel's geometry; the "trigger" state is the same box shrunk
 * and shifted toward the corner it grew from. That's the whole trick behind
 * `layoutId` — Framer just interpolates one element's box model between two
 * measured rects with `MORPH_SPRING` (stiffness 320 / damping 32 / mass 0.9).
 * The backdrop and close button ride along on their own opacity timelines.
 */
const CSS = `
@keyframes mds-box {
  0%, 8%    { transform: translate(-88px, 62px) scale(0.48, 0.34); }
  30%, 68%  { transform: translate(0px, 0px) scale(1, 1); }
  92%, 100% { transform: translate(-88px, 62px) scale(0.48, 0.34); }
}
@keyframes mds-backdrop {
  0%, 8%    { opacity: 0; }
  26%, 70%  { opacity: 1; }
  92%, 100% { opacity: 0; }
}
@keyframes mds-close {
  0%, 32%   { opacity: 0; }
  42%, 60%  { opacity: 1; }
  76%, 100% { opacity: 0; }
}
.mds-box      { animation: mds-box 4.6s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.mds-backdrop { animation: mds-backdrop 4.6s ease-in-out infinite; }
.mds-close    { animation: mds-close 4.6s ease infinite; }
.mds-static .mds-box      { animation: none; transform: none; }
.mds-static .mds-backdrop { animation: none; opacity: 1; }
.mds-static .mds-close    { animation: none; opacity: 1; }
`;

const PHASES: { label: string; value: string }[] = [
  { label: "spring", value: "320 / 32 / 0.9" },
  { label: "backdrop", value: "opacity, 0.2s" },
  { label: "close delay", value: "0.1s" },
];

export function MorphingDialogSpring() {
  return (
    <ScrollScene label="The morph spring" note="one box, interpolated">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "mds-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[220px] w-[300px] items-center justify-center">
            <div className="mds-backdrop absolute inset-0 rounded-2xl bg-black/50" />
            <div className="mds-box relative flex h-40 w-64 flex-col gap-2 rounded-2xl border border-border bg-[var(--card)] p-3 shadow-xl">
              <span className="mds-close absolute top-2.5 right-2.5 size-4 rounded-full bg-background/80" />
              <div className="h-14 w-full rounded-lg bg-[var(--muted)]" />
              <span className="h-2 w-3/4 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-1/2 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={p.label}>{p.value}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
