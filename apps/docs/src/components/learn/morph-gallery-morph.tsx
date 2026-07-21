"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two independent timelines, not one. The image's box travels on
 * `MORPH_SPRING` (stiffness 320, damping 32, mass 0.9) — a few hundred
 * milliseconds to bridge tile ↔ detail. The backdrop is a flat 0.2s opacity
 * tween. 0.2s is much shorter than the spring's settle time, so on open the
 * dimming is already done while the image is still travelling, and on close
 * the backdrop has already faded out before the image finishes sliding back
 * into its grid slot. Framer doesn't tween width/height directly for the
 * shared-layout box either — it applies a scale + translate correction each
 * frame, the same compositor trick used to drive this diagram.
 */
const CSS = `
@keyframes mgm-panel {
  0%, 3%    { transform: translate(-108px, -46px) scale(0.29); }
  15%       { transform: translate(3px, -3px) scale(1.03); }
  21%, 68%  { transform: translate(0, 0) scale(1); }
  80%       { transform: translate(-6px, 4px) scale(0.34); }
  92%, 100% { transform: translate(-108px, -46px) scale(0.29); }
}
@keyframes mgm-backdrop {
  0%, 4%    { opacity: 0; }
  10%, 68%  { opacity: 1; }
  74%, 100% { opacity: 0; }
}
.mgm-panel    { animation: mgm-panel 4.8s cubic-bezier(0.22,1,0.36,1) infinite; }
.mgm-backdrop { animation: mgm-backdrop 4.8s ease-in-out infinite; }
.mgm-static .mgm-panel    { animation: none; transform: translate(0,0) scale(1); }
.mgm-static .mgm-backdrop { animation: none; opacity: 1; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "image" | "backdrop";
}[] = [
  {
    name: "Image box",
    desc: "shared layoutId, spring 320 / 32 / 0.9",
    kind: "image",
  },
  {
    name: "Backdrop",
    desc: "flat opacity tween, 0.2s — finishes on its own",
    kind: "backdrop",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "backdrop") {
    return (
      <span className="h-3.5 w-8 rounded-sm bg-black/50 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative h-4 w-7 overflow-hidden rounded-lg bg-[var(--card)] shadow-sm ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-1 rounded-md bg-[var(--muted)]" />
    </span>
  );
}

export function MorphGalleryMorph() {
  return (
    <ScrollScene label="The morph" note="one spring, one independent tween">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "mgm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[220px] w-[300px] items-center justify-center overflow-hidden rounded-2xl border border-fd-border">
            <div className="mgm-backdrop absolute inset-0 bg-black/50" />
            <div className="mgm-panel relative h-32 w-52 rounded-2xl bg-[var(--card)] shadow-xl">
              <div className="absolute inset-3 rounded-lg bg-[var(--muted)]" />
            </div>
          </div>

          <dl className="grid w-full max-w-[420px] grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
