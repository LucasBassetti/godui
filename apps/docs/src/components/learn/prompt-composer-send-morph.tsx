"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The send button never swaps element — one `<button>` stays mounted the
 * whole time, and `AnimatePresence mode="wait"` cross-fades its *contents*:
 * the arrow scales down to `0.6`/fades out, then (only once that finishes,
 * because `mode="wait"` sequences rather than overlaps) the stop square
 * scales up from `0.6`/fades in, both over `duration: 0.15`s. Slowed down
 * here so the sequencing — exit, a beat of nothing, enter — is visible.
 */
const CSS = `
@keyframes pcsm-arrow {
  0%, 6%    { opacity: 1; transform: scale(1); }
  14%       { opacity: 0; transform: scale(0.6); }
  72%       { opacity: 0; transform: scale(0.6); }
  80%, 100% { opacity: 1; transform: scale(1); }
}
@keyframes pcsm-stop {
  0%, 14%   { opacity: 0; transform: scale(0.6); }
  22%       { opacity: 1; transform: scale(1); }
  56%       { opacity: 1; transform: scale(1); }
  64%, 100% { opacity: 0; transform: scale(0.6); }
}
.pcsm-arrow { animation: pcsm-arrow 3.6s cubic-bezier(0.4,0,0.2,1) infinite; }
.pcsm-stop { animation: pcsm-stop 3.6s cubic-bezier(0.4,0,0.2,1) infinite; }
.pcsm-static .pcsm-arrow { animation: none; opacity: 1; transform: scale(1); }
.pcsm-static .pcsm-stop { animation: none; opacity: 0; transform: scale(0.6); }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Send",
    desc: 'key="send" · scale 1 → 0.6 out, 0.15s',
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Stop",
    desc: 'key="stop" · scale 0.6 → 1 in, 0.15s, after send exits',
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function PromptComposerSendMorph() {
  return (
    <ScrollScene label="Send ↔ Stop" note={'mode="wait" · looped'}>
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[320px] flex-col items-center gap-10 ${reduced ? "pcsm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="relative flex size-12 items-center justify-center rounded-xl bg-[var(--foreground)]/85"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--card)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pcsm-arrow absolute size-5"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="var(--card)"
              className="pcsm-stop absolute size-4"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
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
