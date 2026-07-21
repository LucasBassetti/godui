"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * A submenu is the same `MenuPanel`, recursed. Hover (or ArrowRight) sets
 * `openSub` to the row index; the nested panel renders `absolute left-full ml-1`
 * off that row with `side="right"` and `align="start"`, so its origin resolves to
 * `origin-top-left` and it springs out to the right from the parent row's corner.
 * Same spring, same component — one level deeper.
 */
const Chevron = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="ml-auto size-4 text-[var(--foreground)]/50"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CSS = `
@keyframes dmsub-open {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes dmsub-hi { from { opacity: 0; } to { opacity: 1; } }
.dmsub-hi    { opacity: 0; animation: dmsub-hi 200ms ease 140ms both; }
.dmsub-child { transform-origin: top left; opacity: 0; animation: dmsub-open 440ms cubic-bezier(0.34,1.56,0.64,1) 300ms both; }
.dmsub-static .dmsub-hi    { opacity: 1; animation: none; }
.dmsub-static .dmsub-child { opacity: 1; transform: none; animation: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "row" | "panel" | "origin";
}[] = [
  {
    name: "Parent row",
    desc: "hover or ArrowRight sets openSub",
    kind: "row",
  },
  {
    name: "Nested panel",
    desc: "side=right, align=start, left-full ml-1",
    kind: "panel",
  },
  {
    name: "origin-top-left",
    desc: "the corner it springs from",
    kind: "origin",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "row") {
    return (
      <span className="h-2 w-7 rounded-md bg-[var(--foreground)]/[0.08] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "panel") {
    return (
      <span className="h-3.5 w-6 rounded-xl border border-border bg-[var(--background)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-2 rounded-full bg-[var(--foreground)]/60 ring-2 ring-fd-card ring-inset" />
  );
}

function Row({ w, active }: { w: string; active?: boolean }) {
  return (
    <div className="relative flex h-9 items-center gap-2.5 rounded-lg px-2.5">
      {active ? (
        <span className="dmsub-hi absolute inset-0 rounded-lg bg-[var(--foreground)]/[0.08]" />
      ) : null}
      <span className="relative size-4 shrink-0 rounded bg-[var(--foreground)]/20" />
      <span
        className={`relative h-2 ${w} rounded-full bg-[var(--foreground)]/30`}
      />
      {active ? Chevron : null}
    </div>
  );
}

export function DropdownMenuSubmenu() {
  return (
    <ScrollScene label="Submenus" note="the same panel, recursed to the right">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[460px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative ${reduced ? "dmsub-static" : ""}`}
          >
            {/* Parent panel */}
            <div className="w-52 rounded-xl border border-border bg-[var(--background)] p-1 shadow-lg">
              <Row w="w-20" />
              <Row w="w-24" />
              {/* Submenu trigger row + its nested panel, anchored to the row. */}
              <div className="relative">
                <Row w="w-16" active />
                <div className="dmsub-child absolute top-0 left-full ml-1 w-48 rounded-xl border border-border bg-[var(--background)] p-1 shadow-xl">
                  <Row w="w-16" />
                  <Row w="w-20" />
                  <hr className="my-1 border-border border-t-0 border-b" />
                  <Row w="w-14" />
                </div>
              </div>
              <Row w="w-24" />
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
