"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The row is `drag="x"` with `dragConstraints: { left: 0, right: 0 }` and
 * `dragElastic: { left: 0.7, right: 0 }` — it resists a little while being
 * pulled left and refuses to move right at all. An archive strip sits
 * absolutely behind the row the whole time, revealed as the row slides off
 * it. `onDragEnd` only checks `offset.x < -80`: cross that and the row
 * archives (exits `x: -80` while collapsing); short of it, it springs back.
 * Looped here as pull → past threshold → archive → row resets.
 *
 * The sliding row is `h-full` so it fully occludes the archive strip — a
 * shorter padded row left a band of strip showing above/below the card,
 * which read as a nested box instead of a reveal.
 */
const CSS = `
@keyframes nis-row {
  0%, 8%    { transform: translateX(0); opacity: 1; }
  32%, 44%  { transform: translateX(-56px); opacity: 1; }
  58%, 68%  { transform: translateX(-96px); opacity: 1; }
  82%       { transform: translateX(-160px); opacity: 0; }
  83%       { transform: translateX(0); opacity: 0; }
  94%, 100% { transform: translateX(0); opacity: 1; }
}
@keyframes nis-strip {
  0%, 8%    { opacity: 0; }
  32%, 68%  { opacity: 1; }
  82%, 100% { opacity: 0; }
}
.nis-row  { animation: nis-row 4.6s cubic-bezier(0.3,0.7,0.4,1.05) infinite; }
.nis-strip { animation: nis-strip 4.6s cubic-bezier(0.3,0.7,0.4,1.05) infinite; }
.nis-static .nis-row { animation: none; transform: translateX(0); opacity: 1; }
.nis-static .nis-strip { animation: none; opacity: 0; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "row" | "threshold" | "archive";
}[] = [
  {
    name: "Row",
    desc: 'drag="x" · dragElastic left 0.7, right 0',
    kind: "row",
  },
  {
    name: "Threshold",
    desc: "offset.x < -80",
    kind: "threshold",
  },
  {
    name: "Archive strip",
    desc: "sits behind the row, revealed while dragging",
    kind: "archive",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "threshold") {
    return <span className="h-4 w-px bg-[var(--foreground)]/35" />;
  }
  if (kind === "archive") {
    return (
      <span className="h-3.5 w-6 rounded-sm bg-destructive ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-8 rounded-md border border-fd-border bg-[var(--card)]" />
  );
}

export function NotificationInboxSwipe() {
  return (
    <ScrollScene label="The motion" note="drag left · elastic · threshold">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[360px] flex-col items-center gap-8 ${
            reduced ? "nis-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-20 w-full items-center overflow-hidden rounded-xl border border-fd-border">
            <div className="nis-strip absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-destructive pr-4">
              <span className="h-1.5 w-8 rounded-full bg-destructive-foreground/80" />
            </div>

            <span
              aria-hidden
              className="absolute top-2 bottom-2 w-px bg-[var(--foreground)]/35"
              style={{ left: "calc(100% - 80px)" }}
            />

            <div className="nis-row relative flex h-full w-full items-center gap-3 bg-[var(--card)] px-4 will-change-transform">
              <span className="size-8 shrink-0 rounded-full bg-[var(--foreground)]/15" />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/30" />
                <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/15" />
              </span>
              <span className="size-2 shrink-0 rounded-full bg-primary" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
