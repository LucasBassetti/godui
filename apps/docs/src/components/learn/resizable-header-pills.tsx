"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two independent `layoutId` spans ride the same link row: a hover pill
 * (`bg-accent`, fills the whole item) that follows the pointer, and a
 * thinner active underline that only follows a click. They're unrelated
 * tracks — the hover pill can sweep past several items while the underline
 * sits still on whichever one is actually active.
 */
const PITCH = 84;

const CSS = `
@keyframes rhp-hover {
  0%   { transform: translateX(0); }
  22%  { transform: translateX(${PITCH}px); }
  44%  { transform: translateX(${PITCH * 2}px); }
  66%  { transform: translateX(${PITCH * 3}px); }
  88%  { transform: translateX(${PITCH}px); }
  100% { transform: translateX(0); }
}
@keyframes rhp-underline {
  0%, 40%   { transform: translateX(0); }
  55%, 100% { transform: translateX(${PITCH * 2}px); }
}
.rhp-hover     { animation: rhp-hover 5.2s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.rhp-underline { animation: rhp-underline 5.2s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.rhp-static .rhp-hover     { animation: none; transform: none; }
.rhp-static .rhp-underline { animation: none; transform: translateX(${PITCH * 2}px); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "hoverPill" | "underline";
}[] = [
  {
    name: "Hover pill",
    desc: "layoutId span, fills the item under the pointer",
    kind: "hoverPill",
  },
  {
    name: "Active underline",
    desc: "separate layoutId — tracks the clicked link only",
    kind: "underline",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "underline") {
    return (
      <span className="h-0.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-2 w-8 rounded-full bg-[var(--foreground)]/12 ring-1 ring-fd-border ring-inset" />
  );
}

export function ResizableHeaderPills() {
  return (
    <ScrollScene label="Two tracks" note="hover pill + active underline">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "rhp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative inline-flex items-center gap-1 rounded-full border border-fd-border bg-[var(--card)] px-2 py-2 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="rhp-hover pointer-events-none absolute top-2 left-2 h-8 w-20 rounded-full bg-[var(--foreground)]/12"
            />
            <span
              aria-hidden="true"
              className="rhp-underline pointer-events-none absolute bottom-1.5 left-[26px] h-0.5 w-11 rounded-full bg-[var(--foreground)]"
            />
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative flex h-8 w-20 items-center justify-center"
              >
                <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
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
