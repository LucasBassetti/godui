"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Three independent timelines fire together, not one: the backdrop is a
 * plain opacity tween (`duration: 0.2`, skipped entirely under reduced
 * motion), the panel settles on `MORPH_SPRING` with a hair of overshoot
 * (`0.9 → 1.04 → 1`), and the close button is a flat opacity fade held back
 * by a `delay: 0.1` so it never appears mid-morph. The panel itself mounts
 * through a `createPortal` into `document.body`, so it always paints above
 * the page regardless of where the trigger lives in the tree.
 */
const CSS = `
@keyframes mdb-backdrop {
  0%, 6%    { opacity: 0; }
  18%, 74%  { opacity: 1; }
  88%, 100% { opacity: 0; }
}
@keyframes mdb-panel {
  0%, 6%    { opacity: 0; transform: scale(0.9); }
  20%       { opacity: 1; transform: scale(1.04); }
  28%, 74%  { opacity: 1; transform: scale(1); }
  84%, 100% { opacity: 0; transform: scale(0.9); }
}
@keyframes mdb-close {
  0%, 24%   { opacity: 0; }
  34%, 68%  { opacity: 1; }
  80%, 100% { opacity: 0; }
}
.mdb-backdrop { animation: mdb-backdrop 4.2s ease-in-out infinite; }
.mdb-panel    { animation: mdb-panel 4.2s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.mdb-close    { animation: mdb-close 4.2s ease infinite; }
.mdb-static .mdb-backdrop { animation: none; opacity: 1; }
.mdb-static .mdb-panel    { animation: none; opacity: 1; transform: none; }
.mdb-static .mdb-close    { animation: none; opacity: 1; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "backdrop" | "panel" | "close";
}[] = [
  {
    name: "Backdrop",
    desc: "opacity 0 → 1, 0.2s tween",
    kind: "backdrop",
  },
  {
    name: "Panel",
    desc: "spring settle, 0.9 → 1.04 → 1",
    kind: "panel",
  },
  {
    name: "Close",
    desc: "opacity fade, delay 0.1s",
    kind: "close",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "backdrop") {
    return (
      <span className="h-3.5 w-8 rounded-sm bg-black/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "close") {
    return (
      <span className="size-4 rounded-full bg-background/80 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative h-3.5 w-6 overflow-hidden rounded-xl bg-[var(--card)] shadow-sm ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-x-1 top-1 h-2 rounded-md bg-[var(--muted)]" />
    </span>
  );
}

export function MorphingDialogBackdrop() {
  return (
    <ScrollScene label="Backdrop + portal" note="three timelines, one open">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "mdb-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[220px] w-[300px] items-center justify-center overflow-hidden rounded-2xl border border-fd-border">
            <div className="mdb-backdrop absolute inset-0 bg-black/50" />
            <div className="mdb-panel relative flex h-32 w-52 flex-col gap-2 rounded-xl bg-[var(--card)] p-3 shadow-xl">
              <span className="mdb-close absolute top-2 right-2 size-4 rounded-full bg-background/80" />
              <div className="h-10 w-full rounded-lg bg-[var(--muted)]" />
              <span className="h-2 w-3/5 rounded-full bg-[var(--foreground)]/30" />
            </div>
          </div>

          <dl className="grid w-full max-w-[420px] grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
