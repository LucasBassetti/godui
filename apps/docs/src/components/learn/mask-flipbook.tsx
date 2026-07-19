"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `mask-position` doesn't ease — it jumps, frame by frame, because the
 * animation's timing function is `steps(n)`. Illustrated here with 8
 * stand-in frames (the real sprites use 22 / 29 / 70); the playhead and the
 * reveal underneath share one keyframe, so both jump in lockstep.
 */
const FRAME_COUNT = 8;
const FRAME_W = 22;
const STRIP_W = FRAME_W * (FRAME_COUNT - 1);

const CSS = `
@keyframes mflip-play {
  0%   { transform: translateX(0); animation-timing-function: steps(${FRAME_COUNT - 1}); }
  45%  { transform: translateX(${STRIP_W}px); animation-timing-function: linear; }
  55%  { transform: translateX(${STRIP_W}px); animation-timing-function: steps(${FRAME_COUNT - 1}); }
  100% { transform: translateX(0); }
}
@keyframes mflip-fill {
  0%   { transform: scaleX(0); animation-timing-function: steps(${FRAME_COUNT - 1}); }
  45%  { transform: scaleX(1); animation-timing-function: linear; }
  55%  { transform: scaleX(1); animation-timing-function: steps(${FRAME_COUNT - 1}); }
  100% { transform: scaleX(0); }
}
.mflip-play { animation: mflip-play 3.2s infinite; }
.mflip-fill { transform-origin: left; animation: mflip-fill 3.2s infinite; }
.mflip-static .mflip-play { animation: none; transform: translateX(0); }
.mflip-static .mflip-fill { animation: none; transform: scaleX(0); }
`;

const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => `frame-${i}`);

const MASKS: { name: string; steps: string; size: string }[] = [
  { name: "nature", steps: "steps(22)", size: "2300%" },
  { name: "urban", steps: "steps(29)", size: "3000%" },
  { name: "forest", steps: "steps(70)", size: "7100%" },
];

export function MaskFlipbook() {
  return (
    <ScrollScene label="The flipbook" note="mask-position, stepped not eased">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-col items-center gap-6 ${reduced ? "mflip-static" : ""}`}
          >
            <div
              className="relative flex h-[30px] overflow-hidden rounded-[6px] border border-black/25"
              style={{ width: FRAME_W * FRAME_COUNT }}
            >
              {FRAMES.map((frame, i) => (
                <div
                  key={frame}
                  className={i % 2 === 0 ? "bg-black/10" : "bg-black/[0.16]"}
                  style={{ width: FRAME_W, height: "100%" }}
                />
              ))}
              <div
                className="mflip-play absolute top-0 left-0 h-full border-2 border-black/70"
                style={{ width: FRAME_W }}
              />
            </div>

            <div className="relative h-11 w-28 overflow-hidden rounded-[10px] border-2 border-black/40">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-2 w-12 rounded-full bg-black/40" />
              </span>
              <span className="mflip-fill absolute inset-0 flex items-center justify-center bg-black/80">
                <span className="h-2 w-12 rounded-full bg-white/80" />
              </span>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            {MASKS.map((m) => (
              <dt key={m.name} className="text-fd-foreground">
                {m.name}
              </dt>
            ))}
            {MASKS.map((m) => (
              <dd key={m.name}>{m.steps}</dd>
            ))}
            {MASKS.map((m) => (
              <dd key={m.name}>mask-size {m.size}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
