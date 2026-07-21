"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The signature open: the whole panel scales `0.94 → 1` and fades in on a spring
 * (`stiffness: 520, damping: 32`). The rows don't animate on their own — they're
 * children of the panel, so they scale with it. The trick is `transform-origin`:
 * not the center but `originClasses[side][align]`, the corner nearest the trigger
 * (`origin-top-right` for a bottom/end menu), so the panel grows out of the edge
 * it hangs off. Compositor-only: transform + opacity.
 */
const ROWS = 5;

const CSS = `
@keyframes dms-open {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes dms-pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.35); }
}
.dms-panel { transform-origin: top right; animation: dms-open 460ms cubic-bezier(0.34,1.56,0.64,1) both; }
.dms-dot   { animation: dms-pulse 1.6s ease-in-out infinite; }
.dms-static .dms-panel { animation: none; opacity: 1; transform: none; }
.dms-static .dms-dot   { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "trigger" | "panel" | "origin";
}[] = [
  {
    name: "Trigger",
    desc: "the panel hangs off its edge",
    kind: "trigger",
  },
  {
    name: "Panel",
    desc: "scale 0.94 → 1, opacity 0 → 1 on a spring",
    kind: "panel",
  },
  {
    name: "transform-origin",
    desc: "the corner it grows from",
    kind: "origin",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "trigger") {
    return (
      <span className="h-2 w-7 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "panel") {
    return (
      <span className="h-3.5 w-6 rounded-xl border border-border bg-[var(--background)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-2 rounded-full bg-[var(--foreground)]/60 ring-2 ring-fd-card ring-inset" />
  );
}

export function DropdownMenuSpring() {
  return (
    <ScrollScene label="Open" note="grows from the corner nearest the trigger">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-col items-end gap-2 ${reduced ? "dms-static" : ""}`}
          >
            {/* Trigger — the menu aligns to its right edge (align="end"). */}
            <div className="flex h-9 w-32 items-center justify-end rounded-full border border-border bg-[var(--muted)] px-3">
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
            </div>

            <div className="relative">
              <div className="dms-panel w-56 rounded-xl border border-border bg-[var(--background)] p-1 shadow-lg">
                {Array.from({ length: ROWS }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                    key={i}
                    className="flex h-9 items-center gap-2.5 rounded-lg px-2.5"
                  >
                    <span className="size-4 shrink-0 rounded bg-[var(--foreground)]/20" />
                    <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/30" />
                  </div>
                ))}
              </div>
              {/* transform-origin marker — the top-right corner. */}
              <span className="dms-dot -right-1 -top-1 absolute size-2.5 rounded-full bg-[var(--foreground)]/60 ring-2 ring-fd-card" />
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
