"use client";

import { type CSSProperties, Fragment } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The trail is a `<nav>` wrapping a `<motion.ol>` of pill-shaped crumbs joined
 * by aria-hidden chevrons. Every crumb but the last is a link
 * (`text-muted-foreground`); the last is a plain span marked
 * `aria-current="page"` and filled with `bg-muted`. Crumbs cascade in from the
 * left, matching each `motion.li`'s `initial={{ opacity: 0, x: -6 }}`.
 */
const CRUMBS: { w: string; current: boolean }[] = [
  { w: "w-10", current: false },
  { w: "w-14", current: false },
  { w: "w-12", current: false },
  { w: "w-12", current: true },
];

const CSS = `
@keyframes bca-in {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: none; }
}
.bca-crumb { opacity: 0; animation: bca-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.bca-static .bca-crumb { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Link crumb",
    desc: "navigable — text-muted-foreground",
    swatch: "bg-[var(--foreground)]/10",
  },
  {
    name: "Current crumb",
    desc: "aria-current='page', filled bg-muted",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Separator",
    desc: "aria-hidden chevron, one per gap",
    swatch: "bg-[var(--foreground)]/25",
  },
];

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-[var(--foreground)]/30"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function BreadcrumbsAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="pills, chevrons, one current page">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-center gap-0.5 ${reduced ? "bca-static" : ""}`}
          >
            {CRUMBS.map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length crumb trail
              <Fragment key={i}>
                {i > 0 && (
                  <span className="flex items-center px-0.5">
                    <Chevron />
                  </span>
                )}
                <div
                  className={`bca-crumb flex h-8 items-center gap-1.5 rounded-lg px-2 ${c.current ? "bg-[var(--muted)]" : "bg-[var(--foreground)]/[0.04]"}`}
                  style={{ "--d": `${i * 90}ms` } as CSSProperties}
                >
                  <span className="size-3.5 shrink-0 rounded-[4px] bg-[var(--foreground)]/25" />
                  <span
                    className={`h-2 ${c.w} rounded-full ${c.current ? "bg-[var(--foreground)]/55" : "bg-[var(--foreground)]/30"}`}
                  />
                </div>
              </Fragment>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
                />
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
