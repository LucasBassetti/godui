"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The mapping scene: a brightness axis (light → dark) drives both variants at
 * once — a character ramp for ASCII and a growing dot for dither — so the reader
 * sees the single luminance value that feeds either look.
 */
const RAMP = " .:-=+*#%@";
const STEPS = 11;

const CSS = `
@keyframes adr-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
.adr-in { animation: adr-in 360ms cubic-bezier(0.22,1,0.36,1) both; }
.adr-static .adr-in { animation: none; opacity: 1; transform: none; }
`;

const STEP = Array.from({ length: STEPS }, (_, i) => {
  const dark = i / (STEPS - 1); // 0 = bright, 1 = dark
  const ch = RAMP[Math.round(dark * (RAMP.length - 1))] ?? " ";
  return { ch, ink: dark };
});

const LEGEND = [
  { kind: "grad", name: "Brightness", desc: "0.299r + 0.587g + 0.114b" },
  { kind: "glyph", name: "ASCII glyph", desc: "ramp index by luminance" },
  { kind: "dot", name: "Dither dot", desc: "size = quantized ink" },
] as const;

function Swatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "grad")
    return (
      <span className="h-4 w-6 shrink-0 rounded-[3px] bg-[linear-gradient(to_right,var(--background),var(--foreground))] ring-1 ring-[var(--foreground)]/15" />
    );
  if (kind === "glyph")
    return (
      <span className="flex size-4 shrink-0 items-center justify-center font-mono font-semibold text-[13px] text-[var(--foreground)]">
        %
      </span>
    );
  return (
    <span className="size-3.5 shrink-0 rounded-full bg-[var(--foreground)]" />
  );
}

export function AsciiDitherRamp() {
  return (
    <ScrollScene
      label="The ramp"
      note="one luminance drives glyph and dot alike"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col gap-4 ${reduced ? "adr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="flex items-center justify-between px-1 font-mono text-[11px] text-fd-muted-foreground">
            <span>bright</span>
            <span>dark</span>
          </div>
          <div className="h-6 w-full rounded-md bg-[linear-gradient(to_right,var(--background),var(--foreground))] ring-1 ring-inset ring-[var(--foreground)]/15" />
          <div
            className="grid items-end"
            style={{ gridTemplateColumns: `repeat(${STEPS}, 1fr)` }}
          >
            {STEP.map((s, i) => (
              <span
                key={s.ink}
                className="adr-in flex justify-center font-mono font-semibold text-[var(--foreground)] text-lg"
                style={{ animationDelay: reduced ? undefined : `${i * 40}ms` }}
              >
                {s.ch === " " ? "·" : s.ch}
              </span>
            ))}
          </div>
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: `repeat(${STEPS}, 1fr)` }}
          >
            {STEP.map((s, i) => (
              <span
                key={s.ink}
                className="adr-in flex h-6 items-center justify-center"
                style={{
                  animationDelay: reduced ? undefined : `${i * 40 + 120}ms`,
                }}
              >
                <span
                  className="rounded-full bg-[var(--foreground)]"
                  style={{
                    width: `${Math.max(3, s.ink * 22)}px`,
                    height: `${Math.max(3, s.ink * 22)}px`,
                  }}
                />
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LEGEND.map((l) => (
              <div key={l.name} className="flex items-center gap-2">
                <Swatch kind={l.kind} />
                <span className="text-[13px] text-[var(--foreground)]">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-fd-muted-foreground"> — {l.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ScrollScene>
  );
}
