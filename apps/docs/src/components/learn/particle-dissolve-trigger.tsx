"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three start gates: mount (immediate), in-view (IntersectionObserver
 * threshold 0.3), hover (pointer enter/leave flips goal). Reduced motion
 * skips the rAF and draws the formed state once.
 */
const CSS = `
@keyframes pdt-mount {
  0%, 10%  { transform: scaleY(0.08); opacity: 0.4; }
  18%, 100%{ transform: scaleY(1);    opacity: 1; }
}
@keyframes pdt-view {
  0%, 28%  { transform: scaleY(0.08); opacity: 0.4; }
  38%, 100%{ transform: scaleY(1);    opacity: 1; }
}
@keyframes pdt-hover {
  0%, 20%  { transform: scaleY(0.08); opacity: 0.4; }
  35%, 58% { transform: scaleY(1);    opacity: 1; }
  72%, 100%{ transform: scaleY(0.08); opacity: 0.4; }
}
@keyframes pdt-io {
  0%, 22%  { opacity: 0.25; transform: scale(0.9); }
  30%, 100%{ opacity: 1;    transform: scale(1); }
}
@keyframes pdt-ptr {
  0%, 28%  { opacity: 0.3; transform: translateY(6px); }
  35%, 58% { opacity: 1;   transform: translateY(0); }
  72%, 100%{ opacity: 0.3; transform: translateY(6px); }
}
.pdt-mount { animation: pdt-mount 4s ease-in-out infinite; transform-origin: bottom center; }
.pdt-view  { animation: pdt-view 4s ease-in-out infinite; transform-origin: bottom center; }
.pdt-hover { animation: pdt-hover 4s ease-in-out infinite; transform-origin: bottom center; }
.pdt-io    { animation: pdt-io 4s ease-in-out infinite; }
.pdt-ptr   { animation: pdt-ptr 4s ease-in-out infinite; }
.pdt-static .pdt-mount,
.pdt-static .pdt-view,
.pdt-static .pdt-hover { animation: none; opacity: 1; transform: none; }
.pdt-static .pdt-io,
.pdt-static .pdt-ptr { animation: none; opacity: 1; transform: none; }
`;

const COLS = [
  {
    name: "Mount",
    desc: "start() on effect resolve",
    bar: "pdt-mount",
    badge: null,
    kind: "mount" as const,
  },
  {
    name: "In-view",
    desc: "IO threshold 0.3 · once",
    bar: "pdt-view",
    badge: "pdt-io",
    kind: "inView" as const,
  },
  {
    name: "Hover",
    desc: "enter/leave flips goal",
    bar: "pdt-hover",
    badge: "pdt-ptr",
    kind: "hover" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof COLS)[number]["kind"] }) {
  if (kind === "mount") {
    return (
      <span className="relative flex h-3.5 w-6 items-end justify-center rounded-md bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset">
        <span className="absolute top-0 size-1.5 rounded-full bg-[var(--foreground)]/50" />
      </span>
    );
  }
  if (kind === "inView") {
    return (
      <span className="relative flex h-3.5 w-6 items-end justify-center rounded-md bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset">
        <span className="absolute top-0 size-2.5 rounded-full border border-fd-border bg-[var(--muted)]" />
      </span>
    );
  }
  return (
    <span className="relative flex h-3.5 w-6 items-end justify-center rounded-md bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset">
      <span className="absolute top-0 size-1.5 rounded-full bg-[var(--foreground)]/50" />
    </span>
  );
}

export function ParticleDissolveTrigger() {
  return (
    <ScrollScene label="Triggers" note="mount · in-view · hover">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${reduced ? "pdt-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 gap-4">
            {COLS.map((col) => (
              <div key={col.name} className="flex flex-col items-center gap-3">
                <div className="relative flex h-36 w-16 flex-col items-center justify-end rounded-xl border border-fd-border bg-[var(--card)] p-2">
                  {col.badge ? (
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 size-2.5 rounded-full border border-fd-border bg-[var(--muted)] ${col.badge}`}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 size-1.5 rounded-full bg-[var(--foreground)]/50"
                    />
                  )}
                  <div
                    className={`w-9 rounded-md bg-[var(--foreground)]/40 ${col.bar}`}
                    style={{ height: "70%" } as CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"reduce → p=1, draw once · no rAF"}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {COLS.map((item) => (
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
