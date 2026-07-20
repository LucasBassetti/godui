"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `drag="y"` with `dragElastic={{ top: 0, bottom: 0.6 }}` — the panel can
 * only rubber-band in the dismiss direction, and stiffens as it stretches.
 * `onDragEnd` reads the release: if `offset.y > 120` (dragged past the
 * threshold) or `velocity.y > 600` (a fast flick, even a short one) it calls
 * `onOpenChange(false)`. Anything short of that and the panel has no memory
 * of the drag — it just springs back to `y: 0`.
 */
const DRAG_Y = 34; // demo travel below rest; real CLOSE_OFFSET is 120px
const FLY_Y = 220; // off-frame once dismissed

const CSS = `
@keyframes dwd-panel {
  0%, 8%    { transform: translateY(0px); }
  30%       { transform: translateY(${DRAG_Y}px); }
  46%, 54%  { transform: translateY(${DRAG_Y}px); }
  76%, 100% { transform: translateY(${FLY_Y}px); }
}
@keyframes dwd-pointer {
  0%, 8%    { opacity: 0; transform: translateY(-10px); }
  22%, 54%  { opacity: 1; transform: translateY(${DRAG_Y}px); }
  62%, 100% { opacity: 0; transform: translateY(${DRAG_Y}px); }
}
@keyframes dwd-backdrop {
  0%, 8%    { opacity: 1; }
  70%       { opacity: 1; }
  90%, 100% { opacity: 0; }
}
.dwd-panel    { animation: dwd-panel 4.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.dwd-pointer  { animation: dwd-pointer 4.8s ease infinite; }
.dwd-backdrop { animation: dwd-backdrop 4.8s ease infinite; }
.dwd-static .dwd-panel    { animation: none; transform: translateY(0px); }
.dwd-static .dwd-pointer  { animation: none; opacity: 0; }
.dwd-static .dwd-backdrop { animation: none; opacity: 1; }
`;

const PHASES: { label: string; dur: string; delta: string }[] = [
  { label: "drag", dur: "elastic 0.6", delta: "offset < 120px → snaps back" },
  { label: "past threshold", dur: "offset.y", delta: "> 120px → dismiss" },
  { label: "flick", dur: "velocity.y", delta: "> 600 → dismiss anyway" },
];

export function DrawerDismiss() {
  return (
    <ScrollScene
      label="Drag to dismiss"
      note="offset > 120px OR velocity > 600"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "dwd-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-56 w-72 overflow-hidden rounded-xl border border-fd-border border-dashed bg-[var(--foreground)]/[0.04]">
            <span className="dwd-backdrop absolute inset-0 bg-[var(--foreground)]/[0.06]" />

            {/* threshold line — the 120px offset boundary */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 border-t border-[var(--foreground)]/25 border-dashed"
              style={{ top: 40 + DRAG_Y }}
            />

            <div className="dwd-panel absolute inset-x-0 bottom-0 h-40 rounded-t-2xl border-t border-border bg-card p-4 shadow-2xl">
              <div className="relative mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--muted-foreground)]/40">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dwd-pointer absolute top-3 left-1/2 -translate-x-1/2"
                >
                  <path d="M12 4v14M6 13l6 6 6-6" />
                </svg>
              </div>
              <div className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={`${p.label}-dur`}>{p.dur}</dd>
            ))}
            {PHASES.map((p) => (
              <dd key={`${p.label}-delta`}>{p.delta}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
