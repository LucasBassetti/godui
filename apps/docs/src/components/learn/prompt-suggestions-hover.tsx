"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Hover only ever moves two things: the item's own `transform` — chips lift
 * `-translate-y-px` (1px), cards lift `-translate-y-0.5` (2px) — and a
 * trailing arrow that's already in the DOM at `opacity-0 -translate-x-1`,
 * revealed with `group-hover:opacity-100 group-hover:translate-x-0`. The
 * arrow's box never changes size; it's just invisible until hovered. The
 * card's shadow is drawn as a separate blurred layer behind the face so the
 * lift stays transform/opacity-only instead of animating `box-shadow`
 * directly (what the real Tailwind `hover:shadow-md` does, since that swap
 * only ever runs on a single hovered item, not a scroll-triggered loop).
 */
const CSS = `
@keyframes psh-chip   { 0%, 30% { transform: translateY(0); } 50%, 80% { transform: translateY(-1px); } 100% { transform: translateY(0); } }
@keyframes psh-face   { 0%, 30% { transform: translateY(0); } 50%, 80% { transform: translateY(-2px); } 100% { transform: translateY(0); } }
@keyframes psh-shadow { 0%, 30% { opacity: .22; transform: translateY(2px); } 50%, 80% { opacity: .5; transform: translateY(6px); } 100% { opacity: .22; transform: translateY(2px); } }
@keyframes psh-arrow  { 0%, 30% { opacity: 0; transform: translateX(-4px); } 50%, 80% { opacity: 1; transform: translateX(0); } 100% { opacity: 0; transform: translateX(-4px); } }
.psh-chip   { animation: psh-chip 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.psh-face   { animation: psh-face 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.psh-shadow { animation: psh-shadow 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.psh-arrow  { animation: psh-arrow 3.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.psh-static .psh-chip, .psh-static .psh-face { animation: none; transform: translateY(0); }
.psh-static .psh-shadow { animation: none; opacity: .22; transform: translateY(2px); }
.psh-static .psh-arrow { animation: none; opacity: 0; transform: translateX(-4px); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "chips" | "grid";
}[] = [
  {
    name: "Chip",
    desc: "translateY −1px only, no shadow, no arrow",
    kind: "chips",
  },
  {
    name: "Card",
    desc: "translateY −2px + shadow layer opacity .22→.5, arrow slides in",
    kind: "grid",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "grid") {
    return (
      <span className="h-4 w-5 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-2.5 w-7 rounded-full border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function PromptSuggestionsHover() {
  return (
    <ScrollScene label="Hover" note="transform + opacity only, looped">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "psh-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="grid w-full grid-cols-2 items-center gap-8"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="psh-chip inline-flex items-center rounded-full border border-border bg-[var(--card)] px-3 py-1.5">
                <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/35" />
              </span>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                chip
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative h-[64px] w-full">
                <span className="psh-shadow absolute inset-x-1 top-0 h-full rounded-xl bg-black blur-md" />
                <div className="psh-face absolute inset-0 flex items-center gap-2 rounded-xl border border-border bg-[var(--card)] p-3">
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/35" />
                    <span className="h-2 w-3/5 rounded-full bg-[var(--foreground)]/18" />
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="psh-arrow size-4 shrink-0 text-[var(--foreground)]/50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                card
              </p>
            </div>
          </div>

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
