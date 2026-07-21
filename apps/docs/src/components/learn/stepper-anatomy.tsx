"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Three states, derived from a single comparison — `i < active`, `i ===
 * active`, or neither — and one connector between each pair, filled only
 * when the step before it is done (`active > i`). No per-step config, no
 * variants object: the whole stepper is this one `stateFor` function.
 */
const CSS = `
@keyframes stpa-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stpa-node { opacity: 0; animation: stpa-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.stpa-static .stpa-node { opacity: 1; animation: none; transform: none; }
`;

function Circle({ tone, check }: { tone: string; check?: boolean }) {
  return (
    <div
      className={`grid size-9 shrink-0 place-items-center rounded-full border-2 text-sm font-medium ${tone}`}
    >
      {check ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        "•"
      )}
    </div>
  );
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="mt-[17px] h-0.5 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--muted)]">
      <span
        className={`block h-full origin-left rounded-full bg-[var(--foreground)]/70 ${
          filled ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Complete",
    desc: "border-fg, filled, check drawn",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "Active",
    desc: "border-fg, hollow, ring-4",
    swatch: "border-2 border-[var(--foreground)] bg-transparent",
  },
  {
    name: "Upcoming",
    desc: "border-border, muted text",
    swatch: "border-2 border-fd-border bg-transparent",
  },
];

export function StepperAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one stateFor(i), three tones">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-start ${reduced ? "stpa-static" : ""}`}
          >
            <div
              className="stpa-node flex flex-col items-center"
              style={{ animationDelay: "0ms" }}
            >
              <Circle
                tone="border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                check
              />
            </div>
            <Connector filled />
            <div
              className="stpa-node flex flex-col items-center"
              style={{ animationDelay: "90ms" }}
            >
              <Circle tone="border-[var(--foreground)] bg-[var(--card)] text-[var(--foreground)] ring-4 ring-[var(--foreground)]/15" />
            </div>
            <Connector filled={false} />
            <div
              className="stpa-node flex flex-col items-center"
              style={{ animationDelay: "180ms" }}
            >
              <Circle tone="border-fd-border bg-[var(--card)] text-fd-muted-foreground" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={`size-3 rounded-full ${item.swatch}`} />
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
