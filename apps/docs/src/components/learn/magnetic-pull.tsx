"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The sensor math made visible: the cursor moves, the raw target tracks it
 * instantly at `strength`, and the shell chases that target through an
 * underdamped spring — lagging a beat, overshooting, then settling.
 */
const CSS = `
@keyframes mpull-cursor {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(70px); }
  75%      { transform: translateX(-70px); }
}
@keyframes mpull-target {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(28px); }
  75%      { transform: translateX(-28px); }
}
@keyframes mpull-shell {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(28px); }
  75%      { transform: translateX(-28px); }
}
.mpull-cursor { animation: mpull-cursor 4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
.mpull-target { animation: mpull-target 4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
.mpull-shell  { animation: mpull-shell 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite 80ms; }
.mpull-static .mpull-cursor,
.mpull-static .mpull-target,
.mpull-static .mpull-shell {
  animation: none;
  transform: translateX(0);
}
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "cursor" | "target" | "shell";
}[] = [
  { name: "Cursor", desc: "clientX inside the sensor", kind: "cursor" },
  {
    name: "Raw target",
    desc: "(x − cx) × strength, no easing",
    kind: "target",
  },
  {
    name: "Spring shell",
    desc: "170 / 12 / 0.1 — lags, then overshoots",
    kind: "shell",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "cursor") {
    return (
      <span className="size-2.5 rounded-full bg-black/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "target") {
    return (
      <span className="h-3.5 w-6 rounded-[10px] border-2 border-dashed border-black/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-6 rounded-[10px] border border-fd-border bg-[var(--card)] shadow-sm ring-1 ring-fd-border ring-inset" />
  );
}

export function MagneticPull() {
  return (
    <ScrollScene label="The pull" note="delta × strength, into a spring">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative flex w-full flex-col gap-5 ${reduced ? "mpull-static" : ""}`}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 border-l border-dashed border-black/20"
            />

            <div className="relative flex h-6 items-center justify-center">
              <span className="mpull-cursor absolute size-2.5 rounded-full bg-black/70" />
            </div>

            <div className="relative flex h-10 items-center justify-center">
              <span className="mpull-target absolute h-9 w-24 rounded-[10px] border-2 border-dashed border-black/50" />
            </div>

            <div className="relative flex h-10 items-center justify-center">
              <span className="mpull-shell absolute h-9 w-24 rounded-[10px] border border-fd-border bg-[var(--card)] shadow-sm" />
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
