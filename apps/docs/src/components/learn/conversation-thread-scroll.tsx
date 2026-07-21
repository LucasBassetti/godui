"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `onScroll` computes `scrollHeight - scrollTop - clientHeight < 48` on
 * every event and flips `pinned`. This loops the two states: pinned (the
 * viewport sits at its lowest scroll offset, pill hidden) → scrolled up
 * (content shifts down past the dashed threshold, pill springs in) → back
 * to pinned. The pill itself carries no label here — only an arrow, the
 * same as the real markup before any copy is read.
 */
const CSS = `
@keyframes ctsc-content {
  0%, 12%   { transform: translateY(-64px); }
  32%, 58%  { transform: translateY(0px); }
  78%, 100% { transform: translateY(-64px); }
}
@keyframes ctsc-pill {
  0%, 16%   { opacity: 0; transform: translate(-50%, 8px) scale(0.9); }
  30%       { opacity: 1; transform: translate(-50%, -1px) scale(1.02); }
  40%, 56%  { opacity: 1; transform: translate(-50%, 0px) scale(1); }
  70%, 100% { opacity: 0; transform: translate(-50%, 8px) scale(0.9); }
}
.ctsc-content { animation: ctsc-content 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.ctsc-pill { animation: ctsc-pill 4.8s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.ctsc-static .ctsc-content { animation: none; transform: translateY(-64px); }
.ctsc-static .ctsc-pill { animation: none; opacity: 0; }
`;

const ROWS: string[] = ["w-24", "w-32", "w-20", "w-28", "w-16", "w-32"];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Message row",
    desc: "content taller than the viewport, scrolls under it",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "48px threshold",
    desc: "scrollHeight − scrollTop − clientHeight",
    swatch:
      "border-t border-dashed border-[var(--foreground)]/40 bg-transparent",
  },
  {
    name: "Jump-to-latest pill",
    desc: "sticky bottom-2, spring opacity/y/scale",
    swatch: "bg-[var(--popover)]",
  },
];

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

export function ConversationThreadScroll() {
  return (
    <ScrollScene label="The motion" note="pinned ↔ scrolled up, looped">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-8 ${reduced ? "ctsc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative h-64 w-64 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
          >
            <div className="ctsc-content absolute inset-x-0 top-0 flex flex-col gap-3 px-4 py-4">
              {ROWS.map((w, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static decorative rows; widths intentionally repeat
                  key={i}
                  className={`h-2.5 ${w} shrink-0 rounded-full bg-[var(--foreground)]/25`}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-12 border-t border-dashed border-[var(--foreground)]/30" />

            <div className="ctsc-pill absolute bottom-3 left-1/2 inline-flex size-8 items-center justify-center rounded-full border border-fd-border bg-[var(--popover)] shadow-lg">
              <ArrowDownIcon className="size-3.5 text-fd-foreground" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              "scrollHeight - scrollTop - clientHeight < 48  →  setPinned(atBottom)"
            }
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
