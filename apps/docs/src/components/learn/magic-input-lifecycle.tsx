"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The submit lifecycle, looped: idle → loading → success. The same edge/shadow
 * layer that draws the 3D depth becomes the progress bar — here a fill along
 * the bottom growing via `scaleX`, then a green success sweep. The submit icon
 * cross-fades arrow → ring → check with a scale + rotate, exactly like the four
 * stacked icons in the component. Green is the only real color; it's semantic.
 */
const GREEN = "oklch(0.65 0.17 150)";

const CSS = `
@keyframes mlc-fill {
  0%, 14%   { transform: scaleX(0); }
  56%, 66%  { transform: scaleX(1); }
  100%      { transform: scaleX(1); }
}
@keyframes mlc-fill-fade {
  0%, 14%   { opacity: 0; }
  20%, 66%  { opacity: 1; }
  72%, 100% { opacity: 0; }
}
@keyframes mlc-success {
  0%, 66%   { opacity: 0; }
  74%, 88%  { opacity: 1; }
  96%, 100% { opacity: 0; }
}
@keyframes mlc-arrow {
  0%, 12%   { opacity: 1; transform: scale(1) rotate(0); }
  20%, 88%  { opacity: 0; transform: scale(0.4) rotate(-35deg); }
  96%, 100% { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes mlc-ring {
  0%, 14%   { opacity: 0; transform: scale(0.4) rotate(-35deg); }
  22%, 62%  { opacity: 1; transform: scale(1) rotate(0); }
  70%, 100% { opacity: 0; transform: scale(0.4) rotate(-35deg); }
}
@keyframes mlc-check {
  0%, 64%   { opacity: 0; transform: scale(0.4) rotate(-35deg); }
  74%, 88%  { opacity: 1; transform: scale(1) rotate(0); }
  94%, 100% { opacity: 0; transform: scale(0.4) rotate(-35deg); }
}
@keyframes mlc-spin { to { transform: rotate(360deg); } }
.mlc-fill    { animation: mlc-fill 4.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.mlc-ff      { animation: mlc-fill-fade 4.4s linear infinite; }
.mlc-success { animation: mlc-success 4.4s ease infinite; }
.mlc-arrow   { animation: mlc-arrow 4.4s ease infinite; }
.mlc-ring    { animation: mlc-ring 4.4s ease infinite; }
.mlc-check   { animation: mlc-check 4.4s ease infinite; }
.mlc-spin    { animation: mlc-spin 0.9s linear infinite; transform-origin: center; }
.mlc-static .mlc-fill    { animation: none; transform: scaleX(1); }
.mlc-static .mlc-ff      { animation: none; opacity: 0; }
.mlc-static .mlc-success { animation: none; opacity: 1; }
.mlc-static .mlc-arrow   { animation: none; opacity: 0; }
.mlc-static .mlc-ring    { animation: none; opacity: 0; }
.mlc-static .mlc-check   { animation: none; opacity: 1; transform: none; }
.mlc-static .mlc-spin    { animation: none; }
`;

const PHASES: { label: string; note: string }[] = [
  { label: "idle", note: "arrow" },
  { label: "loading", note: "bar fills · ring spins" },
  { label: "success", note: "green sweep · check" },
];

export function MagicInputLifecycle() {
  return (
    <ScrollScene
      label="Submit lifecycle"
      note="the edge doubles as the progress bar"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "mlc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative flex h-[56px] w-[260px] items-center overflow-hidden rounded-xl border border-border bg-[var(--card)] pr-14 pl-4">
            <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />

            {/* Progress fill along the bottom edge — grows via scaleX. */}
            <span className="mlc-ff pointer-events-none absolute inset-x-0 bottom-0 h-[3px]">
              <span className="mlc-fill block h-full origin-left bg-[var(--foreground)]/60" />
            </span>
            {/* Success sweep — green, semantic. */}
            <span
              className="mlc-success pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
              style={{ backgroundColor: GREEN }}
            />

            {/* Submit button — morphing icon stack. */}
            <span className="absolute inset-y-[6px] right-[6px] grid aspect-square place-items-center rounded-lg bg-primary text-[18px] text-primary-foreground">
              <span className="mlc-arrow col-start-1 row-start-1 grid place-items-center">
                <ArrowIcon />
              </span>
              <span className="mlc-ring col-start-1 row-start-1 grid place-items-center">
                <span className="mlc-spin grid place-items-center">
                  <RingIcon />
                </span>
              </span>
              <span
                className="mlc-check col-start-1 row-start-1 grid place-items-center"
                style={{ color: GREEN }}
              >
                <span className="grid size-full place-items-center rounded-lg bg-white/90">
                  <CheckIcon />
                </span>
              </span>
            </span>
          </div>

          <dl className="grid grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={p.label}>{p.note}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const RingIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
      strokeWidth={2.5}
    />
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeDasharray="16 60"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="0.8em"
    height="0.8em"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
