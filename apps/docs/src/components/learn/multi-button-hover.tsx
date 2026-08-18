"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes mbh-rail-open {
  0% { transform: scaleX(0.16); }
  58%, 100% { transform: scaleX(1); }
}
@keyframes mbh-cell-open {
  0% { opacity: 0; transform: translateX(var(--from-x)) scale(0.25); }
  58%, 100% { opacity: 1; transform: none; }
}
@keyframes mbh-selected-open {
  0% { transform: scaleX(0.36); }
  58%, 100% { transform: scaleX(1); }
}
@keyframes mbh-divider-cycle {
  0%, 12% { opacity: 0; }
  42%, 58% { opacity: 1; }
  76%, 100% { opacity: 0; }
}
@keyframes mbh-label-in {
  0%, 68% { opacity: 0; transform: scale(0.25); filter: blur(4px); }
  100% { opacity: 1; transform: scale(1); filter: blur(0); }
}
.mbh-rail { transform-origin: left center; animation: mbh-rail-open 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.mbh-cell { animation: mbh-cell-open 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.mbh-selected { transform-origin: left center; animation: mbh-selected-open 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.mbh-divider { animation: mbh-divider-cycle 1000ms ease-out both; }
.mbh-label { transform-origin: left center; animation: mbh-label-in 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.mbh-static .mbh-rail,
.mbh-static .mbh-cell,
.mbh-static .mbh-selected,
.mbh-static .mbh-divider,
.mbh-static .mbh-label {
  opacity: 1;
  animation: none;
  transform: none;
  filter: none;
}
.mbh-static .mbh-divider { opacity: 0; }
`;

const CELLS = [
  { left: 0, width: 104, fromX: "0px", selected: true },
  { left: 105, width: 44, fromX: "-105px", selected: false },
  { left: 150, width: 44, fromX: "-150px", selected: false },
  { left: 195, width: 44, fromX: "-195px", selected: false },
] as const;

const LEGEND = [
  {
    name: "Rail surface",
    desc: "expands before any label is admitted",
    kind: "rail",
  },
  {
    name: "Action cells",
    desc: "every mapped option moves on the same beat",
    kind: "cell",
  },
  {
    name: "Label token",
    desc: "resolves only after the rail has room",
    kind: "label",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "label") {
    return <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/60" />;
  }
  if (kind === "cell") {
    return (
      <span className="flex items-center gap-0.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className="size-2.5 rounded-full bg-[var(--foreground)]/25 ring-1 ring-[var(--foreground)]/20 ring-inset"
          />
        ))}
      </span>
    );
  }
  return (
    <span className="h-4 w-10 rounded-full bg-[var(--foreground)]/16 ring-1 ring-[var(--foreground)]/25 ring-inset" />
  );
}

export function MultiButtonHover() {
  return (
    <ScrollScene
      label="The motion"
      note="four-item example · all cells together · label last"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[500px] flex-col items-center gap-8 ${reduced ? "mbh-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            aria-hidden="true"
            className="relative h-10 w-[239px]"
          >
            <span className="mbh-rail absolute inset-0 rounded-full bg-[var(--foreground)]" />
            {CELLS.map((cell) => (
              <span
                key={cell.left}
                className={`mbh-cell absolute top-0 flex h-10 items-center ${cell.selected ? "mbh-selected justify-start gap-2 bg-[var(--background)]/14 px-4" : "justify-center"}`}
                style={
                  {
                    left: cell.left,
                    width: cell.width,
                    "--from-x": cell.fromX,
                  } as CSSProperties
                }
              >
                <span className="size-2.5 shrink-0 rounded-full bg-[var(--background)]/75" />
                {cell.selected ? (
                  <span className="mbh-label h-2 w-12 rounded-full bg-[var(--background)]/75" />
                ) : null}
              </span>
            ))}
            {[104, 149, 194].map((left) => (
              <span
                key={left}
                className="mbh-divider absolute top-2.5 h-5 w-px bg-[var(--background)]/30"
                style={{ left }}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[10px] text-fd-muted-foreground">
            Four-item sample · every cell comes from items.map
          </p>

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
