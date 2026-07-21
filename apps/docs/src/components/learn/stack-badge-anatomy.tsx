"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * A chip is a `rounded-full` flex row, not layered pieces: an icon token,
 * then a label token, inside a `bg-muted` (soft) or hairline `border-border`
 * (outline) pill. Four chips shown here to read as a wall, same as the
 * component's `flex flex-wrap` row.
 */
const COUNT = 4;

const CSS = `
@keyframes sba-chip { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.sba-chip { opacity: 0; animation: sba-chip 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.sba-static .sba-chip { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "icon" | "label";
}[] = [
  {
    name: "Icon token",
    desc: "24×24 mono SVG, currentColor",
    kind: "icon",
  },
  {
    name: "Label token",
    desc: "font-medium text, same row",
    kind: "label",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "icon") {
    return (
      <span className="size-3 rounded-[5px] bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
  );
}

export function StackBadgeAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one pill · icon token + label token">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex flex-wrap items-center justify-center gap-2.5 ${reduced ? "sba-static" : ""}`}
          >
            {Array.from({ length: COUNT }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed chip row
                key={i}
                className="sba-chip inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--muted)] px-3 py-2"
                style={{ "--d": `${i * 40}ms` } as CSSProperties}
              >
                <span className="size-[18px] shrink-0 rounded-[5px] bg-[var(--foreground)]/50" />
                <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/25" />
              </span>
            ))}
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
