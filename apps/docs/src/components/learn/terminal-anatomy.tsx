"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Terminal chrome (optional traffic lights + title) over a mono body.
 * Lines are abstract token bars — no typed copy on the diagram.
 */
const CSS = `
@keyframes ta-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.ta-el {
  opacity: 0;
  animation: ta-in 560ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.ta-static .ta-el { opacity: 1; animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Chrome",
    desc: "showChrome — traffic lights + optional title",
    swatch:
      "size-2.5 rounded-full bg-red-500/80 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Body",
    desc: "mono 13px, space-y-1, ligatures off",
    swatch:
      "h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Lines",
    desc: "command · output · comment color roles",
    swatch:
      "h-1.5 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset",
  },
] as const;

export function TerminalAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="chrome · body · line roles">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "ta-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="ta-el w-full max-w-[320px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-sm"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div
              className="ta-el flex items-center gap-2 border-b border-fd-border bg-[var(--muted)]/50 px-4 py-2.5"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-red-500/80" />
                <span className="size-2.5 rounded-full bg-yellow-500/80" />
                <span className="size-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="mx-auto h-1.5 w-16 rounded-full bg-[var(--foreground)]/20" />
              <span className="w-[42px]" aria-hidden="true" />
            </div>
            <div
              className="ta-el space-y-2.5 p-4"
              style={{ "--d": "220ms" } as CSSProperties}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-[var(--foreground)]/50" />
                <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/40" />
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span className="h-2 w-36 rounded-full bg-[var(--foreground)]/20" />
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-[var(--foreground)]/50" />
                <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/40" />
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/15" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
