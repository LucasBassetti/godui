"use client";

import { Highlighter } from "@godui/components";

/**
 * Closing panel — the real Highlighter so the reader can watch annotate()
 * draw highlight / underline / box over live inline text.
 */
export function HighlighterResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll and resize
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-8 p-10">
        <p className="max-w-md text-center text-2xl leading-relaxed">
          The quick brown{" "}
          <Highlighter action="underline" color="#60a5fa" isView>
            fox
          </Highlighter>{" "}
          jumps over the{" "}
          <Highlighter action="highlight" isView>
            lazy dog
          </Highlighter>
          .
        </p>
        <p className="max-w-md text-center text-xl leading-relaxed text-fd-muted-foreground">
          Try a{" "}
          <Highlighter action="box" color="#f59e0b" isView>
            boxed phrase
          </Highlighter>{" "}
          or a{" "}
          <Highlighter action="circle" color="#34d399" isView>
            circled word
          </Highlighter>
          .
        </p>
      </div>
    </div>
  );
}
