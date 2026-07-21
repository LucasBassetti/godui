"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Spotlight reveal with fixed cells: a soft radial mask sweeps across a
 * stationary pixel field (cursorReveal="hidden"). The cursor ring leads;
 * the reveal disc lags slightly to stand in for the intensity lerp.
 */
const CSS = `
@keyframes pgr-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pgr-el { animation: pgr-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pgr-static .pgr-el { animation: none; opacity: 1; transform: none; }

@keyframes pgr-cursor {
  0%   { left: 14%; top: 24%; }
  30%  { left: 72%; top: 30%; }
  60%  { left: 58%; top: 68%; }
  100% { left: 22%; top: 52%; }
}
.pgr-cursor {
  animation: pgr-cursor 4.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Mask position lags the cursor — intensity lerp stand-in */
@keyframes pgr-mask {
  0%   { -webkit-mask-position: 8% 28%; mask-position: 8% 28%; opacity: 0.5; }
  30%  { -webkit-mask-position: 66% 34%; mask-position: 66% 34%; opacity: 1; }
  60%  { -webkit-mask-position: 52% 66%; mask-position: 52% 66%; opacity: 1; }
  100% { -webkit-mask-position: 16% 54%; mask-position: 16% 54%; opacity: 0.65; }
}
.pgr-lit {
  -webkit-mask-image: radial-gradient(circle 70px at center, #000 0%, #000 22%, transparent 70%);
  mask-image: radial-gradient(circle 70px at center, #000 0%, #000 22%, transparent 70%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 140px 140px;
  mask-size: 140px 140px;
  animation: pgr-mask 4.2s cubic-bezier(0.45, 0.05, 0.25, 1) infinite;
}

.pgr-static .pgr-cursor { animation: none; left: 42%; top: 44%; }
.pgr-static .pgr-lit {
  animation: none;
  -webkit-mask-position: 40% 42%;
  mask-position: 40% 42%;
  opacity: 1;
}
`;

const CELLS = Array.from({ length: 16 * 10 }, (_, i) => {
  const col = i % 16;
  const row = Math.floor(i / 16);
  return `pgr-${col}-${row}`;
});

const GRID_STYLE = {
  gridTemplateColumns: "repeat(16, 0.5rem)",
} as CSSProperties;

export function PixelGridReveal() {
  return (
    <ScrollScene label="Reveal" note="smoothstep spotlight · intensity lerp">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "pgr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="pgr-el relative h-44 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            {/* Dim baseline — hidden mode keeps almost nothing lit */}
            <div
              className="absolute inset-0 grid place-content-center gap-[3px] p-5 opacity-[0.07]"
              style={GRID_STYLE}
            >
              {CELLS.map((id) => (
                <div
                  key={`${id}-dim`}
                  className="size-2 rounded-[1px] bg-[var(--foreground)]"
                />
              ))}
            </div>

            {/* Lit field — cells stay put; only the soft mask travels */}
            <div
              className="pgr-lit absolute inset-0 grid place-content-center gap-[3px] p-5"
              style={GRID_STYLE}
            >
              {CELLS.map((id) => (
                <div
                  key={id}
                  className="size-2 rounded-[1px] bg-[var(--foreground)] opacity-75"
                />
              ))}
            </div>

            <div
              className="pgr-cursor pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--foreground)]/55 bg-[var(--foreground)]/25"
              aria-hidden="true"
            />
          </div>

          <p className="max-w-[38ch] text-center text-[13px] text-fd-muted-foreground">
            Watch the soft disc trail the ring — that lag is{" "}
            <span className="font-mono text-[12px]">intensity</span> catching up
            at <span className="font-mono text-[12px]">min(dt×8, 1)</span>. Edge
            softness is smoothstep{" "}
            <span className="font-mono text-[12px]">t²(3−2t)</span>.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Hidden
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                baseline off — cells only under the disc
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Falloff
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                interactionRadius=120 · smoothstep edge
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
