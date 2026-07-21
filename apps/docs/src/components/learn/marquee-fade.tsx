"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Edge fade is a CSS mask, not an overlay: `mask-image` linear-gradient from
 * transparent → black at 12% / 88% → transparent. Horizontal uses `to_right`;
 * vertical uses `to_bottom`. Same values on `-webkit-mask-image`.
 */

const CSS = `
@keyframes mqf-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - 0.5rem)); }
}
@keyframes mqf-mask {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.mqf-track { animation: mqf-scroll 5s linear infinite; }
.mqf-mask  { animation: mqf-mask 700ms cubic-bezier(0.3,0.7,0.4,1) 200ms both; }
.mqf-static .mqf-track { animation: none; transform: translateX(-30%); }
.mqf-static .mqf-mask  { animation: none; opacity: 1; }
`;

const CELLS = [0, 1, 2, 3, 4] as const;

const LEGEND = [
  {
    name: "Mask",
    desc: "linear-gradient transparent → black 12%/88%",
    kind: "mask" as const,
  },
  {
    name: "Horizontal",
    desc: "to_right on both mask-image props",
    kind: "horizontal" as const,
  },
  {
    name: "Vertical",
    desc: "to_bottom when direction is up/down",
    kind: "vertical" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "mask") {
    return (
      <span
        className="h-3 w-5 rounded-md ring-1 ring-fd-border ring-inset"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent, var(--foreground) 12%, var(--foreground) 88%, transparent)",
          opacity: 0.25,
        }}
      />
    );
  }
  if (kind === "vertical") {
    return (
      <span className="h-3 w-5 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-5 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function MarqueeFade() {
  return (
    <ScrollScene label="Edge fade" note="mask-image · not an overlay">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "mqf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] p-2">
              <div className="flex gap-2">
                {CELLS.map((i) => (
                  <span
                    key={i}
                    className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]"
                  >
                    <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/30" />
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              fade=false — hard clip at overflow
            </p>

            <div className="mqf-mask overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] p-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="mqf-track flex shrink-0 gap-2">
                {CELLS.map((i) => (
                  <span
                    key={`a-${i}`}
                    className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]"
                  >
                    <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/30" />
                  </span>
                ))}
                {CELLS.map((i) => (
                  <span
                    key={`b-${i}`}
                    className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-fd-border bg-[var(--card)]"
                  >
                    <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/30" />
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              fade=true — soft edges via mask
            </p>
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
