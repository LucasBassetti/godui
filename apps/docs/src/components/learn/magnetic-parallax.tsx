"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Shell vs. label, isolated then composed. The label is a DOM child of the
 * button, so its own 0.4× transform stacks on top of whatever the shell is
 * already doing — the same nesting as `motion.span` inside `motion.button`.
 */
const CSS = `
@keyframes mpar-shell {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(26px); }
  75%      { transform: translateX(-26px); }
}
@keyframes mpar-label {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(10.4px); }
  75%      { transform: translateX(-10.4px); }
}
.mpar-shell { animation: mpar-shell 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
.mpar-label { animation: mpar-label 4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite; }
.mpar-static .mpar-shell,
.mpar-static .mpar-label {
  animation: none;
  transform: translateX(0);
}
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Shell",
    desc: "the whole button, full spring offset",
    swatch: "border border-fd-border bg-[var(--card)]",
  },
  {
    name: "Label",
    desc: "nested inside — adds its own ×0.4 (0 if staticLabel)",
    swatch: "bg-[var(--foreground)]",
  },
];

export function MagneticParallax() {
  return (
    <ScrollScene label="The parallax" note="shell × 1, label × 0.4, nested">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-center justify-items-center gap-3 sm:gap-6 ${reduced ? "mpar-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-14 w-28 items-center justify-center">
                <span className="mpar-shell absolute h-11 w-24 rounded-[10px] border border-fd-border bg-[var(--card)]" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                shell only
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-14 w-28 items-center justify-center">
                <span className="mpar-label absolute h-2 w-12 rounded-full bg-[var(--foreground)]/30" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                label only
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-14 w-28 items-center justify-center">
                <div className="mpar-shell absolute flex h-11 w-24 items-center justify-center rounded-[10px] border border-fd-border bg-[var(--card)]">
                  <span className="mpar-label h-2 w-12 rounded-full bg-[var(--foreground)]/30" />
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                together
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
