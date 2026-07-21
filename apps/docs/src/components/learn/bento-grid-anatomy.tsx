"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `BentoGrid` is a plain CSS grid (`grid-cols-3`, `auto-rows-[minmax(11rem,auto)]`)
 * — the "bento" look comes entirely from `colSpan`/`rowSpan` on individual
 * `BentoCard`s, placed by the browser's normal row-major auto-flow. No masonry
 * library, no measured layout pass.
 */
const CSS = `
@keyframes bga-in { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
.bga-cell { opacity: 0; animation: bga-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.bga-static .bga-cell { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "col" | "row" | "cell";
}[] = [
  {
    name: "colSpan cell",
    desc: "spans 2 of 3 grid columns",
    kind: "col",
  },
  {
    name: "rowSpan cell",
    desc: "auto-flow drops it into the next open column, spanning 2 rows",
    kind: "row",
  },
  {
    name: "default cell",
    desc: "1×1, fills whatever's left",
    kind: "cell",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "col") {
    return (
      <span className="h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] shadow-sm" />
    );
  }
  if (kind === "row") {
    return (
      <span className="h-5 w-3 rounded-md border border-fd-border bg-[var(--muted)]" />
    );
  }
  return (
    <span className="size-3.5 rounded-md border border-fd-border bg-[var(--card)] shadow-sm" />
  );
}

export function BentoGridAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one grid, spans do the rest">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 gap-3 [grid-auto-rows:60px] ${reduced ? "bga-static" : ""}`}
          >
            <div className="bga-cell col-span-2 rounded-xl border border-fd-border bg-[var(--card)] shadow-sm" />
            <div className="bga-cell col-span-1 row-span-2 rounded-xl border border-fd-border bg-[var(--muted)]" />
            <div className="bga-cell col-span-1 rounded-xl border border-fd-border bg-[var(--card)] shadow-sm" />
            <div className="bga-cell col-span-1 rounded-xl border border-fd-border bg-[var(--card)] shadow-sm" />
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
