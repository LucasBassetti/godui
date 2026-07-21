"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Cell queue anatomy: each character slot is from → scrambling → resolved.
 * Token-bar slots stand in for glyphs; primary tint only on the unresolved
 * state (matches `text-primary` on live cells).
 */

const CSS = `
@keyframes tsa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tsa-col {
  opacity: 0;
  animation: tsa-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.tsa-static .tsa-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "From",
    desc: "frame < start — previous glyph, done",
    swatch:
      "size-2.5 rounded-sm bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Scrambling",
    desc: "start ≤ frame < end — random from pool",
    swatch: "size-2.5 rounded-sm bg-primary ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Resolved",
    desc: "frame ≥ end — locked to `to`",
    swatch:
      "size-2.5 rounded-sm bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset",
  },
];

const COLUMNS: {
  key: string;
  caption: string;
  delay: string;
  kind: "from" | "scrambling" | "resolved";
}[] = [
  { key: "from", caption: "from", delay: "0ms", kind: "from" },
  {
    key: "scrambling",
    caption: "scrambling",
    delay: "120ms",
    kind: "scrambling",
  },
  { key: "resolved", caption: "resolved", delay: "240ms", kind: "resolved" },
];

function slotClass(kind: "from" | "scrambling" | "resolved", i: number) {
  const base = "h-2.5 w-2.5 rounded-sm";
  if (kind === "from") return `${base} bg-[var(--foreground)]/25`;
  if (kind === "resolved") return `${base} bg-[var(--foreground)]/70`;
  // Mid-scramble: resolved left, active primary, still-from right
  if (i < 2) return `${base} bg-[var(--foreground)]/70`;
  if (i > 2) return `${base} bg-[var(--foreground)]/25`;
  return `${base} bg-primary`;
}

function SlotRow({ kind }: { kind: "from" | "scrambling" | "resolved" }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={slotClass(kind, i)} />
      ))}
    </div>
  );
}

export function TextScrambleAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="from · scrambling · resolved">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between ${reduced ? "tsa-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="tsa-col flex flex-col items-center gap-3"
                style={{ "--d": col.delay } as CSSProperties}
              >
                <div
                  className="flex h-[88px] w-[140px] items-center justify-center rounded-xl border border-[var(--foreground)]/15 bg-[var(--card)]"
                  aria-hidden="true"
                >
                  <SlotRow kind={col.kind} />
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.caption}
                </p>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
