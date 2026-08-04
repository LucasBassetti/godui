"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The two-phase flip, looping. Over one period the fall leaf hinges the old top
 * down to −90° (first third), then the rise leaf brings the new bottom up from
 * 90° to flush (second third). Both moving leaves carry the same neutral face as
 * the static halves behind them, so the wrap-around reset is seamless.
 */
const CSS = `
@keyframes sff-fall {
  0%, 8%   { transform: rotateX(0deg); }
  38%, 100% { transform: rotateX(-90deg); }
}
@keyframes sff-rise {
  0%, 42%  { transform: rotateX(90deg); }
  72%, 100% { transform: rotateX(0deg); }
}
.sff-fall { animation: sff-fall 1.9s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.sff-rise { animation: sff-rise 1.9s cubic-bezier(0.22,1,0.36,1) infinite; }
.sff-static .sff-fall,
.sff-static .sff-rise { animation: none; }
.sff-static .sff-fall { transform: rotateX(-90deg); }
`;

function Half({
  part,
  className,
}: {
  part: "top" | "bottom";
  className?: string;
}) {
  const isTop = part === "top";
  return (
    <div
      className={`absolute inset-x-0 ${isTop ? "top-0 rounded-t-md border-b" : "bottom-0 rounded-b-md border-t"} h-1/2 overflow-hidden border-[var(--background)]/20 bg-[var(--foreground)] ${className ?? ""}`}
    >
      {/* Neutral surface marker so the rotation is legible without a glyph. */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
        <span className="h-1.5 w-9 rounded-full bg-[var(--background)]/35" />
      </div>
    </div>
  );
}

const LEGEND: { name: string; desc: string; kind: "fall" | "rise" }[] = [
  {
    name: "Fall",
    desc: "old top hinges down · origin-bottom · 0.12s",
    kind: "fall",
  },
  {
    name: "Rise",
    desc: "new bottom hinges up · origin-top · 0.12s",
    kind: "rise",
  },
];

function Swatch({ kind }: { kind: "fall" | "rise" }) {
  const tilt =
    kind === "fall"
      ? "[transform:rotateX(50deg)]"
      : "[transform:rotateX(-50deg)]";
  return (
    <span className="flex h-5 w-8 items-end">
      <span
        className={`block h-3 w-8 rounded-[3px] bg-[var(--foreground)]/60 ${tilt}`}
      />
    </span>
  );
}

export function SplitFlapFlip() {
  return (
    <ScrollScene label="The flip" note="fall, then rise — one flap on a loop">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "sff-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="relative h-40 w-28 [perspective:700px]">
            {/* Static halves behind the moving leaves. */}
            <Half part="top" />
            <Half part="bottom" />
            {/* Moving leaves. */}
            <Half
              part="top"
              className="z-raised origin-bottom [backface-visibility:hidden] sff-fall"
            />
            <Half
              part="bottom"
              className="z-raised origin-top [backface-visibility:hidden] sff-rise"
            />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-raised h-px -translate-y-1/2 bg-[var(--background)]/30" />
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <Swatch kind={item.kind} />
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
