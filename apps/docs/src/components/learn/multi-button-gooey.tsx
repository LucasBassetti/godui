"use client";

import { type CSSProperties, type ReactNode, useId } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes mbg-reveal {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
.mbg-layer { opacity: 0; animation: mbg-reveal 480ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both; }
.mbg-static .mbg-layer { opacity: 1; animation: none; transform: none; }
`;

const BLOBS = [
  { x: 0, width: 38 },
  { x: 39, width: 82 },
  { x: 122, width: 38 },
  { x: 161, width: 38 },
] as const;

const LEGEND = [
  {
    name: "Blob paint",
    desc: "soft SVG rectangles inside one filter",
    kind: "blob",
  },
  {
    name: "Control layer",
    desc: "sharp buttons and icons above the paint",
    kind: "control",
  },
] as const;

function BlobRail({
  filterId,
  filtered,
}: {
  filterId: string;
  filtered: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className="h-10 w-[199px] overflow-visible"
      viewBox="0 0 199 38"
    >
      <g filter={filtered ? `url(#${filterId})` : undefined}>
        {BLOBS.map((blob) => (
          <rect
            key={blob.x}
            x={blob.x}
            y="0"
            width={blob.width}
            height="38"
            rx="19"
            fill="var(--foreground)"
          />
        ))}
      </g>
    </svg>
  );
}

function ControlRail({ composited = false }: { composited?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-[199px] items-center gap-px text-[var(--foreground)]"
    >
      {BLOBS.map((blob) => (
        <span
          key={blob.x}
          className={`flex h-[38px] items-center justify-center rounded-full ${composited ? "" : "ring-1 ring-[var(--foreground)]/35 ring-inset"}`}
          style={{ width: blob.width }}
        >
          <span
            className={`size-2 rounded-full ${composited ? "bg-[var(--background)]/75" : "bg-[var(--foreground)]/65"}`}
          />
        </span>
      ))}
    </div>
  );
}

function LayerCard({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className="flex min-h-20 w-full items-center justify-center rounded-xl bg-[var(--muted)] px-3 ring-1 ring-[var(--foreground)]/12 ring-inset">
        {children}
      </div>
      <span className="font-mono text-[10px] text-fd-muted-foreground uppercase tracking-[0.14em]">
        {label}
      </span>
    </div>
  );
}

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "control") {
    return (
      <span className="flex h-4 w-8 items-center justify-center rounded-full ring-1 ring-[var(--foreground)]/40 ring-inset">
        <span className="size-1.5 rounded-full bg-[var(--foreground)]/65" />
      </span>
    );
  }
  return <span className="h-4 w-8 rounded-full bg-[var(--foreground)]" />;
}

export function MultiButtonGooey() {
  const filterId = useId().replace(/:/g, "");

  return (
    <ScrollScene
      label="Gooey construction"
      note="four-item example · filtered paint under sharp controls"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[540px] flex-col items-center gap-7 ${reduced ? "mbg-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <svg aria-hidden="true" className="absolute size-0">
            <defs>
              <filter
                id={filterId}
                x="-100%"
                y="-400%"
                width="300%"
                height="900%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="6"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                />
              </filter>
            </defs>
          </svg>

          <div key={cycle} className="grid w-full gap-4 sm:grid-cols-2">
            <div
              className="mbg-layer"
              style={{ "--delay": "0ms" } as CSSProperties}
            >
              <LayerCard label="blob paint">
                <BlobRail filterId={filterId} filtered={!reduced} />
              </LayerCard>
            </div>
            <div
              className="mbg-layer"
              style={{ "--delay": "100ms" } as CSSProperties}
            >
              <LayerCard label="control layer">
                <ControlRail />
              </LayerCard>
            </div>
            <div
              className="mbg-layer sm:col-span-2"
              style={{ "--delay": "220ms" } as CSSProperties}
            >
              <LayerCard label="composited">
                <div className="relative h-10 w-[199px]">
                  <div className="absolute inset-0">
                    <BlobRail filterId={filterId} filtered={!reduced} />
                  </div>
                  <div className="absolute inset-0">
                    <ControlRail composited />
                  </div>
                </div>
              </LayerCard>
            </div>
          </div>

          <p className="text-center font-mono text-[10px] text-fd-muted-foreground">
            Four-item sample · one SVG blob per mapped option
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
