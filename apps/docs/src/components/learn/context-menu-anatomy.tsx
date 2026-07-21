"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One panel, four row types. `items` is a flat array the menu walks in order:
 * a muted `label` header, interactive `item` buttons (icon · label · shortcut),
 * `separator` rules, and `destructive` items tinted red. No nested config — the
 * shape of the array is the shape of the menu. Rows stagger in on scroll-in.
 */
const CSS = `
@keyframes cma-row { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.cma-row { opacity: 0; animation: cma-row 360ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cma-static .cma-row { opacity: 1; animation: none; transform: none; }
`;

/** A label bar stand-in — no real copy lives on the diagram. */
function Bar({
  w,
  tone = "bg-[var(--foreground)]/30",
}: {
  w: string;
  tone?: string;
}) {
  return <span className={`h-2 rounded-full ${w} ${tone}`} />;
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "label" | "item" | "separator" | "destructive";
}[] = [
  {
    name: "label",
    desc: "muted header, not focusable",
    kind: "label",
  },
  {
    name: "item",
    desc: "icon · label · shortcut",
    kind: "item",
  },
  {
    name: "separator",
    desc: "a hairline <hr>",
    kind: "separator",
  },
  {
    name: "destructive",
    desc: "red tint, same row",
    kind: "destructive",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "separator") {
    return <span className="h-px w-8 bg-border" />;
  }
  if (kind === "destructive") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-destructive/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "label") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
  );
}

export function ContextMenuAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one panel · four row types">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`w-56 rounded-xl border border-border bg-background p-1 shadow-2xl ${reduced ? "cma-static" : ""}`}
          >
            {/* label */}
            <div
              className="cma-row px-3 pt-2 pb-1.5"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <Bar w="w-24" tone="bg-[var(--foreground)]/20" />
            </div>
            {/* item */}
            <div
              className="cma-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
              style={{ "--d": "70ms" } as CSSProperties}
            >
              <span className="size-4 shrink-0 rounded-[5px] bg-[var(--foreground)]/25" />
              <Bar w="w-16" />
              <span className="ml-auto h-2 w-5 rounded bg-[var(--foreground)]/20" />
            </div>
            {/* item */}
            <div
              className="cma-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
              style={{ "--d": "140ms" } as CSSProperties}
            >
              <span className="size-4 shrink-0 rounded-[5px] bg-[var(--foreground)]/25" />
              <Bar w="w-20" />
              <span className="ml-auto h-2 w-6 rounded bg-[var(--foreground)]/20" />
            </div>
            {/* separator */}
            <hr
              className="cma-row my-1 border-border border-t-0 border-b"
              style={{ "--d": "210ms" } as CSSProperties}
            />
            {/* item */}
            <div
              className="cma-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
              style={{ "--d": "280ms" } as CSSProperties}
            >
              <span className="size-4 shrink-0 rounded-[5px] bg-[var(--foreground)]/25" />
              <Bar w="w-14" />
            </div>
            {/* separator */}
            <hr
              className="cma-row my-1 border-border border-t-0 border-b"
              style={{ "--d": "350ms" } as CSSProperties}
            />
            {/* destructive item */}
            <div
              className="cma-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
              style={{ "--d": "420ms" } as CSSProperties}
            >
              <span className="size-4 shrink-0 rounded-[5px] bg-destructive/60" />
              <Bar w="w-16" tone="bg-destructive/70" />
              <span className="ml-auto h-2 w-4 rounded bg-destructive/50" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-4">
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
