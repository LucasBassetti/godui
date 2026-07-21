"use client";

import type { CSSProperties, ReactNode } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three isolated stages of the same silhouette:
 * 1) source glow only  2) sharp conic wedges  3) oversized + blur + bottom fade
 * so the reader can map each layer before they stack in the real component.
 */
const CSS = `
@keyframes lra-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lra-el { animation: lra-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lra-static .lra-el { animation: none; opacity: 1; transform: none; }
`;

const SHARP_FAN =
  "repeating-conic-gradient(from 0deg at 50% 0%, transparent 0deg, rgba(0,0,0,0.45) 3deg, transparent 26deg)";

const SOFT_FAN =
  "repeating-conic-gradient(from 0deg at 50% 0%, transparent 0deg, rgba(0,0,0,0.28) 4deg, transparent 26deg)";

const LEGEND = [
  {
    name: "Source",
    desc: "ellipse glow parked just above the top edge",
  },
  {
    name: "Wedges",
    desc: "repeating-conic · one spoke every 360° / rayCount",
  },
  {
    name: "Soft fan",
    desc: "inset −50% · blur(8px) · mask fades downward",
  },
] as const;

function Stage({
  delay,
  children,
  caption,
}: {
  delay: string;
  children: ReactNode;
  caption: string;
}) {
  return (
    <div
      className="lra-el flex flex-1 flex-col items-center gap-2"
      style={{ "--d": delay } as CSSProperties}
    >
      <div className="relative h-36 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
        {children}
      </div>
      <span className="font-mono text-[11px] text-fd-muted-foreground">
        {caption}
      </span>
    </div>
  );
}

export function LightRaysAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="glow · wedges · soft fan">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "lra-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full gap-2 sm:gap-3">
            <Stage delay="0ms" caption="1 · source">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 70% 45% at 50% -8%, rgba(0,0,0,0.28), transparent 70%)",
                }}
              />
              <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/40" />
            </Stage>

            <Stage delay="100ms" caption="2 · wedges">
              <div
                className="absolute inset-0 origin-top"
                style={{ backgroundImage: SHARP_FAN }}
              />
              {/* pivot marker */}
              <div className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[var(--foreground)]/50" />
            </Stage>

            <Stage delay="200ms" caption="3 · soft">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 60% 40% at 50% -5%, rgba(0,0,0,0.16), transparent 70%)",
                }}
              />
              <div
                className="absolute inset-[-45%] origin-top"
                style={{
                  backgroundImage: SOFT_FAN,
                  filter: "blur(5px)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 8%, transparent 78%)",
                  maskImage:
                    "linear-gradient(to bottom, black 8%, transparent 78%)",
                }}
              />
              {/* dashed oversize hint */}
              <div className="pointer-events-none absolute inset-[-8%] rounded-xl border border-[var(--foreground)]/15 border-dashed" />
            </Stage>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Same top pivot in every plate. Plate 3 is plate 2 oversized,
            blurred, and faded — that&apos;s the volumetric look.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
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
