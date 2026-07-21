"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * rAF loop: cur += (target − cur) * ease (default 0.16). When idle
 * (!hovering && !pinned), target drifts on a slow ellipse
 * (cos 0.6 · 18%w, sin 0.8 · 16%h). Click toggles pinned. Reduced:
 * no rAF — static center mask.
 *
 * Scene stand-in: oversized cover with a centered inverted radial mask;
 * translating the cover moves the hole (compositor-only).
 */
const CSS = `
@keyframes srf-drift {
  0%   { transform: translate(0%, 0%); }
  25%  { transform: translate(14%, -10%); }
  50%  { transform: translate(0%, -16%); }
  75%  { transform: translate(-14%, -10%); }
  100% { transform: translate(0%, 0%); }
}
@keyframes srf-pin {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.75; transform: scale(1.1); }
}
.srf-cover { animation: srf-drift 5s linear infinite; }
.srf-pin-dot { animation: srf-pin 5s ease infinite; }
.srf-static .srf-cover {
  animation: none;
  transform: none;
}
.srf-static .srf-pin-dot { animation: none; opacity: 0.4; transform: none; }
`;

const MASK =
  "radial-gradient(circle 40px at 50% 50%, transparent 0, transparent 18px, #000 40px)";

const LEGEND = [
  {
    name: "Idle drift",
    desc: "ellipse when !hovering && !pinned",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Eased follow",
    desc: "cur += (target − cur) × 0.16 per frame",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Pinned",
    desc: "click toggles — target freezes until unpin",
    swatch: "bg-[var(--foreground)]/55",
  },
] as const;

export function SpotlightRevealFollow() {
  return (
    <ScrollScene label="Follow + breathe" note="rAF ease 0.16 · idle ellipse">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "srf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-[180px] w-[260px] overflow-hidden rounded-xl border border-fd-border">
            {/* Reveal underneath */}
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground)]/80">
              <span className="h-2 w-14 rounded-full bg-[var(--background)]/40" />
            </div>

            {/* Oversized cover — translate moves the hole */}
            <div
              aria-hidden="true"
              className="srf-cover absolute bg-[var(--card)]"
              style={{
                width: "160%",
                height: "160%",
                left: "-30%",
                top: "-30%",
                WebkitMaskImage: MASK,
                maskImage: MASK,
              }}
            />

            <div
              aria-hidden="true"
              className="srf-pin-dot pointer-events-none absolute right-4 bottom-4 size-2 rounded-full bg-[var(--foreground)]/50"
            />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"cur.x += (target.x - cur.x) * ease"}
          </p>

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
