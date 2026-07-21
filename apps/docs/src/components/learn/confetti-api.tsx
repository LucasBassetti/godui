"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three call sites, one canvas-confetti core: ConfettiButton (click),
 * Confetti ref.fire(), and the bare confetti() helper. All merge DEFAULTS
 * with disableForReducedMotion: true.
 */
const CSS = `
@keyframes cfapi-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cfapi-card { animation: cfapi-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }

@keyframes cfapi-pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 0.9; transform: scale(1.08); }
}
.cfapi-pulse { animation: cfapi-pulse 1.6s ease-in-out infinite var(--d); }

.cfapi-static .cfapi-card { animation: none; opacity: 1; transform: none; }
.cfapi-static .cfapi-pulse { animation: none; opacity: 0.7; transform: none; }
`;

const APIS = [
  {
    name: "ConfettiButton",
    desc: "click → rect origin → fire",
    d: "0ms",
    shape: "btn",
  },
  {
    name: "Confetti.fire()",
    desc: "imperative ref — toast()-style",
    d: "100ms",
    shape: "ref",
  },
  {
    name: "confetti()",
    desc: "bare helper for non-React sites",
    d: "200ms",
    shape: "fn",
  },
] as const;

const LEGEND = [
  {
    name: "ConfettiButton",
    desc: "click → rect origin → fire",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Confetti.fire()",
    desc: "imperative ref — toast()-style ergonomics",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "confetti()",
    desc: "bare helper; all three honor disableForReducedMotion",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function ConfettiApi() {
  return (
    <ScrollScene label="Three APIs" note="button · ref.fire · confetti()">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "cfapi-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 gap-3">
            {APIS.map((api) => (
              <div
                key={api.name}
                className="cfapi-card flex flex-col items-center justify-center gap-3 rounded-xl border border-fd-border bg-[var(--card)]/70 p-5"
                style={{ "--d": api.d } as CSSProperties}
              >
                {api.shape === "btn" ? (
                  <div className="flex h-9 w-full items-center justify-center rounded-md bg-[var(--muted)]">
                    <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/30" />
                  </div>
                ) : null}
                {api.shape === "ref" ? (
                  <div className="relative flex size-10 items-center justify-center rounded-full border border-fd-border bg-[var(--muted)]">
                    <span
                      className="cfapi-pulse size-2.5 rounded-full bg-[var(--foreground)]/50"
                      style={{ "--d": "0ms" } as CSSProperties}
                    />
                  </div>
                ) : null}
                {api.shape === "fn" ? (
                  <div className="flex size-10 items-center justify-center rounded-lg border border-dashed border-fd-border bg-[var(--muted)]/50">
                    <span className="h-1 w-5 rounded-full bg-[var(--foreground)]/35" />
                  </div>
                ) : null}
              </div>
            ))}
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
