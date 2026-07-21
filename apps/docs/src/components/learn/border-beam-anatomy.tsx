"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * BorderBeam's geometry: a square rides `offsetPath: rect(0 auto auto 0
 * round ${size}px)`, while a dual-layer mask (padding-box ∩ border-box)
 * reveals only the border ring.
 */
const CSS = `
@keyframes bba-ring {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
.bba-ring { animation: bba-ring 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

@keyframes bba-beam {
  from { opacity: 0; transform: scale(0.5); }
  to   { opacity: 1; transform: scale(1); }
}
.bba-beam { animation: bba-beam 480ms cubic-bezier(0.3,0.7,0.4,1.2) 180ms both; }

@keyframes bba-fill {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.bba-fill { animation: bba-fill 400ms ease 320ms both; }

.bba-static .bba-ring,
.bba-static .bba-beam,
.bba-static .bba-fill { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Mask ring",
    desc: "mask-intersect: padding-box + border-box — only the border shows",
    kind: "mask",
  },
  {
    name: "Beam square",
    desc: "aspect-square, size px — longer streak when size grows",
    kind: "beam",
  },
  {
    name: "Host",
    desc: "absolute inset-0, rounded-[inherit], pointer-events-none",
    kind: "host",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "mask") {
    return (
      <span className="h-3.5 w-5 rounded-md bg-transparent ring-2 ring-[var(--foreground)]/40 ring-inset" />
    );
  }
  if (kind === "beam") {
    return (
      <span className="size-2.5 rounded-sm bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-5 rounded-md bg-[var(--muted)]/40 ring-1 ring-fd-border ring-inset" />
  );
}

export function BorderBeamAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="mask ring · offsetPath square">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "bba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex size-[200px] items-center justify-center">
            {/* Host card — the beam is a child of this box (inset-0 in the real
                component), so keep the square fully inside the silhouette. */}
            <div className="bba-fill absolute inset-4 overflow-hidden rounded-2xl border border-fd-border bg-[var(--muted)]/40">
              {/* Mask ring stand-in: hollow frame along the host edge */}
              <div
                className="bba-ring absolute inset-0 rounded-2xl border-[3px] border-[var(--foreground)]/35"
                style={
                  {
                    maskImage:
                      "linear-gradient(#000,#000), linear-gradient(#000,#000)",
                    maskClip: "padding-box, border-box",
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                  } as CSSProperties
                }
              />

              {/* Beam square parked on the top edge, fully inside the host */}
              <div className="bba-beam absolute top-0 left-1/2 size-10 -translate-x-1/2 rounded-sm bg-[var(--foreground)]/50" />
            </div>
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
