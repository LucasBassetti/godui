"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Highlighter is two layers on one inline span: the real text (token bar here)
 * and a rough-notation SVG overlay drawn over it. Split three ways —
 * text | annotation | together — so the overlay reads as a separate paint pass.
 */
const CSS = `
@keyframes hl-anat-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.hl-anat-col { opacity: 0; animation: hl-anat-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.hl-anat-static .hl-anat-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "text" | "annotation";
}[] = [
  {
    name: "Text span",
    desc: "inline-block children, always in the DOM",
    kind: "text",
  },
  {
    name: "Annotation",
    desc: "rough-notation SVG, drawn over the span",
    kind: "annotation",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "annotation") {
    return (
      <span className="h-3 w-6 rounded-md border-2 border-black/45 bg-transparent ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
  );
}

function TokenBar() {
  return <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/35" />;
}

/** Sketch underline / box marks — grayscale stroke, no copy. */
function SketchMark({ kind }: { kind: "fill" | "line" | "box" }) {
  if (kind === "fill") {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-x-1 inset-y-2 rounded-sm bg-black/15"
      />
    );
  }
  if (kind === "line") {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-x-1 bottom-2 h-0.5 rounded-full bg-black/45"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0.5 rounded-md border-2 border-black/45"
    />
  );
}

export function HighlighterAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="text span + sketch overlay">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-center justify-items-center gap-3 sm:gap-6 ${reduced ? "hl-anat-static" : ""}`}
          >
            <div
              className="hl-anat-col flex flex-col items-center gap-3"
              style={{ animationDelay: "0ms" }}
            >
              <div className="relative flex h-11 w-28 items-center justify-center rounded-[10px] border-2 border-black/40">
                <TokenBar />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                text only
              </p>
            </div>

            <div
              className="hl-anat-col flex flex-col items-center gap-3"
              style={{ animationDelay: "80ms" }}
            >
              <div className="relative flex h-11 w-28 items-center justify-center rounded-[10px] bg-[var(--muted)]">
                <SketchMark kind="box" />
                <SketchMark kind="line" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                annotation only
              </p>
            </div>

            <div
              className="hl-anat-col flex flex-col items-center gap-3"
              style={{ animationDelay: "160ms" }}
            >
              <div className="relative flex h-11 w-28 items-center justify-center rounded-[10px] border-2 border-black/40">
                <SketchMark kind="fill" />
                <TokenBar />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                together
              </p>
            </div>
          </div>

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
