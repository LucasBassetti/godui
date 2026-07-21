"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The shell is `layout`-animated by Framer, but its children are a separate
 * `AnimatePresence mode="popLayout"` keyed on `presenceKey` (defaulting to
 * `size`). Because it's `popLayout` and not `wait`, the outgoing view and the
 * incoming one animate at the same time — `opacity`, `scale: 0.9`, and
 * `filter: blur(4px)` on both, 0.2s `easeOut`, so they cross-fade instead of
 * handing off in sequence.
 */
const CSS = `
@keyframes dic-a {
  0%, 10%  { opacity: 1; transform: scale(1); filter: blur(0px); }
  25%, 75% { opacity: 0; transform: scale(0.9); filter: blur(4px); }
  90%, 100%{ opacity: 1; transform: scale(1); filter: blur(0px); }
}
@keyframes dic-b {
  0%, 10%  { opacity: 0; transform: scale(0.9); filter: blur(4px); }
  25%, 75% { opacity: 1; transform: scale(1); filter: blur(0px); }
  90%, 100%{ opacity: 0; transform: scale(0.9); filter: blur(4px); }
}
.dic-a { animation: dic-a 3.6s ease-out infinite; }
.dic-b { animation: dic-b 3.6s ease-out infinite; }
.dic-static .dic-a { animation: none; opacity: 0; transform: scale(0.9); filter: blur(4px); }
.dic-static .dic-b { animation: none; opacity: 1; transform: scale(1); filter: blur(0px); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "exit" | "enter";
}[] = [
  {
    name: "Exiting view",
    desc: "opacity 1→0 · scale 1→0.9 · blur 0→4px",
    kind: "exit",
  },
  {
    name: "Entering view",
    desc: "same curve, reversed, same 0.2s",
    kind: "enter",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "exit") {
    return (
      <span className="flex h-2.5 w-7 items-center gap-1 rounded-full bg-black px-1.5 opacity-70 blur-[0.5px] ring-1 ring-fd-border ring-inset">
        <span className="size-1 rounded-full bg-white/70" />
        <span className="h-1 w-3 rounded-full bg-white/50" />
      </span>
    );
  }
  return (
    <span className="flex h-2.5 w-7 items-center gap-1 rounded-full bg-black px-1.5 ring-1 ring-fd-border ring-inset">
      <span className="size-1 rounded-full bg-white" />
      <span className="h-1 w-4 rounded-full bg-white/80" />
    </span>
  );
}

export function DynamicIslandCrossfade() {
  return (
    <ScrollScene label="Content crossfade" note="popLayout · 0.2s easeOut">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "dic-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-11 w-56 items-center justify-center overflow-hidden rounded-full bg-black px-4">
            <div className="dic-a absolute flex items-center gap-2">
              <span className="size-2 rounded-full bg-white/70" />
              <span className="h-2 w-16 rounded-full bg-white/50" />
            </div>
            <div className="dic-b absolute flex items-center gap-2">
              <span className="size-2 rounded-full bg-white" />
              <span className="h-2 w-24 rounded-full bg-white/80" />
            </div>
          </div>

          <dl className="grid w-full max-w-[400px] grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
