"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes mba-settle {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
.mba-state {
  opacity: 0;
  animation: mba-settle 460ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms) both;
}
.mba-static .mba-state { opacity: 1; animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Action cell",
    desc: "one native button and its icon",
    kind: "cell",
  },
  {
    name: "Active label",
    desc: "lives inside the action that owns it",
    kind: "label",
  },
  {
    name: "Rest divider",
    desc: "separates cells until an action is active",
    kind: "divider",
  },
] as const;

function IconToken() {
  return (
    <span className="size-2.5 shrink-0 rounded-full bg-[var(--background)]/75" />
  );
}

function LabelToken() {
  return (
    <span className="h-2 w-12 shrink-0 rounded-full bg-[var(--background)]/75" />
  );
}

function RestRail() {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-[239px] items-stretch overflow-hidden rounded-full bg-[var(--foreground)]"
    >
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="contents">
          {index > 0 ? (
            <span className="my-2.5 w-px bg-[var(--background)]/30" />
          ) : null}
          <span className="flex w-[59px] items-center justify-center">
            <IconToken />
          </span>
        </div>
      ))}
    </div>
  );
}

function ActiveRail() {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-[239px] items-stretch overflow-hidden rounded-full bg-[var(--foreground)]"
    >
      <span className="flex w-11 items-center justify-center">
        <IconToken />
      </span>
      <span className="flex w-[107px] items-center gap-2 bg-[var(--background)]/14 px-4">
        <IconToken />
        <LabelToken />
      </span>
      <span className="flex w-11 items-center justify-center">
        <IconToken />
      </span>
      <span className="flex w-11 items-center justify-center">
        <IconToken />
      </span>
    </div>
  );
}

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "label") {
    return <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/55" />;
  }
  if (kind === "divider") {
    return <span className="h-5 w-px bg-[var(--foreground)]/45" />;
  }
  return (
    <span className="flex h-5 w-9 items-center justify-center rounded-full bg-[var(--foreground)]/14 ring-1 ring-[var(--foreground)]/20 ring-inset">
      <span className="size-1.5 rounded-full bg-[var(--foreground)]/65" />
    </span>
  );
}

export function MultiButtonAnatomy() {
  return (
    <ScrollScene
      label="Anatomy"
      note="four-item example · data-driven action cells · one stable rail"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[500px] flex-col items-center gap-8 ${reduced ? "mba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div key={cycle} className="grid items-center gap-x-4 gap-y-4">
            <span className="mba-state justify-self-end font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.16em] [grid-column:1] [grid-row:1]">
              rest
            </span>
            <div
              className="mba-state [grid-column:2] [grid-row:1]"
              style={{ "--delay": "0ms" } as CSSProperties}
            >
              <RestRail />
            </div>
            <span className="mba-state justify-self-end font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.16em] [grid-column:1] [grid-row:2]">
              active
            </span>
            <div
              className="mba-state [grid-column:2] [grid-row:2]"
              style={{ "--delay": "120ms" } as CSSProperties}
            >
              <ActiveRail />
            </div>
          </div>

          <p className="text-center font-mono text-[10px] text-fd-muted-foreground">
            Four-item sample · geometry maps any 2+ options
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
