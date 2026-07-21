"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The unread badge is wrapped in `AnimatePresence` and only renders while
 * `unread > 0` — it pops in with `{ opacity: 0, scale: 0.6 } → { opacity: 1,
 * scale: 1 }` and pops back out the same way when the count hits zero.
 * "Mark all read" flips every notification's `read` flag at once, so the
 * badge and every row's unread dot disappear together, not one by one.
 */
const CSS = `
@keyframes nib-badge {
  0%, 6%    { opacity: 0; transform: scale(0.6); }
  18%       { opacity: 1; transform: scale(1.1); }
  26%, 60%  { opacity: 1; transform: scale(1); }
  72%, 100% { opacity: 0; transform: scale(0.6); }
}
@keyframes nib-press {
  0%, 62%, 100% { transform: scale(1); }
  66% { transform: scale(0.92); }
  70% { transform: scale(1); }
}
.nib-badge { animation: nib-badge 4.4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.nib-press { animation: nib-press 4.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.nib-static .nib-badge { animation: none; opacity: 0; transform: scale(0.6); }
.nib-static .nib-press { animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Badge",
    desc: "AnimatePresence, scale 0.6 → 1 spring",
    swatch: "bg-primary",
  },
  {
    name: "Mark all read",
    desc: "flips every notification.read at once",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Unread dot",
    desc: "clears in the same frame as the badge",
    swatch: "bg-primary",
  },
];

export function NotificationInboxBadge() {
  return (
    <ScrollScene label="The showpiece" note="badge pop · mark-all clears">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[360px] flex-col items-center gap-8 ${
            reduced ? "nib-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-lg">
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/40" />
                <span className="nib-badge flex size-5 items-center justify-center rounded-full bg-primary" />
              </div>
              <span className="nib-press h-2 w-16 rounded-full bg-[var(--foreground)]/20" />
            </div>
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-t border-fd-border px-4 py-3"
              >
                <span className="size-8 shrink-0 rounded-full bg-[var(--foreground)]/15" />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
                  <span className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/15" />
                </span>
                <span className="nib-badge mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
