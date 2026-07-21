"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every row is a `Reorder.Item` inside one `Reorder.Group`. The lift isn't
 * driven by Framer's `whileDrag` — it's a `data-dragging` attribute flipped
 * by plain `onDragStart`/`onDragEnd`, read by a CSS `scale` transition and a
 * sibling shadow overlay whose *opacity* fades in (compositor-only — no
 * `box-shadow` transition, which would repaint on the main thread every
 * frame).
 */
const CSS = `
@keyframes rla-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.rla-el { opacity: 0; animation: rla-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.rla-static .rla-el { opacity: 1; animation: none; transform: none; }
`;

const ROWS = [0, 1, 2, 3];
const LIFTED = 1;

const LEGEND: {
  name: string;
  desc: string;
  kind: "group" | "item" | "lift" | "shadow";
}[] = [
  {
    name: "Group",
    desc: "Reorder.Group, holds values + axis",
    kind: "group",
  },
  {
    name: "Item",
    desc: "Reorder.Item, one value each",
    kind: "item",
  },
  {
    name: "Lift",
    desc: "data-dragging → scale 1.03, CSS transition",
    kind: "lift",
  },
  {
    name: "Shadow",
    desc: "sibling overlay, opacity fade only",
    kind: "shadow",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "group") {
    return (
      <span className="h-4 w-8 rounded-lg border border-dashed border-border bg-transparent ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "item") {
    return (
      <span className="h-2.5 w-8 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "lift") {
    return (
      <span className="h-2.5 w-8 scale-[1.03] rounded-lg border border-border bg-[var(--card)] shadow-lg ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-2.5 w-8 rounded-lg bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
  );
}

export function ReorderListAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="group, item, and a data-driven lift">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-8 ${reduced ? "rla-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-2 rounded-2xl border border-dashed border-border p-2.5">
            {ROWS.map((i) => (
              <div
                key={i}
                className="rla-el"
                style={{ "--d": `${i * 70}ms` } as CSSProperties}
              >
                <div
                  className={`relative flex items-center gap-3 rounded-lg border border-border bg-[var(--card)] px-3 py-2.5 ${
                    i === LIFTED ? "scale-[1.03] shadow-lg" : "shadow-sm"
                  }`}
                >
                  {i === LIFTED ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-lg opacity-100 shadow-xl"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className="text-[var(--foreground)]/30 text-sm leading-none"
                  >
                    ⠿
                  </span>
                  <span className="h-1.5 w-24 rounded-full bg-[var(--foreground)]/30" />
                </div>
              </div>
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
