"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Status is color, so this is the one scene that keeps it: `STATUS_COLOR`
 * maps `active`/`idle`/`offline` straight to a ring dot in oklch, no motion
 * involved. `typing` is the exception — instead of a static ring it swaps
 * in three tiny dots, each `motion-safe:animate-bounce` with a 120ms stagger
 * per dot. Active gets a soft radar ping to read as "live"; idle and
 * offline hold still, which is the point — they aren't.
 */
const STATES: {
  name: string;
  desc: string;
  color: string;
  kind: "ring" | "ping" | "typing";
}[] = [
  {
    name: "Active",
    desc: "oklch(0.72 0.16 145)",
    color: "oklch(0.72 0.16 145)",
    kind: "ping",
  },
  {
    name: "Idle",
    desc: "oklch(0.75 0.15 75)",
    color: "oklch(0.75 0.15 75)",
    kind: "ring",
  },
  {
    name: "Typing",
    desc: "3 dots, 120ms stagger",
    color: "var(--primary)",
    kind: "typing",
  },
  {
    name: "Offline",
    desc: "oklch(0.6 0 0)",
    color: "oklch(0.6 0 0)",
    kind: "ring",
  },
];

const CSS = `
@keyframes pfs-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes pfs-ping { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
@keyframes pfs-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
.pfs-avatar { opacity: 0; animation: pfs-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pfs-ping { animation: pfs-ping 1.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.pfs-dot { animation: pfs-bounce 1.1s cubic-bezier(0.3,0.7,0.4,1) var(--bd) infinite; }
.pfs-static .pfs-avatar { opacity: 1; animation: none; transform: none; }
.pfs-static .pfs-ping { animation: none; opacity: 0; }
.pfs-static .pfs-dot { animation: none; transform: none; }
`;

function LegendSwatch({
  kind,
  color,
}: {
  kind: (typeof STATES)[number]["kind"];
  color: string;
}) {
  if (kind === "typing") {
    return (
      <span className="flex gap-0.5 rounded-full bg-background px-0.5 py-0.5 ring-1 ring-fd-border ring-inset">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="size-1 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </span>
    );
  }
  if (kind === "ping") {
    return (
      <span className="relative size-2.5 rounded-full ring-2 ring-background ring-inset">
        <span
          className="absolute inset-0 rounded-full opacity-40 scale-150"
          style={{ backgroundColor: color }}
        />
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      </span>
    );
  }
  return (
    <span
      className="size-2.5 rounded-full ring-2 ring-background ring-inset"
      style={{ backgroundColor: color }}
    />
  );
}

export function PresenceFacepileStatus() {
  return (
    <ScrollScene label="The showpiece" note="status color · typing bounces">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${
            reduced ? "pfs-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex items-center justify-center gap-7">
            {STATES.map((state, i) => (
              <div
                key={state.name}
                className="pfs-avatar flex flex-col items-center gap-3"
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <span className="relative inline-block size-11">
                  <span className="flex size-full items-center justify-center rounded-full bg-[var(--muted)] ring-2 ring-background" />
                  {state.kind === "typing" ? (
                    <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-px rounded-full bg-background px-0.5 py-1 shadow-sm">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="pfs-dot size-1 rounded-full"
                          style={
                            {
                              backgroundColor: state.color,
                              "--bd": `${d * 120}ms`,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </span>
                  ) : (
                    <>
                      {state.kind === "ping" ? (
                        <span
                          aria-hidden
                          className="pfs-ping absolute bottom-0 right-0 size-2.5 rounded-full"
                          style={{ backgroundColor: state.color }}
                        />
                      ) : null}
                      <span
                        className="absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: state.color }}
                      />
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-4">
            {STATES.map((state) => (
              <div key={state.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={state.kind} color={state.color} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {state.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {state.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
