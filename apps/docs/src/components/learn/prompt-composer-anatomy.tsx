"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `PromptComposer` is one `<form>` with three stacked rows, always in this
 * order regardless of which props are set: an attachment row that collapses
 * to zero height when empty, the auto-growing textarea, and a toolbar
 * splitting attach + model picker (left) from the count + send button
 * (right). This scene draws the resting silhouette of all three.
 */
const CSS = `
@keyframes pca-row { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.pca-row { opacity: 0; animation: pca-row 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pca-static .pca-row { opacity: 1; animation: none; transform: none; }
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
  kind: "chips" | "field" | "send";
}[] = [
  {
    name: "Chips",
    desc: "AnimatePresence height, collapses to 0 when empty",
    kind: "chips",
  },
  {
    name: "Field",
    desc: "textarea, auto-grows to maxRows then scrolls",
    kind: "field",
  },
  {
    name: "Send",
    desc: "attach + model left, count + send right",
    kind: "send",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "chips") {
    return (
      <span className="inline-flex h-3.5 w-7 items-center rounded-lg border border-border bg-[var(--background)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "field") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3 rounded-xl bg-[var(--foreground)]/80 ring-1 ring-fd-border ring-inset" />
  );
}

export function PromptComposerAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one form, three stacked rows">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-8 ${reduced ? "pca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-[var(--card)] p-2.5 shadow-sm"
          >
            {/* chip row */}
            <div
              className="pca-row flex gap-1.5 px-0.5"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[var(--background)] py-1 pl-2 pr-2.5">
                <span className="size-2.5 shrink-0 rounded-sm bg-[var(--foreground)]/30" />
                <TokenBar w="w-10" tone={30} />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[var(--background)] py-1 pl-2 pr-2.5">
                <span className="size-2.5 shrink-0 rounded-sm bg-[var(--foreground)]/30" />
                <TokenBar w="w-6" tone={30} />
              </span>
            </div>

            {/* field */}
            <div
              className="pca-row flex flex-col gap-1.5 px-1.5 pt-1 pb-0.5"
              style={{ "--d": "90ms" } as CSSProperties}
            >
              <TokenBar w="w-full" tone={35} />
              <TokenBar w="w-2/3" tone={35} />
            </div>

            {/* toolbar */}
            <div
              className="pca-row flex items-center justify-between px-1"
              style={{ "--d": "180ms" } as CSSProperties}
            >
              <div className="flex items-center gap-1.5">
                <span className="flex size-8 items-center justify-center rounded-lg">
                  <span className="size-3.5 rounded-full border-2 border-[var(--foreground)]/30" />
                </span>
                <span className="inline-flex h-8 items-center gap-1 rounded-lg px-2">
                  <TokenBar w="w-10" tone={30} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TokenBar w="w-2" tone={20} />
                <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--foreground)]/80" />
              </div>
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
