"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Async search is debounced and race-guarded. Every keystroke bumps a ref
 * (`const id = ++reqId.current`) and, 180ms later, fires `onSearch`. When a
 * promise resolves it only writes state if `id === reqId.current` — so a slow
 * earlier request that lands *after* a newer one is silently dropped. Here two
 * requests fire; the newer one resolves and is applied, the older one arrives
 * late and is rejected because `reqId` has already moved on.
 */
const TRAVEL = 236; // 300px stage − pill − padding

const CSS = `
@keyframes cr-current {
  0%   { transform: translateX(0); opacity: 0; }
  10%  { transform: translateX(0); opacity: 1; }
  45%  { transform: translateX(${TRAVEL}px); opacity: 1; }
  100% { transform: translateX(${TRAVEL}px); opacity: 1; }
}
@keyframes cr-stale {
  0%   { transform: translateX(0); opacity: 1; }
  74%  { transform: translateX(${TRAVEL}px); opacity: 1; }
  84%  { transform: translateX(${TRAVEL}px); opacity: 1; }
  100% { transform: translateX(${TRAVEL}px); opacity: 0; }
}
@keyframes cr-accept { 0%, 45% { opacity: 0; transform: scale(0.6); } 55%, 100% { opacity: 1; transform: none; } }
@keyframes cr-reject { 0%, 80% { opacity: 0; } 90%, 100% { opacity: 1; } }
.cr-current { opacity: 0; animation: cr-current 3.2s cubic-bezier(0.4,0,0.2,1) both; }
.cr-stale   { animation: cr-stale 3.2s cubic-bezier(0.4,0,0.2,1) both; }
.cr-accept  { opacity: 0; animation: cr-accept 3.2s ease both; }
.cr-reject  { opacity: 0; animation: cr-reject 3.2s ease both; }
.cr-static .cr-current { transform: translateX(${TRAVEL}px); opacity: 1; animation: none; }
.cr-static .cr-stale   { opacity: 0; animation: none; }
.cr-static .cr-accept  { opacity: 1; transform: none; animation: none; }
.cr-static .cr-reject  { opacity: 0; animation: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Current request",
    desc: "id === reqId.current — result applied",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Stale request",
    desc: "resolves late — dropped by the id guard",
    swatch: "bg-[var(--foreground)]/10",
  },
];

function Track({
  pillClass,
  markClass,
  mark,
}: {
  pillClass: string;
  markClass: string;
  mark: "check" | "cross";
}) {
  return (
    <div className="relative h-9 w-[300px] overflow-hidden rounded-lg border border-border bg-[var(--card)]">
      {/* resolve target at the right edge */}
      <span className="absolute top-1 right-2 bottom-1 w-px bg-[var(--foreground)]/15" />
      <span
        className={`absolute top-1/2 left-2 h-4 w-12 -translate-y-1/2 rounded-md ${pillClass}`}
      />
      <span
        className={`-translate-y-1/2 absolute top-1/2 right-2.5 flex size-4 items-center justify-center ${markClass}`}
      >
        {mark === "check" ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 text-fd-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 text-fd-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        )}
      </span>
    </div>
  );
}

export function ComboboxRace() {
  return (
    <ScrollScene
      label="Race guard"
      note="newest reqId wins, whatever lands last"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-col items-center gap-3 ${reduced ? "cr-static" : ""}`}
          >
            <Track
              pillClass="cr-current bg-[var(--foreground)]/30"
              markClass="cr-accept"
              mark="check"
            />
            <Track
              pillClass="cr-stale bg-[var(--foreground)]/10"
              markClass="cr-reject"
              mark="cross"
            />
          </div>

          <dl className="grid w-full max-w-[320px] grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
