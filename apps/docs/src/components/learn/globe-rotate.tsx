"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The `rAF` tick does one of two things every frame: idle, it nudges
 * `phi += 0.005`; held, it instead reads `pointerMovement.current / 200` and
 * lets the pointer set the offset directly. Same tick, same `globe.update`
 * call — only the source of the delta changes.
 *
 * One scrolling longitude texture (seamless 40px tile) — no static meridian
 * overlay fighting it. The grab-hand presses onto the surface, then skates
 * horizontally while the texture accelerates, so the drag feels coupled to
 * the spin instead of floating above it.
 */
const CSS = `
/*
 * Shared 7s clock. Hand drags right (−12 → +28). The longitude texture
 * must travel the *same* way — increasing background-position-x slides the
 * pattern right with the grab (decreasing it looked opposite).
 * During drag (40%→64%) the surface covers ~3× the hand travel so the
 * globe clearly responds without racing.
 * Tile period is 20px; total loop delta (+120px) stays seamless.
 */
@keyframes glr-spin {
  0%       { background-position-x: 0px; }
  40%      { background-position-x: 20px; }
  64%      { background-position-x: 140px; }
  100%     { background-position-x: 160px; }
}
.glr-surface { animation: glr-spin 7s linear infinite; }

@keyframes glr-hand {
  0%, 18% {
    opacity: 0;
    transform: translate(-12px, -28px) scale(1);
  }
  28% {
    opacity: 1;
    transform: translate(-12px, 0) scale(1);
  }
  36%, 40% {
    opacity: 1;
    transform: translate(-12px, 2px) scale(0.92);
  }
  /* Drag window mirrors glr-spin 40%→64% */
  64% {
    opacity: 1;
    transform: translate(28px, 2px) scale(0.92);
  }
  74% {
    opacity: 0.85;
    transform: translate(32px, -6px) scale(1);
  }
  84%, 100% {
    opacity: 0;
    transform: translate(32px, -24px) scale(1);
  }
}
.glr-hand { animation: glr-hand 7s linear infinite; }

.glr-static .glr-surface { animation: none; background-position-x: 0px; }
.glr-static .glr-hand { animation: none; opacity: 0; }
`;

const LEGEND = [
  {
    name: "Idle",
    desc: "phi += 0.005 every frame, nobody's touching it",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Drag",
    desc: "pointerMovement / 200 drives phi instead",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "Phi",
    desc: "the one angle globe.update() sets, every frame",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

function GrabHand({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 11.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2" />
      <path d="M10 9.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export function GlobeRotate() {
  return (
    <ScrollScene label="The motion" note="idle drift vs. pointer-driven phi">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "glr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative size-44">
            <div className="relative size-full overflow-hidden rounded-full shadow-inner [background:radial-gradient(circle_at_35%_28%,var(--card),var(--muted)_70%)]">
              <div
                aria-hidden="true"
                className="glr-surface absolute inset-y-0 left-1/2 w-[560px] -translate-x-1/2 [background-image:repeating-linear-gradient(90deg,transparent_0px_18px,var(--foreground)_18px_20px)] opacity-[0.16]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full [background:radial-gradient(circle_at_68%_78%,black,transparent_55%)] opacity-45"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-[var(--foreground)]/10 ring-inset"
              />
            </div>

            <span
              aria-hidden="true"
              className="glr-hand pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 text-[var(--foreground)] drop-shadow-sm"
            >
              <GrabHand />
            </span>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
