"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * When a facet gains a selection: plus scales out, summary slides in on x +
 * opacity, clear pops on scale — all compositor-only (matches the source).
 */
const CheckIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const CSS = `
@keyframes fbs-plus {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.25); }
}
@keyframes fbs-reveal {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes fbs-pop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}
.fbs-plus   { animation: fbs-plus 280ms cubic-bezier(0.3,0.7,0.4,1) both; }
.fbs-reveal { opacity: 0; animation: fbs-reveal 380ms cubic-bezier(0.3,0.7,0.4,1.2) 80ms both; }
.fbs-pop    { opacity: 0; animation: fbs-pop 460ms cubic-bezier(0.3,0.7,0.4,1.5) 120ms both; }
.fbs-static .fbs-plus   { opacity: 0; animation: none; }
.fbs-static .fbs-reveal { opacity: 1; animation: none; transform: none; }
.fbs-static .fbs-pop    { opacity: 1; animation: none; transform: none; }
`;

/** A stand-in label bar — no real copy lives on the diagram pill. */
function LabelBar({ w = "w-12", tone = 40 }: { w?: string; tone?: number }) {
  return (
    <span
      className={`h-2 ${w} rounded-full`}
      style={{ backgroundColor: "var(--foreground)", opacity: tone / 100 }}
    />
  );
}

export function FilterBarSpring() {
  return (
    <ScrollScene
      label="Selection"
      note="plus scales out · summary slides in · clear pops"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[460px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-center ${reduced ? "fbs-static" : ""}`}
          >
            <div className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-[var(--muted)] pr-1 pl-3">
              <span className="fbs-plus flex size-3.5 items-center justify-center text-muted-foreground">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
              <LabelBar w="w-10" tone={55} />
              <span className="fbs-reveal flex items-center gap-1.5">
                <span className="h-3.5 w-px bg-[var(--foreground)]/25" />
                <LabelBar w="w-9" tone={45} />
              </span>
              <span className="fbs-pop ml-1 flex size-6 items-center justify-center rounded-full text-muted-foreground">
                {CheckIcon}
              </span>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            opacity + translateX / scale · shared spring · no width tween
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
