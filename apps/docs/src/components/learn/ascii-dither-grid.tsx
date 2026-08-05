"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy scene: a "photo" (radial luminance plate) is sampled to one cell per
 * glyph, then crossfades into the glyph field — each cell resolving from the
 * center out, the same reveal wipe the real component uses.
 */
const RAMP = " .:-=+*#%@";
const COLS = 13;
const ROWS = 13;

function lumaAt(x: number, y: number) {
  const d = Math.hypot(x / (COLS - 1) - 0.4, y / (ROWS - 1) - 0.34);
  return Math.max(0, Math.min(1, 1 - d * 1.35));
}

const MAXD = Math.hypot((COLS - 1) / 2, (ROWS - 1) / 2);
const CELLS = Array.from({ length: ROWS }, (_, y) =>
  Array.from({ length: COLS }, (_, x) => {
    const luma = lumaAt(x, y);
    const ch = RAMP[Math.round((1 - luma) * (RAMP.length - 1))] ?? " ";
    const delay =
      (Math.hypot(x - (COLS - 1) / 2, y - (ROWS - 1) / 2) / MAXD) * 520;
    return { ch, delay };
  }),
).flat();

const CSS = `
@keyframes adg-cell { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes adg-src  { from { opacity: 1; } to { opacity: 0; } }
.adg-cell { animation: adg-cell 420ms cubic-bezier(0.22,1,0.36,1) both; }
.adg-src  { animation: adg-src 900ms ease both; }
.adg-static .adg-cell { animation: none; opacity: 1; transform: none; }
.adg-static .adg-src  { animation: none; opacity: 0; }
`;

const LEGEND = [
  { kind: "src", name: "Source", desc: "the image, one luminance per cell" },
  { kind: "cell", name: "Cell grid", desc: "downsampled to cols × rows" },
  { kind: "glyph", name: "Glyph", desc: "brightness picks a ramp character" },
] as const;

function Swatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "src")
    return (
      <span className="size-4 shrink-0 rounded-[5px] bg-[radial-gradient(circle_at_38%_34%,var(--foreground),var(--muted)_60%,var(--background))]" />
    );
  if (kind === "cell")
    return (
      <span className="size-4 shrink-0 rounded-[3px] border border-[var(--foreground)]/30 border-dashed" />
    );
  return (
    <span className="flex size-4 shrink-0 items-center justify-center font-mono font-semibold text-[13px] text-[var(--foreground)]">
      #
    </span>
  );
}

export function AsciiDitherGrid() {
  return (
    <ScrollScene label="The grid" note="source sampled to one cell per glyph">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-7 ${reduced ? "adg-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative size-[260px]">
            <div
              className="adg-src absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_40%_34%,var(--foreground),var(--muted)_55%,var(--background))]"
              style={{ animationDelay: reduced ? undefined : "140ms" }}
            />
            <div
              className="absolute inset-0 grid font-mono text-[var(--foreground)]"
              style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
            >
              {CELLS.map((c, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative grid
                  key={i}
                  className="adg-cell flex items-center justify-center text-[13px] leading-none"
                  style={{
                    animationDelay: reduced ? undefined : `${140 + c.delay}ms`,
                  }}
                >
                  {c.ch}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
