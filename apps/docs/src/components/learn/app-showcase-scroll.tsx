"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `scroll` mode has two separate motion sources on the same `SPRING` config
 * (`{ stiffness: 320, damping: 32, mass: 0.9 }`). The phone's *entrance* is a
 * `whileInView` spring on `opacity` / `y` / `rotateX`, fired once. The
 * screen's *pan* is `useSpring(useTransform(scrollYProgress, [0, 1], ["0%",
 * "-45%"]))` — smoothed scroll position, not time. Looped here on a timer to
 * show the shape of the motion; the real thing only moves while you scroll.
 */
const CSS = `
@keyframes ashs-enter {
  from { opacity: 0; transform: translateY(30px) rotateX(10deg); }
  to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
}
@keyframes ashs-pan {
  0%, 12%  { transform: translateY(0%); }
  88%, 100% { transform: translateY(-45%); }
}
.ashs-phone  { animation: ashs-enter 640ms cubic-bezier(0.22,1.12,0.4,1) both; }
.ashs-screen { animation: ashs-pan 4.4s ease-in-out 640ms infinite alternate; }
.ashs-static .ashs-phone  { animation: none; transform: none; opacity: 1; }
.ashs-static .ashs-screen { animation: none; transform: translateY(-22%); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "entrance" | "pan";
}[] = [
  {
    name: "Entrance",
    desc: "opacity + y + rotateX, one whileInView spring",
    kind: "entrance",
  },
  {
    name: "Scroll pan",
    desc: "y: 0% → -45%, driven by scrollYProgress",
    kind: "pan",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "entrance") {
    return (
      <span className="h-4 w-3 rounded-md border border-fd-border bg-[var(--muted)] [transform:rotateX(12deg)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="flex h-4 w-3 flex-col gap-0.5 overflow-hidden rounded-md border border-fd-border bg-[var(--foreground)]/10 ring-1 ring-fd-border ring-inset">
      <span className="h-1 w-full shrink-0 rounded-sm bg-[var(--foreground)]/25" />
      <span className="h-1 w-full shrink-0 rounded-sm bg-[var(--foreground)]/15" />
      <span className="h-1 w-full shrink-0 rounded-sm bg-[var(--foreground)]/25" />
    </span>
  );
}

export function AppShowcaseScroll() {
  return (
    <ScrollScene label="The motion" note="one entrance spring · one scroll pan">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 [perspective:1200px] ${
            reduced ? "ashs-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="ashs-phone [transform-style:preserve-3d]">
            <div className="relative h-56 w-28 overflow-hidden rounded-[22px] bg-[var(--muted)] p-2 shadow-xl">
              <div className="relative size-full overflow-hidden rounded-2xl bg-[var(--foreground)]/10">
                <div className="ashs-screen absolute inset-x-0 top-0 flex h-[200%] flex-col gap-3 p-3">
                  <span className="h-16 shrink-0 rounded-lg bg-[var(--foreground)]/25" />
                  <span className="h-2 w-3/4 shrink-0 rounded-full bg-[var(--foreground)]/25" />
                  <span className="h-2 w-1/2 shrink-0 rounded-full bg-[var(--foreground)]/15" />
                  <span className="h-16 shrink-0 rounded-lg bg-[var(--foreground)]/25" />
                  <span className="h-2 w-2/3 shrink-0 rounded-full bg-[var(--foreground)]/25" />
                  <span className="h-16 shrink-0 rounded-lg bg-[var(--foreground)]/25" />
                  <span className="h-2 w-3/4 shrink-0 rounded-full bg-[var(--foreground)]/15" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"{ stiffness: 320, damping: 32, mass: 0.9 }"}
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
