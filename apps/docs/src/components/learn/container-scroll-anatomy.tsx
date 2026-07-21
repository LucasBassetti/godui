"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two pieces share one scroll driver: a `header` that rises as you scroll,
 * and a device `frame` sitting in its own `[perspective:1000px]` stage,
 * tilted back in 3D. Both are plain children of the same container — nothing
 * about their DOM nesting couples them, only the transforms they're each
 * handed.
 */
const CSS = `
@keyframes csra-header { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes csra-frame  { from { opacity: 0; transform: rotateX(28deg) scale(0.96); } to { opacity: 1; transform: rotateX(14deg) scale(1); } }
.csra-header { opacity: 0; animation: csra-header 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.csra-frame  { opacity: 0; animation: csra-frame 620ms cubic-bezier(0.3,0.7,0.4,1) 120ms both; }
.csra-static .csra-header,
.csra-static .csra-frame { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; kind: "header" | "frame" }[] = [
  {
    name: "Header",
    desc: "translateY 0 → -100 as the section scrolls",
    kind: "header",
  },
  {
    name: "Frame",
    desc: "rotateX 20° → 0°, scale 1.05 → 1, in its own 3D stage",
    kind: "frame",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "header") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-6 rounded-md border border-fd-border bg-[var(--card)] p-0.5 ring-1 ring-fd-border ring-inset">
      <span className="block h-full w-full rounded-[3px] bg-[var(--muted)]" />
    </span>
  );
}

export function ContainerScrollAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="header + frame, one driver">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 ${reduced ? "csra-static" : ""}`}
          >
            <div className="csra-header flex flex-col items-center gap-2">
              <span className="h-2.5 w-32 rounded-full bg-[var(--foreground)]/50" />
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />
            </div>

            <div className="flex h-28 w-full items-center justify-center [perspective:700px]">
              <div className="csra-frame w-52 rounded-xl border border-fd-border bg-[var(--card)] p-1.5 shadow-lg">
                <div className="aspect-[16/10] w-full rounded-md bg-[var(--muted)]" />
              </div>
            </div>
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
