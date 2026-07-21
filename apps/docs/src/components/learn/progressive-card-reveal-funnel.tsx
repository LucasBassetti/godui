"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * This is the one place the component deliberately animates a layout
 * property. `width` and `borderRadius` are driven by `motion.div`'s `layout`
 * prop (a real FLIP measure-and-tween, not a transform trick) because the
 * funnel is a genuine width handoff between siblings sharing one row's
 * worth of space — a transform can't make one card's box actually take more
 * room while its neighbours give it up. `borderRadius` rides on `style`
 * rather than `animate` so it stays crisp instead of warping under the
 * layout scale-correction. Looped here as `activeIndex` stepping 0 → 1 → 2.
 */
const CSS = `
@keyframes pcrf-card-0 {
  0%, 22%   { width: 100%; height: 52px; border-radius: 20px; }
  33%, 55%  { width: 90%; height: 32px; border-radius: 9999px; }
  66%, 88%  { width: 83%; height: 32px; border-radius: 9999px; }
  100%      { width: 100%; height: 52px; border-radius: 20px; }
}
@keyframes pcrf-card-1 {
  0%, 22%   { width: 90%; height: 32px; border-radius: 9999px; }
  33%, 55%  { width: 100%; height: 52px; border-radius: 20px; }
  66%, 88%  { width: 90%; height: 32px; border-radius: 9999px; }
  100%      { width: 90%; height: 32px; border-radius: 9999px; }
}
@keyframes pcrf-card-2 {
  0%, 22%   { width: 83%; height: 32px; border-radius: 9999px; }
  33%, 55%  { width: 90%; height: 32px; border-radius: 9999px; }
  66%, 88%  { width: 100%; height: 52px; border-radius: 20px; }
  100%      { width: 83%; height: 32px; border-radius: 9999px; }
}
.pcrf-card-0 { animation: pcrf-card-0 6s cubic-bezier(0.22,1,0.36,1) infinite; }
.pcrf-card-1 { animation: pcrf-card-1 6s cubic-bezier(0.22,1,0.36,1) infinite; }
.pcrf-card-2 { animation: pcrf-card-2 6s cubic-bezier(0.22,1,0.36,1) infinite; }
.pcrf-static .pcrf-card-0 { animation: none; width: 100%; height: 52px; border-radius: 20px; }
.pcrf-static .pcrf-card-1,
.pcrf-static .pcrf-card-2 { animation: none; width: 90%; height: 32px; border-radius: 9999px; }
`;

const CARDS = [0, 1, 2];

const LEGEND: {
  name: string;
  desc: string;
  kind: "expanded" | "collapsed";
}[] = [
  {
    name: "Active card",
    desc: "100% width, 20px radius",
    kind: "expanded",
  },
  {
    name: "Collapsed cards",
    desc: "narrower per step away, pill radius",
    kind: "collapsed",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "expanded") {
    return (
      <span className="h-2.5 w-8 rounded-2xl border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-6 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
  );
}

export function ProgressiveCardRevealFunnel() {
  return (
    <ScrollScene label="The funnel morph" note="width + radius, layout-driven">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[340px] flex-col items-center gap-8 ${reduced ? "pcrf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col items-center gap-2 overflow-hidden">
            {CARDS.map((i) => (
              <div key={i} className="flex w-full justify-center">
                <div
                  className={`pcrf-card-${i} flex items-center justify-center border border-border bg-[var(--card)] shadow-sm`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'width: expanded ? "100%" : collapsedWidth(depth)'}
          </p>

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
