"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The shape of a Combobox: one real `<input role="combobox">` and, mounted
 * beneath it through `AnimatePresence`, a floating `role="listbox"` popover of
 * option rows. Every row is a label plus an optional description; the selected
 * row carries a check. The popover is portal-free — it's just an absolutely
 * positioned sibling with `origin-top`, so it grows out of the field.
 */
const ROWS = 5;

const CSS = `
@keyframes ca-field {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes ca-pop {
  from { opacity: 0; transform: translateY(-4px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
@keyframes ca-row { from { opacity: 0; } to { opacity: 1; } }
.ca-field { opacity: 0; animation: ca-field 360ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.ca-pop   { opacity: 0; transform-origin: top center; animation: ca-pop 440ms cubic-bezier(0.3,0.7,0.4,1.2) 240ms both; }
.ca-row   { opacity: 0; animation: ca-row 300ms ease var(--d) both; }
.ca-static .ca-field,
.ca-static .ca-pop,
.ca-static .ca-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "input" | "listbox" | "row";
}[] = [
  {
    name: "Input",
    desc: "role=combobox · aria-autocomplete=list",
    kind: "input",
  },
  {
    name: "Listbox popover",
    desc: "AnimatePresence sibling · origin-top",
    kind: "listbox",
  },
  {
    name: "Option row",
    desc: "label + description · check when selected",
    kind: "row",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "input" || kind === "listbox") {
    return (
      <span className="h-3.5 w-7 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
  );
}

export function ComboboxAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one input · a floating listbox">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full max-w-[288px] flex-col ${reduced ? "ca-static" : ""}`}
          >
            {/* Input (role=combobox) */}
            <div className="ca-field flex h-11 items-center gap-2 rounded-xl border border-border bg-[var(--card)] px-3.5">
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="ms-auto h-4 w-4 text-fd-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
              </svg>
            </div>

            {/* Listbox popover */}
            <div className="ca-pop mt-2 rounded-xl border border-border bg-[var(--card)] p-1 shadow-xl">
              {Array.from({ length: ROWS }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                  key={i}
                  className={`ca-row flex items-center gap-2 rounded-lg px-3 py-2 ${i === 1 ? "bg-[var(--muted)]" : ""}`}
                  style={{ "--d": `${420 + i * 60}ms` } as CSSProperties}
                >
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span
                      className="h-2 rounded-full bg-[var(--foreground)]/30"
                      style={{ width: `${58 + ((i * 13) % 30)}%` }}
                    />
                    <span
                      className="h-1.5 rounded-full bg-[var(--foreground)]/15"
                      style={{ width: `${34 + ((i * 17) % 24)}%` }}
                    />
                  </span>
                  {i === 1 && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-fd-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
