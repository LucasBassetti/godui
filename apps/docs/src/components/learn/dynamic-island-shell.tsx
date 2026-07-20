"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The real shell springs `width` / `height` / `borderRadius` together
 * (`SHELL_SPRING`: stiffness 520, damping 32). Docs scenes normally stick to
 * compositor props, but faking this morph with non-uniform `scale` warps the
 * radius — tall/large stop being capsules and become rounded cards, which
 * scale cannot express. So this scene animates the same three box properties
 * the component does, with hold frames and an overshooting bezier between
 * them so the rubbery settle still reads.
 */
const CSS = `
@keyframes dis-shell {
  /* compact 140×36 r18 */
  0%, 14%   { width: 140px; height: 36px; border-radius: 18px; }
  /* default 220×44 r22 */
  20%, 34%  { width: 220px; height: 44px; border-radius: 22px; }
  /* long 360×52 r26 */
  40%, 54%  { width: 360px; height: 52px; border-radius: 26px; }
  /* tall 260×120 r28 */
  60%, 74%  { width: 260px; height: 120px; border-radius: 28px; }
  /* large 360×200 r36 */
  80%, 94%  { width: 360px; height: 200px; border-radius: 36px; }
  100%      { width: 140px; height: 36px; border-radius: 18px; }
}
@keyframes dis-label {
  0%, 14%   { opacity: 1; }
  15%, 100% { opacity: 0; }
}
@keyframes dis-label-1 {
  0%, 19%   { opacity: 0; }
  20%, 34%  { opacity: 1; }
  35%, 100% { opacity: 0; }
}
@keyframes dis-label-2 {
  0%, 39%   { opacity: 0; }
  40%, 54%  { opacity: 1; }
  55%, 100% { opacity: 0; }
}
@keyframes dis-label-3 {
  0%, 59%   { opacity: 0; }
  60%, 74%  { opacity: 1; }
  75%, 100% { opacity: 0; }
}
@keyframes dis-label-4 {
  0%, 79%   { opacity: 0; }
  80%, 94%  { opacity: 1; }
  95%, 100% { opacity: 0; }
}
.dis-shell {
  animation: dis-shell 8s cubic-bezier(0.34, 1.45, 0.64, 1) infinite;
}
.dis-label-0 { animation: dis-label   8s linear infinite; }
.dis-label-1 { animation: dis-label-1 8s linear infinite; }
.dis-label-2 { animation: dis-label-2 8s linear infinite; }
.dis-label-3 { animation: dis-label-3 8s linear infinite; }
.dis-label-4 { animation: dis-label-4 8s linear infinite; }
.dis-static .dis-shell {
  animation: none;
  width: 220px;
  height: 44px;
  border-radius: 22px;
}
.dis-static .dis-label-0,
.dis-static .dis-label-2,
.dis-static .dis-label-3,
.dis-static .dis-label-4 { animation: none; opacity: 0; }
.dis-static .dis-label-1 { animation: none; opacity: 1; }
`;

const LABELS = ["compact", "default", "long", "tall", "large"] as const;

const PHASES: { label: string; value: string }[] = [
  { label: "spring", value: "520 / 32" },
  { label: "animates", value: "width · height · radius" },
  { label: "feel", value: "rubbery overshoot" },
];

export function DynamicIslandShell() {
  return (
    <ScrollScene
      label="The shell spring"
      note="compact → default → long → tall → large"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-6 ${reduced ? "dis-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[220px] w-full items-center justify-center">
            <div className="dis-shell bg-black" />
          </div>

          <div className="relative h-5 w-full text-center font-mono text-[12px] text-fd-foreground">
            {LABELS.map((name, i) => (
              <span
                key={name}
                className={`dis-label-${i} absolute inset-x-0 top-0`}
              >
                {name}
              </span>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-x-4 gap-y-1 border-fd-border border-t pt-5 text-center font-mono text-[11px] text-fd-muted-foreground">
            {PHASES.map((p) => (
              <dt key={p.label} className="text-fd-foreground">
                {p.label}
              </dt>
            ))}
            {PHASES.map((p) => (
              <dd key={`${p.label}-v`}>{p.value}</dd>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
