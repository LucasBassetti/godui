"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `drag="x"` on the card, constrained to `{ left: 0, right: 0 }` with
 * `dragElastic: 0.6` so it resists a little before following the pointer.
 * `onDragEnd` checks `Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x)
 * > 500` — cross either the distance or the speed bar and the card is
 * dismissed, no spring back. It's an OR: a fast flick that hasn't traveled
 * 80px yet still counts.
 *
 * The card rests on the left of a wide stage and fades out just past the
 * 80px threshold — never into the ScrollScene's rounded corners, which would
 * clip its left/right edges mid-swipe.
 */
const CSS = `
@keyframes tsw-card {
  0%, 12%   { transform: translateX(0); opacity: 1; }
  38%, 50%  { transform: translateX(70px); opacity: 1; }
  70%       { transform: translateX(110px); opacity: 0; }
  71%       { transform: translateX(0); opacity: 0; }
  88%, 100% { transform: translateX(0); opacity: 1; }
}
.tsw-card { animation: tsw-card 4.2s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.tsw-static .tsw-card { animation: none; transform: translateX(0); opacity: 0.35; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "card" | "threshold" | "dismissed";
}[] = [
  {
    name: "Card",
    desc: 'drag="x", elastic 0.6',
    kind: "card",
  },
  {
    name: "Threshold",
    desc: "|offset.x| > 80",
    kind: "threshold",
  },
  {
    name: "Dismissed",
    desc: "no spring back, just exits",
    kind: "dismissed",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "threshold") {
    return <span className="h-4 w-px bg-[var(--foreground)]/35" />;
  }
  if (kind === "dismissed") {
    return (
      <span className="flex h-4 w-8 flex-col justify-center gap-1 rounded-xl border border-border bg-[var(--card)] p-1 opacity-35 shadow-sm" />
    );
  }
  return (
    <span className="flex h-4 w-8 flex-col justify-center gap-1 rounded-xl border border-border bg-[var(--card)] p-1 shadow-sm ring-1 ring-fd-border ring-inset">
      <span className="h-0.5 w-2/5 rounded-full bg-[var(--foreground)]/35" />
      <span className="h-0.5 w-3/5 rounded-full bg-[var(--foreground)]/20" />
    </span>
  );
}

export function ToastSwipe() {
  return (
    <ScrollScene label="Swipe dismiss" note="distance OR velocity">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-8 ${reduced ? "tsw-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          {/*
            Left-anchored stage with room to the right. No overflow clip —
            the exit fades before reaching the scene frame.
          */}
          <div className="relative flex h-28 w-full items-center">
            {/* Threshold at +80px from the card's resting left edge. */}
            <span
              aria-hidden
              className="absolute top-3 bottom-3 w-px bg-[var(--foreground)]/35"
              style={{ left: 80 }}
            />

            <div className="tsw-card relative flex w-44 flex-col gap-1.5 rounded-xl border border-border bg-[var(--card)] p-3 shadow-lg will-change-transform">
              <span className="h-2 w-2/5 rounded-full bg-[var(--foreground)]/35" />
              <span className="h-2 w-3/5 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

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
