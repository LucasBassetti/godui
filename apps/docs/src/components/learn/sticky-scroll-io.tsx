"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `rootMargin: "-50% 0px -50% 0px"` shrinks the observer's root to a single
 * horizontal line at the container's vertical center — an item is
 * "intersecting" for the one instant it crosses that line, nothing more.
 * The track below scrolls continuously; each item lights up only while it's
 * passing the dashed line, which is the whole detection mechanism.
 */
const CSS = `
@keyframes ssio-track { from { transform: translateY(64px); } to { transform: translateY(-176px); } }
@keyframes ssio-h0 { 0%, 2% { opacity: 0; } 5% { opacity: 1; } 11%, 100% { opacity: 0; } }
@keyframes ssio-h1 { 0%, 30% { opacity: 0; } 38% { opacity: 1; } 46%, 100% { opacity: 0; } }
@keyframes ssio-h2 { 0%, 64% { opacity: 0; } 72% { opacity: 1; } 80%, 100% { opacity: 0; } }
.ssio-track { animation: ssio-track 4.5s linear infinite; }
.ssio-h0 { animation: ssio-h0 4.5s linear infinite; }
.ssio-h1 { animation: ssio-h1 4.5s linear infinite; }
.ssio-h2 { animation: ssio-h2 4.5s linear infinite; }
.ssio-static .ssio-track { animation: none; transform: translateY(-28px); }
.ssio-static .ssio-h0,
.ssio-static .ssio-h2 { animation: none; opacity: 0; }
.ssio-static .ssio-h1 { animation: none; opacity: 1; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "idle" | "crossing";
}[] = [
  {
    name: "Idle",
    desc: "not intersecting — index unchanged",
    kind: "idle",
  },
  {
    name: "Crossing",
    desc: "intersecting — setActive(index) fires",
    kind: "crossing",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "crossing") {
    return (
      <span className="relative h-3.5 w-8 overflow-hidden rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset">
        <span className="absolute inset-0 bg-[var(--foreground)]/70" />
      </span>
    );
  }
  return (
    <span className="h-3.5 w-8 rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function StickyScrollIo() {
  return (
    <ScrollScene label="The trigger" note="one line, whichever item crosses it">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-[168px] w-full max-w-[240px] overflow-hidden rounded-xl border border-fd-border ${reduced ? "ssio-static" : ""}`}
          >
            <div className="ssio-track absolute inset-x-0 top-0 flex flex-col items-center gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative h-14 w-40 shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]"
                >
                  <span
                    className={`absolute inset-0 ${i === 0 ? "ssio-h0" : i === 1 ? "ssio-h1" : "ssio-h2"} bg-[var(--foreground)]/70`}
                  />
                </div>
              ))}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 border-t-2 border-dashed border-[var(--foreground)]/60"
            />
          </div>
          <p className="font-mono text-[11px] text-fd-muted-foreground">
            {'rootMargin: "-50% 0px -50% 0px"'}
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
