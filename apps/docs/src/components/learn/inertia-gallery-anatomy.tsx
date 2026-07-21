"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The real structure: a masked viewport clips the edges to a soft fade, a
 * single flex track holds every slide and carries the drag, and the
 * centered slide is just the one currently closest to distance-from-center
 * zero — no special "active" flag, only geometry.
 */
const CSS = `
@keyframes iga-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.iga-slide { opacity: 0; animation: iga-in 600ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both; }
.iga-static .iga-slide { opacity: 1; animation: none; transform: none; }
`;

const SLIDES = [0, 1, 2, 3, 4];
const CENTER = 2;

export function InertiaGalleryAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="masked viewport, one flex track">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative w-full overflow-hidden rounded-xl border border-white/10 py-4"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div
              key={cycle}
              className={`flex items-center justify-center gap-3 ${reduced ? "iga-static" : ""}`}
            >
              {SLIDES.map((i) => (
                <div
                  key={i}
                  className={`iga-slide shrink-0 rounded-lg ${
                    i === CENTER
                      ? "bg-[var(--foreground)]"
                      : "bg-[var(--foreground)]/30"
                  }`}
                  style={
                    {
                      "--d": `${i * 70}ms`,
                      width: i === CENTER ? 64 : 48,
                      height: i === CENTER ? 84 : 64,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-6 rounded-lg border border-[var(--foreground)]/20 bg-transparent ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Viewport
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                overflow-hidden, mask-image fade
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-4 rounded-lg bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Track
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                one flex row, drag=&quot;x&quot;
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-4 w-5 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Centered slide
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                distance-from-center is 0
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
