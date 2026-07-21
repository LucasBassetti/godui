"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Real EncryptedCard: the stream is always painted; a soft radial mask
 * (`#000` at center → transparent) reveals glyphs only inside `--reveal`
 * at `--x`/`--y`. This scene must use mask-image the same way — a dark
 * overlay disc would hide instead of reveal.
 */
const STREAM = "Xy7#mK2<pQ9[]aZ4*/$nB6{wR1}tH8%Xy7#mK2<pQ9[]aZ4*/$nB6{wR1}tH8%";

const CSS = `
@property --mx {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 50%;
}
@property --my {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 50%;
}
@keyframes ecm-pointer {
  0%, 100% { --mx: 28%; --my: 32%; }
  35%      { --mx: 68%; --my: 42%; }
  70%      { --mx: 48%; --my: 72%; }
}
.ecm-stream {
  --mx: 50%;
  --my: 50%;
  animation: ecm-pointer 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  mask-image: radial-gradient(
    72px circle at var(--mx) var(--my),
    #000 0%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    72px circle at var(--mx) var(--my),
    #000 0%,
    transparent 100%
  );
}
.ecm-static .ecm-stream {
  animation: none;
  --mx: 50%;
  --my: 45%;
}

@keyframes ecm-ring {
  0%, 100% { left: 28%; top: 32%; }
  35%      { left: 68%; top: 42%; }
  70%      { left: 48%; top: 72%; }
}
.ecm-ring {
  animation: ecm-ring 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.ecm-static .ecm-ring {
  animation: none;
  left: 50%;
  top: 45%;
}
`;

const LEGEND = [
  {
    name: "Stream (full)",
    desc: "always painted · opacity gated by group-hover",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Radial mask",
    desc: "#000 inside → transparent outside · reveals, doesn't hide",
    swatch: "bg-[var(--foreground)]/40",
  },
] as const;

export function EncryptedCardMask() {
  return (
    <ScrollScene label="The reveal" note="mask follows --x / --y">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[200px] w-full max-w-[320px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "ecm-static" : ""}`}
          >
            {/* Full stream, revealed only inside the moving radial mask */}
            <div
              aria-hidden="true"
              className="ecm-stream absolute inset-0 select-none break-all p-3 font-mono text-[9px] leading-[1.15] tracking-[0.12em] text-[var(--foreground)]/55"
            >
              {Array.from({ length: 40 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static glyph filler rows
                <span key={i}>{STREAM}</span>
              ))}
            </div>

            {/* Outline only — shows where the reveal window sits; not a hide disc */}
            <div
              aria-hidden="true"
              className="ecm-ring pointer-events-none absolute size-[144px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={
                {
                  boxShadow:
                    "0 0 0 1px color-mix(in oklab, var(--foreground) 22%, transparent)",
                } as CSSProperties
              }
            />

            <div className="relative z-raised flex h-full flex-col justify-center gap-2.5 px-6">
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            mask-image: radial-gradient(var(--reveal) circle at var(--x)
            var(--y), #000, transparent)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
