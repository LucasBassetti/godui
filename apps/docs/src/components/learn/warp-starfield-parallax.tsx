"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Field eases toward a drifting center (lerp 0.06). Theme tokens only —
 * same grayscale language as the rest of Learn.
 */
const CSS = `
@keyframes wsp-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.wsp-el { animation: wsp-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.wsp-static .wsp-el { animation: none; opacity: 1; transform: none; }

@keyframes wsp-shift {
  0%, 100% { transform: translate(-10px, 6px); }
  50% { transform: translate(12px, -8px); }
}
.wsp-field { animation: wsp-shift 3.2s ease-in-out infinite; }
.wsp-static .wsp-field { animation: none; }

@keyframes wsp-cursor {
  0%, 100% { transform: translate(-18px, 10px); }
  50% { transform: translate(20px, -12px); }
}
.wsp-cursor { animation: wsp-cursor 3.2s ease-in-out infinite; }
.wsp-static .wsp-cursor { animation: none; transform: translate(8px, -4px); }
`;

const DOTS = Array.from({ length: 20 }, (_, i) => ({
  id: `wsp-${i}`,
  left: 10 + ((i * 37) % 80),
  top: 14 + ((i * 53) % 72),
}));

export function WarpStarfieldParallax() {
  return (
    <ScrollScene label="Parallax" note="lerp 0.06 · parallax=30">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "wsp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="wsp-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="wsp-field absolute inset-0">
              {DOTS.map((d) => (
                <div
                  key={d.id}
                  className="absolute size-1 rounded-full bg-[var(--foreground)]/55"
                  style={{ left: `${d.left}%`, top: `${d.top}%` }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/40" />
            </div>

            {/* pointer target leading the field */}
            <div
              aria-hidden="true"
              className="wsp-cursor absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--foreground)]/45"
            />
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            The ring is the pointer target; the field lags behind at{" "}
            <span className="font-mono text-[12px]">× 0.06</span> per frame —
            never a hard snap. Leave and targets ease back to center.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Lerp
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {"pointer.x += (tx − x) × 0.06"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Center
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {"cx = w/2 + x × parallax"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
