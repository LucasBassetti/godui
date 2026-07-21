"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `actions` is a flat array too — the toolbar is just a `role="toolbar"`
 * shell around a row of `motion.button`s. Nothing distinguishes an
 * "active" action structurally; it's the same square with `aria-pressed`
 * flipped and a filled fill instead of a transparent one.
 */
const CELLS = 4;
const ACTIVE_INDEX = 0;

const CSS = `
@keyframes fta-in { from { opacity: 0; transform: translateY(6px) scale(0.9); } to { opacity: 1; transform: none; } }
.fta-cell { opacity: 0; animation: fta-in 380ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.fta-static .fta-cell { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "shell" | "action" | "active";
}[] = [
  {
    name: "shell",
    desc: "backdrop-blur pill, role=toolbar",
    kind: "shell",
  },
  {
    name: "action",
    desc: "an idle motion.button",
    kind: "action",
  },
  {
    name: "active",
    desc: "aria-pressed, filled fill",
    kind: "active",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "shell") {
    return (
      <span className="h-3.5 w-7 rounded-lg bg-[var(--muted)]/90 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "active") {
    return (
      <span className="size-3.5 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3.5 rounded-lg bg-[var(--foreground)]/12 ring-1 ring-fd-border ring-inset" />
  );
}

export function FloatingToolbarAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one shell · a row of action buttons">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "fta-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="fta-cell inline-flex items-center gap-1 rounded-xl border border-border bg-[var(--muted)]/90 p-1 shadow-lg backdrop-blur-md"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            {Array.from({ length: CELLS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length action row
                key={i}
                className={`fta-cell size-9 rounded-lg ${
                  i === ACTIVE_INDEX
                    ? "bg-[var(--foreground)]"
                    : "bg-[var(--foreground)]/12"
                }`}
                style={{ "--d": `${90 + i * 60}ms` } as CSSProperties}
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[11px] text-fd-muted-foreground">
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
