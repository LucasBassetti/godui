"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `loop` mode never touches Framer Motion or React state per frame — the
 * scroll is a Tailwind `animate-app-showcase-scroll` utility (`translateY(0)
 * → translateY(-50%)`, linear, infinite) sitting on a track that renders the
 * screenshot twice back to back. Because the second copy is byte-identical
 * to the first, sliding exactly one copy's height up snaps back to frame
 * zero with no visible seam. An `IntersectionObserver` only toggles the
 * class on/off — the animation itself runs entirely on the compositor.
 */
const CSS = `
@keyframes asl-track { from { transform: translateY(0); } to { transform: translateY(-50%); } }
.asl-track { animation: asl-track 6s linear infinite; }
.asl-static .asl-track { animation: none; transform: translateY(-22%); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "duplicate" | "wrap";
}[] = [
  {
    name: "Duplicate copy",
    desc: "same screenshot rendered twice, 200% track height",
    kind: "duplicate",
  },
  {
    name: "Seamless wrap",
    desc: "translateY 0 → -50%, linear — one copy's height, no seam",
    kind: "wrap",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "duplicate") {
    return (
      <span className="flex h-3 w-5 flex-col justify-between">
        <span className="h-1 w-full rounded-sm bg-[var(--foreground)]/25" />
        <span className="h-1 w-full rounded-sm bg-[var(--foreground)]/25" />
      </span>
    );
  }
  return (
    <span className="h-4 w-3 rounded-md border border-fd-border bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

function TrackContent() {
  return (
    <>
      <span className="h-14 shrink-0 rounded-lg bg-[var(--foreground)]/25" />
      <span className="h-2 w-3/4 shrink-0 rounded-full bg-[var(--foreground)]/25" />
      <span className="h-2 w-1/2 shrink-0 rounded-full bg-[var(--foreground)]/15" />
      <span className="h-14 shrink-0 rounded-lg bg-[var(--foreground)]/25" />
    </>
  );
}

export function AppShowcaseLoop() {
  return (
    <ScrollScene
      label="Why this technique"
      note="CSS track, not a per-frame transform"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${
            reduced ? "asl-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-56 w-28 overflow-hidden rounded-[22px] bg-[var(--muted)] p-2 shadow-xl">
            <div className="relative size-full overflow-hidden rounded-2xl bg-[var(--foreground)]/10">
              <div className="asl-track absolute inset-x-0 top-0 flex h-[200%] flex-col gap-3 p-3">
                <TrackContent />
                <TrackContent />
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            --as-loop: interval × 6s · default interval 4 → 24s per pass
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
