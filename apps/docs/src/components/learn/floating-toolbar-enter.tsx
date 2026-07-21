"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `AnimatePresence` mounts and unmounts the whole shell — actions don't
 * stagger in on their own, they're just children, so they ride the shell's
 * single spring (`stiffness: 520, damping: 32`, much stiffer than the
 * tooltip's) in as one unit. The exit is a plain tween to a *different*
 * resting pose (`opacity: 0, y: 8, scale: 0.95`), not the mirror of the
 * enter — it doesn't need the spring's overshoot on the way out.
 */
const CSS = `
@keyframes fte-cycle {
  0%, 6%    { opacity: 0; transform: translateY(12px) scale(0.92); }
  30%       { opacity: 1; transform: translateY(-2px) scale(1.02); }
  42%, 78%  { opacity: 1; transform: translateY(0) scale(1); }
  92%, 100% { opacity: 0; transform: translateY(8px) scale(0.95); }
}
.fte-shell { animation: fte-cycle 3.4s cubic-bezier(0.4,0.65,0.4,1) infinite; }
.fte-static .fte-shell { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "enter" | "exit" | "reduced";
}[] = [
  {
    name: "enter",
    desc: "opacity 0, y 12, scale 0.92 → spring 520/32",
    kind: "enter",
  },
  {
    name: "exit",
    desc: "opacity 0, y 8, scale 0.95 — a plain tween",
    kind: "exit",
  },
  {
    name: "reduced motion",
    desc: "collapses to an opacity-only fade",
    kind: "reduced",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "enter") {
    return (
      <span className="size-3.5 rounded-lg bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "exit") {
    return (
      <span className="size-3.5 rounded-lg bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3.5 rounded-lg bg-[var(--foreground)]/12 ring-1 ring-fd-border ring-inset" />
  );
}

export function FloatingToolbarEnter() {
  return (
    <ScrollScene label="The motion" note="mount spring · plain-tween exit">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "fte-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="fte-shell inline-flex items-center gap-1 rounded-xl border border-border bg-[var(--muted)]/90 p-1 shadow-lg backdrop-blur-md"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length action row
                key={i}
                className="size-9 rounded-lg bg-[var(--foreground)]/12"
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 520, damping: 32 }'}
          </p>

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
