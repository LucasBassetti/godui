"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two stacked layers inside the card: an absolute glyph stream (aria-hidden,
 * masked) and a content layer at `z-raised` that always sits above it.
 */
const CSS = `
@keyframes eca-explode {
  from { opacity: 0; transform: translateZ(var(--tz0)); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.eca-plate {
  position: absolute; inset: 0; margin: auto;
  opacity: 0; transform: translateZ(var(--tz));
  animation: eca-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.eca-static .eca-plate { opacity: 1; animation: none; }
`;

const LEGEND = [
  {
    name: "Glyph stream",
    desc: "absolute inset-0 · STREAM_LEN 1500 · aria-hidden",
    kind: "stream" as const,
  },
  {
    name: "Content",
    desc: "relative z-raised — children always on top",
    kind: "content" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "stream") {
    return (
      <span className="h-3 w-6 rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-lg bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function EncryptedCardAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="stream under · content over">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[200px] items-center justify-center [perspective:1000px] ${reduced ? "eca-static" : ""}`}
          >
            <div className="relative h-[120px] w-[200px] [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
              <div
                className="eca-plate overflow-hidden rounded-xl border border-fd-border bg-[var(--muted)] shadow-md"
                style={
                  {
                    "--tz": "0px",
                    "--tz0": "-24px",
                    "--d": "0ms",
                  } as CSSProperties
                }
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 select-none break-all p-2 font-mono text-[7px] leading-[1.15] tracking-[0.12em] text-[var(--foreground)]/35"
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static glyph filler rows
                    <span key={i}>
                      Ab3&lt;x9#Zm2[]kL7*/$qW4{"{"}yP8{"}"}nH1%
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="eca-plate flex flex-col items-start justify-center gap-2.5 rounded-xl border border-fd-border bg-[var(--card)] px-5 shadow-lg"
                style={
                  {
                    "--tz": "42px",
                    "--tz0": "12px",
                    "--d": "180ms",
                  } as CSSProperties
                }
              >
                <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
                <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/20" />
              </div>
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
