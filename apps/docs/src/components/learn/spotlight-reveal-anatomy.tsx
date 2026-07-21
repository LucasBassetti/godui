"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two stacked layers: reveal underneath (absolute inset-0), cover on top
 * with an inverted radial mask punching a hole. Front-facing split —
 * concentric circles would occlude; columns map 1:1 to the prose.
 */
const CSS = `
@keyframes sra-in {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}
.sra-pane {
  opacity: 0;
  animation: sra-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d, 0ms) both;
}
.sra-static .sra-pane { opacity: 1; animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Reveal",
    desc: "absolute inset-0 underneath — the hidden layer",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "Cover",
    desc: "children on top, punched by the radial mask",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Together",
    desc: "mask hole follows --x/--y on the cover",
    swatch: "bg-[var(--muted)]",
  },
] as const;

export function SpotlightRevealAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="reveal under · cover masked">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "sra-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 items-center justify-items-center gap-3 sm:gap-5">
            <div
              className="sra-pane flex flex-col items-center gap-3"
              style={{ ["--d" as string]: "0ms" }}
            >
              <div className="flex h-24 w-28 items-center justify-center rounded-xl bg-[var(--foreground)]/80">
                <span className="h-2 w-10 rounded-full bg-[var(--background)]/40" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                reveal
              </p>
            </div>

            <div
              className="sra-pane flex flex-col items-center gap-3"
              style={{ ["--d" as string]: "120ms" }}
            >
              <div className="flex h-24 w-28 items-center justify-center rounded-xl border border-fd-border bg-[var(--card)]">
                <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                cover
              </p>
            </div>

            <div
              className="sra-pane flex flex-col items-center gap-3"
              style={{ ["--d" as string]: "240ms" }}
            >
              <div className="relative h-24 w-28 overflow-hidden rounded-xl border border-fd-border">
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground)]/80">
                  <span className="h-2 w-10 rounded-full bg-[var(--background)]/40" />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center bg-[var(--card)]"
                  style={{
                    maskImage:
                      "radial-gradient(circle 28px at 55% 45%, transparent 0, transparent 18px, #000 28px)",
                    WebkitMaskImage:
                      "radial-gradient(circle 28px at 55% 45%, transparent 0, transparent 18px, #000 28px)",
                  }}
                >
                  <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                masked
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
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
