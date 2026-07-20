"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Validation feedback, side by side. `status="error"` runs a single framer
 * keyframe shake on the whole row — `x: [0, -6, 6, -4, 4, 0]` over 0.4s — and
 * paints the borders destructive; consumers flip back to `idle` to re-arm it.
 * `status="success"` does the opposite: it settles, borders to primary, no
 * shake. Red and green are the only real color here — both are semantic.
 */
const CELLS = 4;

const CSS = `
@keyframes os-shake {
  0%, 66%, 100% { transform: translateX(0); }
  70%  { transform: translateX(-6px); }
  74%  { transform: translateX(6px); }
  78%  { transform: translateX(-4px); }
  82%  { transform: translateX(4px); }
  86%  { transform: translateX(0); }
}
@keyframes os-settle {
  0%, 60% { transform: scale(1); }
  72%     { transform: scale(1.05); }
  84%, 100% { transform: scale(1); }
}
.os-shake  { animation: os-shake 3.4s ease-in-out infinite; }
.os-settle { animation: os-settle 3.4s cubic-bezier(0.3,0.7,0.4,1.4) infinite; }
.os-static .os-shake, .os-static .os-settle { animation: none; transform: none; }
`;

function Row({
  tone,
  anim,
}: {
  tone: "border-destructive" | "border-primary";
  anim: "os-shake" | "os-settle";
}) {
  return (
    <div className={`${anim} flex items-center gap-2`}>
      {Array.from({ length: CELLS }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length cell grid
          key={i}
          className={`flex size-11 items-center justify-center rounded-lg border-2 ${tone} bg-[var(--card)]`}
        >
          <span className="size-2.5 rounded-full bg-foreground" />
        </div>
      ))}
    </div>
  );
}

export function OtpShake() {
  return (
    <ScrollScene label="Validation" note="error shakes · success settles">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-10 ${reduced ? "os-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex flex-col items-center gap-2.5">
            <Row tone="border-destructive" anim="os-shake" />
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              status=&quot;error&quot; → x:[0,-6,6,-4,4,0], 0.4s
            </p>
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <Row tone="border-primary" anim="os-settle" />
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              status=&quot;success&quot; → settles, no shake
            </p>
          </div>
        </div>
      )}
    </ScrollScene>
  );
}
