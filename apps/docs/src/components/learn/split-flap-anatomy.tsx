"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * A flap exploded into its four leaves: the two static background halves (new
 * top, old bottom) stay flat while the two moving leaves peel forward off the
 * seam — so all four surfaces read at once without overlapping.
 */
const CSS = `
@keyframes sfa-fall {
  from { transform: translateZ(0) translateY(0) rotateX(0deg); opacity: 0.5; }
  to   { transform: translateZ(64px) translateY(-10px) rotateX(-48deg); opacity: 1; }
}
@keyframes sfa-rise {
  from { transform: translateZ(0) translateY(0) rotateX(0deg); opacity: 0.5; }
  to   { transform: translateZ(64px) translateY(10px) rotateX(48deg); opacity: 1; }
}
.sfa-fall { animation: sfa-fall 820ms cubic-bezier(0.3,0.7,0.4,1) 140ms both; }
.sfa-rise { animation: sfa-rise 820ms cubic-bezier(0.22,1,0.36,1) 320ms both; }
.sfa-static .sfa-fall { animation: none; transform: translateZ(64px) translateY(-10px) rotateX(-48deg); opacity: 1; }
.sfa-static .sfa-rise { animation: none; transform: translateZ(64px) translateY(10px) rotateX(48deg); opacity: 1; }
`;

function Leaf({
  char,
  part,
  className,
}: {
  char: string;
  part: "top" | "bottom";
  className?: string;
}) {
  const isTop = part === "top";
  return (
    <div
      className={`absolute inset-x-0 ${isTop ? "top-0 rounded-t-md border-b" : "bottom-0 rounded-b-md border-t"} h-1/2 overflow-hidden border-[var(--background)]/20 bg-[var(--foreground)] text-[var(--background)] ${className ?? ""}`}
    >
      <div
        className={`absolute inset-x-0 ${isTop ? "top-0" : "bottom-0"} flex h-[200%] items-center justify-center font-mono font-semibold text-5xl`}
      >
        {char}
      </div>
    </div>
  );
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "top" | "bottom" | "fall" | "rise";
}[] = [
  {
    name: "New top",
    desc: "static — revealed as the old top peels away",
    kind: "top",
  },
  {
    name: "Old bottom",
    desc: "static — holds until the new bottom lands",
    kind: "bottom",
  },
  { name: "Fall leaf", desc: "old top · rotateX 0 → −90°", kind: "fall" },
  { name: "Rise leaf", desc: "new bottom · rotateX 90 → 0°", kind: "rise" },
];

function Swatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "top") {
    return (
      <span className="block h-3 w-8 rounded-t-[3px] bg-[var(--foreground)]/80" />
    );
  }
  if (kind === "bottom") {
    return (
      <span className="block h-3 w-8 rounded-b-[3px] bg-[var(--foreground)]/80" />
    );
  }
  const tilt =
    kind === "fall"
      ? "[transform:rotateX(48deg)]"
      : "[transform:rotateX(-48deg)]";
  return (
    <span className="flex h-5 w-8 items-center">
      <span
        className={`block h-3 w-8 rounded-[3px] bg-[var(--foreground)]/45 ${tilt}`}
      />
    </span>
  );
}

export function SplitFlapAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="four leaves, peeled apart">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "sfa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex h-[260px] items-center justify-center [perspective:900px]">
            <div
              key={cycle}
              className="relative h-40 w-28 [transform-style:preserve-3d]"
            >
              {/* Static background halves — the flap that remains. */}
              <Leaf char="B" part="top" />
              <Leaf char="A" part="bottom" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--background)]/30" />
              {/* Moving leaves, peeled forward off the seam. */}
              <Leaf
                char="A"
                part="top"
                className="sfa-fall origin-bottom shadow-lg [backface-visibility:hidden]"
              />
              <Leaf
                char="B"
                part="bottom"
                className="sfa-rise origin-top shadow-lg [backface-visibility:hidden]"
              />
            </div>
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
