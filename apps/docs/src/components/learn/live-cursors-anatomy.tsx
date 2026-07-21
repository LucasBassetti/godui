"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One `CursorFlag` is two elements riding the same `motion.div`: the SVG
 * pointer path from the real component (`M5 3l5.5 16 2.2-6.8L19.5 10z`,
 * white stroke over a presence-color fill), and a name flag offset
 * `mt-3 -ml-1` with its own `rounded-tl-sm` corner — a mirror of the
 * comment pin's speech-bubble tail, pointing the other way.
 */
const CSS = `
@keyframes lca-in {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
.lca-el { animation: lca-in 260ms cubic-bezier(0.3,0.7,0.4,1) both; }
.lca-static .lca-el { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Pointer",
    desc: "SVG path, presence-color fill, white stroke",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "Name flag",
    desc: "mt-3 -ml-1, rounded-tl-sm — the tail points at the pointer",
    swatch: "bg-[var(--foreground)]/70",
  },
];

export function LiveCursorsAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one motion.div, two shapes">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "lca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--muted)]/40"
          >
            <div className="lca-el flex items-start">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                className="shrink-0 drop-shadow-sm"
                aria-hidden="true"
              >
                <path
                  d="M5 3l5.5 16 2.2-6.8L19.5 10z"
                  fill="var(--foreground)"
                  fillOpacity={0.7}
                  stroke="var(--background)"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </svg>
              <span className="mt-4 -ml-1 flex h-6 items-center rounded-[10px] rounded-tl-sm bg-[var(--foreground)]/70 px-2.5 shadow-sm">
                <span className="h-1.5 w-10 rounded-full bg-[var(--background)]/70" />
              </span>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
