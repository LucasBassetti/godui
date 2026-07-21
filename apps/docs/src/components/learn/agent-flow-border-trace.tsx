"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `borderTracePaths(w, h)` from the real component: two symmetric outlines
 * that both start at the left-edge centre and run out over the top/bottom to
 * meet at the right-edge centre. Reproduced here for a 220×64 card (r = 12)
 * so the `d` strings match the source formula exactly, then drawn with a
 * pathLength `stroke-dashoffset` tween — the CSS analogue of Motion's
 * `pathLength: 0 → 1`. The icon lights at the midpoint of the draw, not the
 * end — the same `setTimeout(traceDuration * 1000 / 2)` the card uses.
 */
const W = 220;
const H = 64;
const R = 12;
const TOP = `M 0,${H / 2} L 0,${R} A ${R},${R} 0 0 1 ${R},0 L ${W - R},0 A ${R},${R} 0 0 1 ${W},${R} L ${W},${H / 2}`;
const BOTTOM = `M 0,${H / 2} L 0,${H - R} A ${R},${R} 0 0 0 ${R},${H} L ${W - R},${H} A ${R},${R} 0 0 0 ${W},${H - R} L ${W},${H / 2}`;

const CSS = `
@keyframes abt-border {
  0%      { stroke-dashoffset: 1; opacity: 1; }
  25%     { stroke-dashoffset: 0; opacity: 1; }
  75%     { stroke-dashoffset: 0; opacity: 1; }
  85%     { stroke-dashoffset: 0; opacity: 0; }
  85.01%  { stroke-dashoffset: 1; opacity: 0; }
  100%    { stroke-dashoffset: 1; opacity: 0; }
}
@keyframes abt-icon {
  0%, 11%  { transform: scale(0.55); opacity: 0.4; }
  12.5%    { transform: scale(1.2); opacity: 1; }
  18%      { transform: scale(1); opacity: 1; }
  75%      { transform: scale(1); opacity: 1; }
  85%      { transform: scale(0.55); opacity: 0.4; }
  100%     { transform: scale(0.55); opacity: 0.4; }
}
.abt-border { animation: abt-border 4s linear infinite; }
.abt-icon   { animation: abt-icon 4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.abt-static .abt-border { animation: none; stroke-dashoffset: 0; opacity: 1; }
.abt-static .abt-icon   { animation: none; transform: none; opacity: 1; }
`;

export function AgentFlowBorderTrace() {
  return (
    <ScrollScene
      label="The border trace"
      note="pathLength 0→1 · linear · ≈1s at flowSpeed 280"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "abt-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative flex items-center gap-3 rounded-xl border border-fd-border bg-[var(--card)] p-3 shadow-sm"
            style={{ width: W, height: H }}
          >
            <svg
              aria-hidden="true"
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              fill="none"
              className="pointer-events-none absolute inset-0 overflow-visible"
            >
              {[TOP, BOTTOM].map((d) => (
                <path
                  key={d}
                  className="abt-border"
                  d={d}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1 }}
                />
              ))}
            </svg>

            <span className="abt-icon relative z-raised flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="relative z-raised flex min-w-0 flex-1 flex-col gap-2">
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/40" />
              <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/20" />
            </span>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"duration = borderOutlineLength(w, h) / flowSpeed"}
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
