"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The ticker never springs on mount — useInView({ once: true }) opens the
 * gate, then setTimeout(delay) holds before motionValue.set(target). This
 * scene loops the viewport cross → delay pulse → spring kickoff.
 */
const CSS = `
@keyframes ntv-scroll {
  0%, 8%   { transform: translateY(36px); opacity: 0.35; }
  28%, 72% { transform: translateY(0);    opacity: 1; }
  92%, 100%{ transform: translateY(-28px); opacity: 0.2; }
}
@keyframes ntv-gate {
  0%, 22%  { opacity: 0.2; transform: scaleX(0.4); }
  30%, 48% { opacity: 1;   transform: scaleX(1); }
  58%, 100%{ opacity: 0.25; transform: scaleX(0.55); }
}
@keyframes ntv-delay {
  0%, 30%  { transform: scaleX(0); opacity: 0.3; }
  30%      { opacity: 1; }
  48%      { transform: scaleX(1); opacity: 1; }
  56%, 100%{ transform: scaleX(1); opacity: 0.35; }
}
@keyframes ntv-fire {
  0%, 46%  { opacity: 0.2; transform: scale(0.85); }
  54%, 78% { opacity: 1;   transform: scale(1); }
  90%, 100%{ opacity: 0.25; transform: scale(0.9); }
}
.ntv-scroll { animation: ntv-scroll 4s cubic-bezier(0.3, 0.7, 0.4, 1) infinite; }
.ntv-gate   { animation: ntv-gate 4s ease infinite; transform-origin: left center; }
.ntv-delay  { animation: ntv-delay 4s linear infinite; transform-origin: left center; }
.ntv-fire   { animation: ntv-fire 4s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.ntv-static .ntv-scroll { animation: none; opacity: 1; transform: none; }
.ntv-static .ntv-gate   { animation: none; opacity: 1; transform: scaleX(1); }
.ntv-static .ntv-delay  { animation: none; opacity: 1; transform: scaleX(1); }
.ntv-static .ntv-fire   { animation: none; opacity: 1; transform: none; }
`;

const STEPS: {
  name: string;
  desc: string;
  kind: "gate" | "delay" | "fire";
}[] = [
  {
    name: "in view",
    desc: "useInView(ref, { once: true })",
    kind: "gate",
  },
  {
    name: "delay",
    desc: "setTimeout(delay * 1000)",
    kind: "delay",
  },
  {
    name: "set target",
    desc: "motionValue.set(target)",
    kind: "fire",
  },
];

function LegendSwatch({ kind }: { kind: (typeof STEPS)[number]["kind"] }) {
  if (kind === "fire") {
    return (
      <span className="flex size-6 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)]">
        <span className="size-2.5 rounded-full bg-[var(--foreground)]" />
      </span>
    );
  }
  if (kind === "delay") {
    return (
      <span className="flex h-6 w-10 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] px-1.5">
        <span className="h-1.5 w-full rounded-full bg-[var(--foreground)]/65" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-10 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] px-1.5">
      <span className="h-1.5 w-full rounded-full bg-[var(--foreground)]/45" />
    </span>
  );
}

export function NumberTickerView() {
  return (
    <ScrollScene label="The gate" note="in view → delay → spring">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-7 ${reduced ? "ntv-static" : ""}`}
          >
            {/* Viewport frame + scrolling tile */}
            <div className="relative h-[120px] w-full max-w-[220px] overflow-hidden rounded-xl border border-fd-border">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[18%] border-t border-dashed border-[var(--foreground)]/35"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-[18%] border-t border-dashed border-[var(--foreground)]/35"
              />
              <div className="ntv-scroll absolute inset-x-6 top-1/2 flex h-12 -translate-y-1/2 items-center justify-center rounded-lg bg-[var(--muted)]">
                <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/35" />
              </div>
            </div>

            {/* Gate → delay → fire */}
            <div className="grid w-full grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-full items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] px-2">
                  <span className="ntv-gate h-1.5 w-full rounded-full bg-[var(--foreground)]/45" />
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  once
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-full items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] px-2">
                  <span className="ntv-delay h-1.5 w-full rounded-full bg-[var(--foreground)]/65" />
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  delay
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-full items-center justify-center rounded-lg border border-fd-border bg-[var(--card)]">
                  <span className="ntv-fire size-3 rounded-full bg-[var(--foreground)]" />
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  set()
                </p>
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {STEPS.map((item) => (
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
