"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Simulates rough-notation's draw-in: a highlight fill and an underline both
 * grow with `scaleX` from the left (`transform-origin: left`). Color is
 * intentional here — the mark is the subject. Loops after scroll-in via
 * `key={cycle}` remount.
 */
const CSS = `
@keyframes hl-draw-in {
  0%, 8%    { transform: scaleX(0); }
  38%, 58%  { transform: scaleX(1); }
  88%, 100% { transform: scaleX(0); }
}
.hl-draw-mark {
  transform-origin: left center;
  animation: hl-draw-in 2.8s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.hl-draw-static .hl-draw-mark { animation: none; transform: scaleX(1); }

@keyframes hl-draw-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.hl-draw-panel { opacity: 0; animation: hl-draw-fade 460ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.hl-draw-static .hl-draw-panel { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "highlight" | "underline";
}[] = [
  {
    name: "Highlight",
    desc: "pale fill grows left → right behind the text",
    kind: "highlight",
  },
  {
    name: "Underline",
    desc: "stroke grows left → right under the text",
    kind: "underline",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "underline") {
    return (
      <span className="h-0.5 w-8 rounded-full bg-[#60a5fa] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-sm bg-[#ffd1dc] ring-1 ring-fd-border ring-inset" />
  );
}

export function HighlighterDraw() {
  return (
    <ScrollScene label="Draw-in" note="scaleX from the left, looping">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-10 ${reduced ? "hl-draw-static" : ""}`}
          >
            <div
              className="hl-draw-panel flex w-full max-w-[280px] flex-col items-center gap-3"
              style={{ animationDelay: "0ms" }}
            >
              <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-[10px] border border-fd-border bg-[var(--card)]">
                <span
                  aria-hidden="true"
                  className="hl-draw-mark absolute inset-x-4 inset-y-3 rounded-sm bg-[#ffd1dc]"
                />
                <span className="relative h-2 w-16 rounded-full bg-[var(--foreground)]/40" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                highlight · scaleX
              </p>
            </div>

            <div
              className="hl-draw-panel flex w-full max-w-[280px] flex-col items-center gap-3"
              style={{ animationDelay: "120ms" }}
            >
              <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-[10px] border border-fd-border bg-[var(--card)]">
                <span className="relative h-2 w-16 rounded-full bg-[var(--foreground)]/40" />
                <span
                  aria-hidden="true"
                  className="hl-draw-mark absolute inset-x-4 bottom-3 h-0.5 rounded-full bg-[#60a5fa]"
                  style={{ animationDelay: "0.35s" }}
                />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                underline · scaleX
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
