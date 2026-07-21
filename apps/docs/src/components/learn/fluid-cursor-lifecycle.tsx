"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The rAF loop stops once every lerp delta is under SETTLE (0.01) or the tab
 * is hidden — then restarts only on real pointer activity. No forever-spinning
 * loop writing identical transforms.
 */
const CSS = `
@keyframes fclc-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.55; transform: scale(0.92); }
}
.fclc-run { animation: fclc-pulse 1.2s ease-in-out infinite; }
.fclc-static .fclc-run { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Running",
    desc: "pointer active · deltas ≥ SETTLE · rAF spinning",
    kind: "running" as const,
  },
  {
    name: "Idle",
    desc: "settled or document.hidden — raf = 0",
    kind: "idle" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "idle") {
    return (
      <span className="size-2 rounded-full bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative flex size-4 items-center justify-center">
      <span className="size-2 rounded-full bg-[var(--foreground)]" />
      <span className="absolute size-4 rounded-full border border-dashed border-[var(--foreground)]/30" />
    </span>
  );
}

export function FluidCursorLifecycle() {
  return (
    <ScrollScene
      label="Cheap when idle"
      note="SETTLE 0.01 · restart on pointer"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-center gap-12 ${reduced ? "fclc-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                chasing
              </span>
              <div className="relative flex size-16 items-center justify-center">
                <div className="fclc-run size-4 rounded-full bg-[var(--foreground)]" />
                <div className="absolute size-10 rounded-full border border-dashed border-[var(--foreground)]/30" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                settled / hidden
              </span>
              <div className="relative flex size-16 items-center justify-center">
                <div className="size-4 rounded-full bg-[var(--foreground)]/25" />
                <div className="absolute size-10 rounded-full border border-[var(--foreground)]/15" />
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            if (settled() || document.hidden) {"{"} raf = 0; return; {"}"}
          </p>

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
