"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `resolved` drives two systems on the same pin at once: the Framer
 * `animate={{ scale: resolved ? 0.85 : 1 }}` spring (transform, on
 * `motion.button`), and a plain CSS `transition-[filter,opacity]` in the
 * className string for the grayscale + 60% opacity. Neither waits for the
 * other — they just happen to land on the same element.
 */
const CSS = `
@keyframes cpr-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cpr-col { opacity: 0; animation: cpr-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cpr-static .cpr-col { opacity: 1; animation: none; transform: none; }
`;

export function CommentPinResolved() {
  return (
    <ScrollScene label="Active vs resolved" note="scale + filter, two systems">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "cpr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="grid w-full grid-cols-2 items-center justify-items-center gap-6"
          >
            <div
              className="cpr-col flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="flex size-9 items-center justify-center rounded-full rounded-bl-sm bg-[var(--primary)] shadow-md ring-2 ring-fd-card">
                <span className="size-1.5 rounded-full bg-white" />
              </span>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                scale: 1
              </p>
            </div>

            <div
              className="cpr-col flex flex-col items-center gap-3"
              style={{ "--d": "140ms" } as CSSProperties}
            >
              <span className="flex size-9 scale-[0.85] items-center justify-center rounded-full rounded-bl-sm bg-[var(--primary)] shadow-md ring-2 ring-fd-card [filter:grayscale(1)] [opacity:0.6]">
                <span className="size-1.5 rounded-full bg-white" />
              </span>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                scale: 0.85
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-full rounded-bl-sm bg-[var(--primary)] shadow-sm ring-2 ring-fd-card">
                <span className="size-1 rounded-full bg-white" />
              </span>
              <dt className="font-medium text-[13px] text-fd-foreground">
                Active
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                animate spring only, full color, scale 1
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex size-4 scale-[0.85] items-center justify-center rounded-full rounded-bl-sm bg-[var(--primary)] shadow-sm ring-2 ring-fd-card [filter:grayscale(1)] [opacity:0.6]">
                <span className="size-1 rounded-full bg-white" />
              </span>
              <dt className="font-medium text-[13px] text-fd-foreground">
                Resolved
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                spring scale 0.85 + CSS transition-[filter,opacity]
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
