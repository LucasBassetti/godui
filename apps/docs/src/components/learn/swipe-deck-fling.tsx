"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Drag maps straight to rotation — `useTransform(x, [-320, 0, 320], [-18, 0,
 * 18])` — so the card visibly leans into the throw. Past `threshold` (110px)
 * or a fast enough flick, release seeds a `{ stiffness: 60, damping: 16 }`
 * spring with the release velocity, so the exit continues the gesture's
 * momentum instead of restarting from zero.
 */
const CSS = `
@keyframes swdf-card {
  0%, 14% { transform: translateX(0) rotate(0deg); opacity: 1; }
  32% { transform: translateX(96px) rotate(11deg); opacity: 1; }
  52%, 62% { transform: translateX(420px) rotate(24deg); opacity: 0; }
  90%, 100% { transform: translateX(0) rotate(0deg); opacity: 1; }
}
.swdf-card { animation: swdf-card 4.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.swdf-static .swdf-card { animation: none; transform: none; opacity: 1; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "front" | "behind";
}[] = [
  {
    name: "Front card",
    desc: "drag → rotate · x maps to ±18°",
    kind: "front",
  },
  {
    name: "Behind card",
    desc: "exit spring 60/16 seeded with velocity",
    kind: "behind",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "front") {
    return (
      <span className="h-4 w-5 rounded-md border border-[var(--foreground)]/60 bg-[var(--card)] shadow-sm" />
    );
  }
  return (
    <span className="h-4 w-5 rounded-md border border-fd-border bg-[var(--muted)]" />
  );
}

export function SwipeDeckFling() {
  return (
    <ScrollScene
      label="The motion"
      note="past threshold(110) → fling, not fade"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[360px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-40 w-28 ${reduced ? "swdf-static" : ""}`}
          >
            <div className="absolute inset-0 translate-y-4 scale-[0.95] rounded-2xl border border-fd-border bg-[var(--muted)]" />
            <div className="swdf-card absolute inset-0 rounded-2xl border border-[var(--foreground)]/60 bg-[var(--card)] shadow-md" />
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
