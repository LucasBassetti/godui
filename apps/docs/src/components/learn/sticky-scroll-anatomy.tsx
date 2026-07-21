"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two columns share one `active` index: a scrolling list on the left, and a
 * `position: sticky` panel on the right that always shows the active item's
 * `content`. Nothing about their DOM nesting couples them — only the index
 * an `IntersectionObserver` writes to state.
 */
const CSS = `
@keyframes ssta-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.ssta-col { opacity: 0; animation: ssta-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.ssta-static .ssta-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "List",
    desc: "scrolls; each item dims when it isn't active",
    swatch:
      "h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Center line",
    desc: "rootMargin -50%/-50% — the one trigger line",
    swatch:
      "h-0 w-8 border-t-2 border-dashed border-[var(--foreground)]/40 bg-transparent",
  },
  {
    name: "Panel",
    desc: "sticky, crossfades to match the active item",
    swatch:
      "relative h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
];

export function StickyScrollAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one active index, two columns">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative grid w-full grid-cols-2 gap-6 ${reduced ? "ssta-static" : ""}`}
          >
            <div
              className="ssta-col flex flex-col gap-4"
              style={{ animationDelay: "0ms" }}
            >
              <div className="flex items-center gap-2 opacity-40">
                <span className="h-6 w-1 rounded-full bg-[var(--foreground)]/40" />
                <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/30" />
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[var(--foreground)]" />
                <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/70" />
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <span className="h-6 w-1 rounded-full bg-[var(--foreground)]/40" />
                <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/30" />
              </div>
            </div>

            <div
              className="ssta-col flex h-24 items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] shadow-md"
              style={{ animationDelay: "90ms" }}
            >
              <span className="size-10 rounded-lg bg-[var(--foreground)]" />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 border-t-2 border-dashed border-[var(--foreground)]/40"
            />
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                {item.name === "Panel" ? (
                  <span className={item.swatch}>
                    <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[var(--foreground)]" />
                  </span>
                ) : (
                  <span className={item.swatch} />
                )}
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
