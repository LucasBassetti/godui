"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Bar variant: a `motion.div` with `role="progressbar"`, pinned `fixed` (or
 * `sticky` inside a scroll container), `origin-left`, and `scaleX` driven by
 * the spring-smoothed scroll progress.
 */

const CSS = `
@keyframes spa-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes spa-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.spa-bar { animation: spa-fill 2.4s cubic-bezier(0.3,0.7,0.4,1) 200ms both; }
.spa-shell { animation: spa-in 500ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.spa-static .spa-bar { animation: none; transform: scaleX(0.55); }
.spa-static .spa-shell { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Bar",
    desc: "scaleX(progress), origin-left",
    swatch: "h-1 w-8 rounded-full bg-[var(--foreground)]/70",
  },
  {
    name: "Pin",
    desc: "fixed · or sticky with container",
    swatch:
      "h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "A11y",
    desc: 'role="progressbar"',
    swatch:
      "h-1 w-8 rounded-full bg-[var(--foreground)]/70 ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function ScrollProgressAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="pinned bar · origin-left · scaleX">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "spa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="spa-shell relative w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
            <div className="relative h-1 w-full bg-[var(--muted)]">
              <span className="spa-bar absolute inset-y-0 left-0 w-full origin-left bg-[var(--foreground)]/70" />
            </div>
            <div className="flex flex-col gap-2.5 p-5">
              <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-full rounded-full bg-[var(--muted)]" />
              <span className="h-2 w-4/5 rounded-full bg-[var(--muted)]" />
              <span className="h-2 w-3/5 rounded-full bg-[var(--muted)]" />
            </div>
          </div>

          <p className="font-mono text-[11px] text-fd-muted-foreground">
            {"style={{ scaleX: progress }} · origin-left"}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={`${item.swatch}`} />
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
