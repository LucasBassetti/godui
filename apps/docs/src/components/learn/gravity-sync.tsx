"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Matter.js never touches the DOM. Every frame, the sync loop reads each
 * body's `position`/`angle` and writes them straight into
 * `element.style.transform`. The dashed ghost (the physics body, invisible
 * in the real component) and the solid plate (the actual DOM node) share the
 * exact same keyframe here to show that the plate's transform *is* the
 * body's position — nothing else moves it.
 */
const CSS = `
@keyframes grv-tumble {
  0%   { transform: translate(0px, -34px) rotate(-10deg); }
  45%  { transform: translate(8px, 14px) rotate(6deg); }
  70%  { transform: translate(-4px, 4px) rotate(-2deg); }
  100% { transform: translate(0px, -34px) rotate(-10deg); }
}
.grv-ghost, .grv-plate { animation: grv-tumble 3.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.grv-static .grv-ghost, .grv-static .grv-plate { animation: none; transform: translate(0px, 4px) rotate(-4deg); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "body" | "plate";
}[] = [
  {
    name: "Body (physics)",
    desc: "Matter.Body position + angle — never rendered",
    kind: "body",
  },
  {
    name: "DOM plate",
    desc: "style.transform, rewritten every rAF",
    kind: "plate",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "body") {
    return (
      <span className="size-3.5 rounded-[10px] border-2 border-dashed border-[var(--foreground)]/50" />
    );
  }
  return (
    <span className="size-3.5 rounded-[10px] bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
  );
}

export function GravitySync() {
  return (
    <ScrollScene
      label="The sync"
      note="body position → style.transform, every rAF"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-center gap-16 ${reduced ? "grv-static" : ""}`}
          >
            <div className="flex h-24 w-20 items-center justify-center">
              <div className="grv-ghost size-14 rounded-[10px] border-2 border-dashed border-[var(--foreground)]/50" />
            </div>
            <div className="flex h-24 w-20 items-center justify-center">
              <div className="grv-plate size-14 rounded-[10px] bg-[var(--foreground)]/60" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            transform: translate(x - w/2, y - h/2) rotate(angle)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
