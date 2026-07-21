"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `CONTAINER_BY_VARIANT` only swaps the wrapper's layout classes — `grid
 * grid-cols-1 gap-2 sm:grid-cols-2` for `grid`, `flex flex-wrap gap-2` for
 * `chips`, `flex flex-col gap-1.5` for `list`. Every item inside is the same
 * `motion.button`; only its own className branches on `isChip` for the pill
 * shape vs. the card shape (icon slot, hint line, trailing arrow).
 */
const CSS = `
@keyframes psa-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.psa-item { opacity: 0; animation: psa-in 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.psa-static .psa-item { opacity: 1; animation: none; transform: none; }
`;

function TokenBar({ w = "w-10", tone = 30 }: { w?: string; tone?: number }) {
  return (
    <span
      className={`h-2 ${w} rounded-full bg-[var(--foreground)]`}
      style={{ opacity: tone / 100 }}
    />
  );
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "grid" | "chips" | "list";
}[] = [
  {
    name: "Grid",
    desc: "grid grid-cols-1 sm:grid-cols-2 · card + hint + arrow",
    kind: "grid",
  },
  {
    name: "Chips",
    desc: "flex flex-wrap · rounded-full pill, no hint",
    kind: "chips",
  },
  {
    name: "List",
    desc: "flex flex-col · full-width row + arrow",
    kind: "list",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "grid") {
    return (
      <span className="h-4 w-5 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "chips") {
    return (
      <span className="h-2.5 w-7 rounded-full border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-2.5 w-8 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function PromptSuggestionsAnatomy() {
  return (
    <ScrollScene
      label="Anatomy"
      note="CONTAINER_BY_VARIANT swaps the wrapper, not the item"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[620px] flex-col items-center gap-8 ${reduced ? "psa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {/* grid — 2x2 cards */}
            <div className="flex flex-col items-center gap-3">
              <div className="grid w-full grid-cols-2 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="psa-item flex flex-col gap-1.5 rounded-lg border border-border bg-[var(--card)] p-2"
                    style={{ "--d": `${i * 40}ms` } as CSSProperties}
                  >
                    <TokenBar w="w-8" tone={35} />
                    <TokenBar w="w-6" tone={18} />
                  </div>
                ))}
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                grid
              </p>
            </div>

            {/* chips — wrapped pill row */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-1.5">
                {["w-10", "w-14", "w-8", "w-12"].map((w, i) => (
                  <span
                    key={w}
                    className="psa-item inline-flex items-center rounded-full border border-border bg-[var(--card)] px-2.5 py-1.5"
                    style={{ "--d": `${160 + i * 40}ms` } as CSSProperties}
                  >
                    <TokenBar w={w} tone={30} />
                  </span>
                ))}
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                chips
              </p>
            </div>

            {/* list — full-width rows */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex w-full flex-col gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="psa-item flex items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-2.5 py-2"
                    style={{ "--d": `${320 + i * 40}ms` } as CSSProperties}
                  >
                    <TokenBar w="w-16" tone={30} />
                    <span className="ml-auto size-2 rounded-full bg-[var(--foreground)]/20" />
                  </div>
                ))}
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                list
              </p>
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
