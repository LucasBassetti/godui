"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes ebl-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ebl-el { animation: ebl-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ebl-static .ebl-el { animation: none; opacity: 1; transform: none; }
@keyframes ebl-breathe {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.04); }
}
.ebl-blob { animation: ebl-breathe 3.2s ease-in-out infinite; }
.ebl-static .ebl-blob { animation: none; opacity: 0.7; transform: none; }
`;

export function EffectBackgroundAlive() {
  return (
    <ScrollScene
      label="Still, not static"
      note="overlap reads as depth without rAF"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "ebl-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="ebl-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--muted)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="ebl-blob absolute top-[15%] left-[10%] size-28 rounded-full bg-black/15 blur-2xl" />
            <div
              className="ebl-blob absolute top-[10%] right-[12%] size-24 rounded-full bg-black/12 blur-2xl"
              style={{ animationDelay: "0.6s" }}
            />
            <div
              className="ebl-blob absolute bottom-[10%] left-[35%] size-32 rounded-full bg-black/10 blur-2xl"
              style={{ animationDelay: "1.1s" }}
            />
          </div>
          <p className="max-w-[36ch] text-center text-[13px] text-fd-muted-foreground">
            The real component is static CSS — this diagram only illustrates why
            overlapping soft ellipses feel alive.
          </p>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Overlap
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                no animation in production — paint does the work
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Cost
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                zero rAF, zero observers
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
