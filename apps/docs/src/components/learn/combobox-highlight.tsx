"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `highlight(label, query)` doesn't restyle the whole label — it finds the
 * query with a case-insensitive `indexOf`, then splices the string into three
 * pieces: `slice(0, idx)`, the match wrapped in a `<mark>`, and
 * `slice(idx + query.length)`. Only the middle span carries weight; the rest
 * stays as-is. Here each row's matched segment brightens in place — the query
 * lands at a different offset per row, exactly as `indexOf` returns it.
 */

/** [prefix, match, suffix] widths as flex-grow units per row. */
const ROWS: [number, number, number][] = [
  [0, 3, 5],
  [2, 3, 4],
  [1, 3, 6],
  [4, 3, 2],
];

const CSS = `
@keyframes ch-row  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@keyframes ch-mark { from { opacity: 0.2; } to { opacity: 1; } }
.ch-row  { opacity: 0; animation: ch-row 300ms ease var(--d) both; }
.ch-mark { opacity: 0.2; animation: ch-mark 320ms ease var(--dm) both; }
.ch-static .ch-row  { opacity: 1; animation: none; transform: none; }
.ch-static .ch-mark { opacity: 1; animation: none; }
`;

export function ComboboxHighlight() {
  return (
    <ScrollScene label="Highlight" note="the match is spliced, not restyled">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full max-w-[288px] flex-col gap-1 rounded-xl border border-border bg-[var(--card)] p-1 shadow-xl ${reduced ? "ch-static" : ""}`}
          >
            {ROWS.map(([pre, match, post], i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                key={i}
                className="ch-row flex items-center rounded-lg px-3 py-2.5"
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
              >
                <span className="flex flex-1 items-center gap-0.5">
                  {pre > 0 && (
                    <span
                      className="h-2 rounded-full bg-[var(--foreground)]/20"
                      style={{ flexGrow: pre, flexBasis: 0 }}
                    />
                  )}
                  <span
                    className="ch-mark h-2.5 rounded-full bg-[var(--foreground)]"
                    style={
                      {
                        flexGrow: match,
                        flexBasis: 0,
                        "--dm": `${300 + i * 80}ms`,
                      } as CSSProperties
                    }
                  />
                  <span
                    className="h-2 rounded-full bg-[var(--foreground)]/20"
                    style={{ flexGrow: post, flexBasis: 0 }}
                  />
                </span>
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              "label.slice(0, idx) + <mark>match</mark> + label.slice(idx + len)"
            }
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
