"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of the Tab Bar: a single rounded `<nav>` pill holds N `<button>` tabs.
 * Every tab carries an icon; the active one also carries the sliding blob
 * (`bg-primary`, rendered only under the current tab) and a revealed label.
 * `labelsOnActiveOnly` keeps the inactive tabs icon-only, so the row stays tight.
 */
const TABS = 4;
const ACTIVE = 0;
const BADGE_ON = 2;

const CSS = `
@keyframes tb-a-tab {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes tb-a-blob {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: none; }
}
@keyframes tb-a-label {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}
.tb-a-tab   { opacity: 0; animation: tb-a-tab 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.tb-a-blob  { opacity: 0; animation: tb-a-blob 520ms cubic-bezier(0.34,1.4,0.5,1) 360ms both; }
.tb-a-label { opacity: 0; transform-origin: left center; animation: tb-a-label 460ms cubic-bezier(0.34,1.4,0.5,1) 520ms both; }
.tb-a-static .tb-a-tab   { opacity: 1; animation: none; transform: none; }
.tb-a-static .tb-a-blob  { opacity: 1; animation: none; transform: none; }
.tb-a-static .tb-a-label { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "blob" | "icon" | "label";
}[] = [
  {
    name: "Blob",
    desc: "one foreground pill, only under the active tab",
    kind: "blob",
  },
  {
    name: "Icon",
    desc: "always shown; pops on selection",
    kind: "icon",
  },
  {
    name: "Label",
    desc: "revealed on the active tab only",
    kind: "label",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "blob") {
    return (
      <span className="h-3 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "icon") {
    return (
      <span className="size-3 rounded-full bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--background)]/80 ring-1 ring-fd-border ring-inset" />
  );
}

export function TabBarAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one pill · one blob · icons + label">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[460px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`inline-flex items-center gap-1 rounded-full border border-fd-border bg-[var(--card)] p-1.5 shadow-lg ${
              reduced ? "tb-a-static" : ""
            }`}
          >
            {Array.from({ length: TABS }).map((_, i) => {
              const active = i === ACTIVE;
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length tab row
                  key={i}
                  className="tb-a-tab relative flex h-11 items-center justify-center gap-2 rounded-full px-4"
                  style={{ "--d": `${i * 80}ms` } as CSSProperties}
                >
                  {active && (
                    <span className="tb-a-blob absolute inset-0 rounded-full bg-[var(--foreground)]" />
                  )}
                  <span className="relative flex size-5 items-center justify-center">
                    <span
                      className={`size-4 rounded-full ${
                        active
                          ? "bg-[var(--background)]"
                          : "bg-[var(--foreground)]/40"
                      }`}
                    />
                    {i === BADGE_ON && (
                      <span className="-right-1.5 -top-1.5 absolute size-2.5 rounded-full bg-[var(--destructive)] ring-2 ring-[var(--card)]" />
                    )}
                  </span>
                  {active && (
                    <span className="tb-a-label relative h-2 w-12 rounded-full bg-[var(--background)]/80" />
                  )}
                </div>
              );
            })}
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
