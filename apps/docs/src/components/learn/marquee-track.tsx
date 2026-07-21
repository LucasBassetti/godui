"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Motion is pure CSS: `animate-marquee` / `animate-marquee-vertical` with
 * `--duration` from the `speed` prop. `reverse` flips `animation-direction`;
 * `pauseOnHover` pauses via `group-hover:[animation-play-state:paused]`.
 * `motion-reduce:animate-none` kills the track animation entirely.
 */

const CSS = `
@keyframes mqt-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - 0.5rem)); }
}
@keyframes mqt-pause {
  0%, 55%   { opacity: 0; transform: scale(0.85); }
  60%, 85%  { opacity: 1; transform: scale(1); }
  100%      { opacity: 0; transform: scale(0.85); }
}
.mqt-track {
  animation: mqt-scroll 4.5s linear infinite;
}
.mqt-track-rev {
  animation: mqt-scroll 4.5s linear infinite reverse;
}
.mqt-pause-dot {
  animation: mqt-pause 4.5s ease-in-out infinite;
}
.mqt-static .mqt-track,
.mqt-static .mqt-track-rev {
  animation: none;
  transform: translateX(-35%);
}
.mqt-static .mqt-pause-dot {
  animation: none;
  opacity: 1;
  transform: none;
}
`;

const CELLS = [0, 1, 2, 3] as const;

function Row({ reverse }: { reverse?: boolean }) {
  return (
    <div className="flex w-full overflow-hidden rounded-lg border border-fd-border bg-[var(--card)] p-2">
      <div
        className={`flex shrink-0 gap-2 ${reverse ? "mqt-track-rev" : "mqt-track"}`}
      >
        {CELLS.map((i) => (
          <span
            key={`a-${i}`}
            className="flex h-9 w-12 items-center justify-center rounded-md bg-[var(--muted)]"
          >
            <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/30" />
          </span>
        ))}
        {CELLS.map((i) => (
          <span
            key={`b-${i}`}
            className="flex h-9 w-12 items-center justify-center rounded-md border border-fd-border bg-[var(--card)]"
          >
            <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/30" />
          </span>
        ))}
      </div>
    </div>
  );
}

const LEGEND = [
  {
    name: "Duration",
    desc: "--duration from speed prop",
    kind: "duration" as const,
  },
  {
    name: "Reverse",
    desc: "animation-direction: reverse",
    kind: "reverse" as const,
  },
  {
    name: "Pause",
    desc: "group-hover play-state paused",
    kind: "pause" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pause") {
    return (
      <span className="size-2.5 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "reverse") {
    return (
      <span className="h-3 w-5 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-5 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function MarqueeTrack() {
  return (
    <ScrollScene
      label="The motion"
      note="CSS keyframes · reverse · pauseOnHover"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "mqt-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-3">
            <Row />
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              animate-marquee · --duration
            </p>
            <Row reverse />
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              [animation-direction:reverse]
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="mqt-pause-dot size-2.5 rounded-full bg-[var(--foreground)]/60" />
            <span className="font-mono text-[11px] text-fd-muted-foreground">
              group-hover:[animation-play-state:paused]
            </span>
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
