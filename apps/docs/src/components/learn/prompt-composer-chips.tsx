"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two nested `AnimatePresence` levels: the outer row animates `height: 0 →
 * "auto"` with opacity so the panel doesn't jump when the first chip lands,
 * and each chip inside springs its own `scale: 0.8 → 1` with `opacity`
 * (`stiffness: 520, damping: 32`) — `layout` lets the survivors slide over
 * when a neighbor exits. This loop plays that whole cycle: wrapper opens,
 * two chips spring in, then both spring back out as the wrapper collapses.
 */
const CSS = `
@keyframes pcc-wrap {
  0%, 6%    { opacity: 0; transform: scaleY(0.3); }
  16%       { opacity: 1; transform: scaleY(1); }
  78%       { opacity: 1; transform: scaleY(1); }
  92%, 100% { opacity: 0; transform: scaleY(0.3); }
}
@keyframes pcc-a {
  0%, 8%    { opacity: 0; transform: scale(0.8); }
  15%       { opacity: 1; transform: scale(1.05); }
  20%       { transform: scale(1); }
  76%       { opacity: 1; transform: scale(1); }
  88%, 100% { opacity: 0; transform: scale(0.8); }
}
@keyframes pcc-b {
  0%, 22%   { opacity: 0; transform: scale(0.8); }
  29%       { opacity: 1; transform: scale(1.05); }
  34%       { transform: scale(1); }
  76%       { opacity: 1; transform: scale(1); }
  84%, 100% { opacity: 0; transform: scale(0.8); }
}
.pcc-wrap { transform-origin: top center; animation: pcc-wrap 4.2s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.pcc-a { animation: pcc-a 4.2s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.pcc-b { animation: pcc-b 4.2s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.pcc-static .pcc-wrap, .pcc-static .pcc-a, .pcc-static .pcc-b { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Wrapper",
    desc: "outer AnimatePresence, height 0 → auto + opacity",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Chip",
    desc: "scale 0.8 → 1 spring (520/32) + opacity, layout on exit",
    swatch: "bg-[var(--foreground)]/40",
  },
];

export function PromptComposerChips() {
  return (
    <ScrollScene label="The motion" note="spring 520/32 · looped">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "pcc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="pcc-wrap flex w-full min-h-11 items-start gap-1.5 rounded-2xl border border-border bg-[var(--card)] p-2.5"
          >
            <span className="pcc-a inline-flex items-center gap-1.5 rounded-lg border border-border bg-[var(--background)] py-1 pl-2 pr-2.5">
              <span className="size-2.5 shrink-0 rounded-sm bg-[var(--foreground)]/30" />
              <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/35" />
            </span>
            <span className="pcc-b inline-flex items-center gap-1.5 rounded-lg border border-border bg-[var(--background)] py-1 pl-2 pr-2.5">
              <span className="size-2.5 shrink-0 rounded-sm bg-[var(--foreground)]/30" />
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/35" />
            </span>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
