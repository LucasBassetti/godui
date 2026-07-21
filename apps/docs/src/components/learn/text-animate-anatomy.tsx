"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * TextAnimate splits a string by `by` before animating. Word mode keeps
 * fewer, wider segments; character mode yields one short segment per glyph.
 * Token bars stand in for segments — no readable copy on the shapes.
 */
const CSS = `
@keyframes taa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.taa-col { opacity: 0; animation: taa-in 600ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both; }
.taa-static .taa-col { opacity: 1; animation: none; transform: none; }
`;

const WORD_WIDTHS = [48, 32, 56, 40];
const CHAR_WIDTHS = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: 'by="word"',
    desc: "split(/(\\s+)/) · fewer, wider segments",
    swatch:
      "h-2 w-10 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset",
  },
  {
    name: 'by="character"',
    desc: "[...text] · one segment per glyph",
    swatch:
      "h-2 w-2 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset",
  },
];

export function TextAnimateAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="split granularity · word vs character">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`grid w-full grid-cols-2 gap-6 ${reduced ? "taa-static" : ""}`}
          >
            <div
              className="taa-col flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div
                className="flex h-16 w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-4"
                aria-hidden="true"
              >
                {WORD_WIDTHS.map((w, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length token row
                    key={i}
                    className="h-2 rounded-full bg-[var(--foreground)]/30"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                word
              </p>
            </div>

            <div
              className="taa-col flex flex-col items-center gap-3"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div
                className="flex h-16 w-full flex-wrap items-center justify-center gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-4"
                aria-hidden="true"
              >
                {CHAR_WIDTHS.map((w, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length token row
                    key={i}
                    className="h-2 rounded-full bg-[var(--foreground)]/30"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                character
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
