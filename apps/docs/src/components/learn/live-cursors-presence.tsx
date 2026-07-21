"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `LiveCursors` maps `cursors` inside a single `AnimatePresence` — every
 * flag is keyed by `cursor.id`, so React's own reconciliation is what
 * triggers the entrance and exit. Two flags mount once and stay; the third
 * loops through leaving and rejoining, the way a peer's cursor disappears
 * when their tab loses focus and reappears when they come back.
 */
const CSS = `
@keyframes lcp-in {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes lcp-cycle {
  0%, 6%    { opacity: 0; transform: scale(0.5); }
  18%, 66%  { opacity: 1; transform: scale(1); }
  78%, 100% { opacity: 0; transform: scale(0.5); }
}
.lcp-cursor { opacity: 0; animation: lcp-in 260ms cubic-bezier(0.3,0.7,0.4,1) var(--d) both; }
.lcp-toggle { animation: lcp-cycle 4.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.lcp-static .lcp-cursor { opacity: 1; animation: none; transform: none; }
.lcp-static .lcp-toggle { opacity: 1; animation: none; transform: none; }
`;

const CURSORS = [
  { id: "a", top: "22%", left: "18%", delay: "0ms" },
  { id: "b", top: "58%", left: "62%", delay: "90ms" },
];

const LEGEND = [
  {
    name: "Enter",
    desc: "opacity 0 → 1, scale 0.5 → 1, 150ms",
    kind: "enter" as const,
  },
  {
    name: "Exit",
    desc: "the mirror transition, then unmounts — no manual timer",
    kind: "exit" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "exit") {
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-[var(--foreground)]/40 shadow-sm ring-1 ring-fd-border ring-inset">
        <span className="size-1.5 rounded-full bg-[var(--background)]/80" />
      </span>
    );
  }
  return (
    <span className="flex size-4 items-center justify-center rounded-full bg-[var(--foreground)]/70 shadow-sm ring-1 ring-fd-border ring-inset">
      <span className="size-1.5 rounded-full bg-[var(--background)]" />
    </span>
  );
}

export function LiveCursorsPresence() {
  return (
    <ScrollScene
      label="Enter / exit"
      note="keyed by cursor.id, not a manual toggle"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "lcp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative h-52 w-full overflow-hidden rounded-xl bg-[var(--muted)]/40"
          >
            {CURSORS.map((c) => (
              <span
                key={c.id}
                className="lcp-cursor absolute flex size-6 items-center justify-center rounded-full bg-[var(--foreground)]/70 shadow-sm"
                style={
                  {
                    top: c.top,
                    left: c.left,
                    "--d": c.delay,
                  } as CSSProperties
                }
              >
                <span className="size-1.5 rounded-full bg-[var(--background)]" />
              </span>
            ))}

            <span
              className="lcp-toggle absolute flex size-6 items-center justify-center rounded-full bg-[var(--foreground)]/70 shadow-sm"
              style={{ top: "40%", left: "40%" }}
            >
              <span className="size-1.5 rounded-full bg-[var(--background)]" />
            </span>
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
