"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The row is one `motion.div` (flex-wrap, gap-2) of facet pills plus a trailing
 * "Clear all" affordance. Two pill states carry the whole component: an *empty*
 * facet — dashed ring, plus glyph, muted label — and an *active* facet — solid
 * surface, inline summary, and a clear button. Nothing here is a select element;
 * it's buttons and a popover.
 */
const PlusIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CloseIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const CSS = `
@keyframes fba-in {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}
.fba-pill { opacity: 0; animation: fba-in 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.fba-static .fba-pill { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Empty facet",
    desc: "dashed ring + plus — click to open its options",
    swatch: "border border-dashed border-border bg-transparent",
  },
  {
    name: "Active facet",
    desc: "solid fill, inline summary, and a clear button",
    swatch: "bg-[var(--muted)] border border-border",
  },
  {
    name: "Clear all",
    desc: "appears once any facet holds a selection",
    swatch: "bg-[var(--foreground)]/20",
  },
];

/** A stand-in label bar — no real copy lives on the diagram pills. */
function LabelBar({ w = "w-12", tone = 40 }: { w?: string; tone?: number }) {
  return (
    <span
      className={`h-2 ${w} rounded-full`}
      style={{ backgroundColor: `var(--foreground)`, opacity: tone / 100 }}
    />
  );
}

export function FilterBarAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one flex row · two pill states">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-wrap items-center justify-center gap-2 ${reduced ? "fba-static" : ""}`}
          >
            {/* Active facet — solid, inline summary + clear */}
            <div
              className="fba-pill flex h-8 items-center rounded-full border border-border bg-[var(--muted)] pr-1 pl-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <LabelBar />
              <span className="mx-1.5 h-3.5 w-px bg-[var(--foreground)]/20" />
              <LabelBar w="w-8" tone={30} />
              <span className="ml-1 flex size-6 items-center justify-center rounded-full text-muted-foreground">
                {CloseIcon}
              </span>
            </div>

            {/* Empty facets — dashed, plus, muted label */}
            {[80, 160].map((d) => (
              <div
                key={d}
                className="fba-pill flex h-8 items-center gap-1.5 rounded-full border border-border border-dashed px-3 text-muted-foreground"
                style={{ "--d": `${d}ms` } as CSSProperties}
              >
                {PlusIcon}
                <LabelBar tone={22} />
              </div>
            ))}

            {/* Clear all */}
            <span
              className="fba-pill ml-1"
              style={{ "--d": "240ms" } as CSSProperties}
            >
              <LabelBar w="w-10" tone={20} />
            </span>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-4 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
