"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two independent timing curves running side by side on the same click. The
 * panel's `height` is a spring — `{ stiffness: 500, damping: 40 }` — slightly
 * underdamped, so it overshoots a hair past full height before settling; its
 * `opacity` rides a plain `duration: 0.2` alongside. The chevron isn't part
 * of that transition at all — it's CSS, `[transition:transform_250ms_ease]`
 * triggered by `group-data-[open=true]`, a flat ease with no spring math.
 */
const CSS = `
@keyframes ah-panel {
  0%, 6%    { transform: scaleY(0); opacity: 0; }
  22%       { transform: scaleY(1.05); opacity: 1; }
  30%, 68%  { transform: scaleY(1); opacity: 1; }
  86%, 100% { transform: scaleY(0); opacity: 0; }
}
@keyframes ah-chevron {
  0%, 6%    { transform: rotate(0deg); }
  26%, 68%  { transform: rotate(180deg); }
  92%, 100% { transform: rotate(0deg); }
}
.ah-panel   { transform-origin: top; animation: ah-panel 3.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.ah-chevron { animation: ah-chevron 3.4s ease infinite; }
.ah-static .ah-panel   { animation: none; transform: scaleY(1); opacity: 1; }
.ah-static .ah-chevron { animation: none; transform: rotate(180deg); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "panel" | "chevron";
}[] = [
  {
    name: "Panel",
    desc: "height + opacity, spring stiffness 500 · damping 40",
    kind: "panel",
  },
  {
    name: "Chevron",
    desc: "transform: rotate, plain 250ms ease — no spring",
    kind: "chevron",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "chevron") {
    return (
      <span className="size-2 border-[var(--foreground)]/60 border-r-2 border-b-2 [transform:rotate(45deg)]" />
    );
  }
  return (
    <span className="h-3 w-7 rounded-md bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
  );
}

export function AccordionHeight() {
  return (
    <ScrollScene label="The motion" note="one click · two timing curves">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-9 ${
            reduced ? "ah-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="w-full overflow-hidden rounded-xl border border-border">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <span className="h-2 w-1/3 rounded-full bg-[var(--muted)]" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="ah-chevron shrink-0 text-[var(--foreground)]/60"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="ah-panel px-4 pb-3.5">
              <span className="block h-2 w-[70%] rounded-full bg-[var(--foreground)]/30" />
              <span className="mt-1.5 block h-2 w-[48%] rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              'height: { type: "spring", stiffness: 500, damping: 40 } · opacity: 0.2s'
            }
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
