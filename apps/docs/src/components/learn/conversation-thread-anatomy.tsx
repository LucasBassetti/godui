"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three rows off the same `ConversationMessage`: an assistant bubble
 * (left, muted), a user bubble (right, `flex-row-reverse`), and a second
 * assistant bubble whose actions row is left visible so its geometry reads
 * even without a hover. Each row springs in with the component's own enter
 * transform — opacity + `translateY(12px)`.
 */
const CSS = `
@keyframes cta-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cta-msg { opacity: 0; animation: cta-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cta-static .cta-msg { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "user" | "assistant" | "actions";
}[] = [
  {
    name: "User bubble",
    desc: "bg-primary, row reversed, rounded-br-md",
    kind: "user",
  },
  {
    name: "Assistant bubble",
    desc: "bg-muted, rounded-bl-md",
    kind: "assistant",
  },
  {
    name: "Actions row",
    desc: "opacity-0 → 100 on hover, px-1 below the bubble",
    kind: "actions",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "user") {
    return (
      <span className="h-3.5 w-6 rounded-md bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "assistant") {
    return (
      <span className="h-3.5 w-6 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-2.5 rounded-md bg-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
  );
}

export function ConversationThreadAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="message rows · role, bubble, actions">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col gap-4 ${reduced ? "cta-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex flex-col gap-4">
            {/* assistant — resolved bubble */}
            <div
              className="cta-msg flex items-start gap-2.5"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="size-7 shrink-0 rounded-full bg-[var(--muted)]" />
              <div className="flex max-w-[75%] flex-col items-start gap-1">
                <div className="flex flex-col gap-1.5 rounded-2xl rounded-bl-md bg-[var(--muted)] px-3.5 py-2">
                  <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
                </div>
              </div>
            </div>

            {/* user — reversed alignment */}
            <div
              className="cta-msg flex flex-row-reverse items-start gap-2.5"
              style={{ "--d": "130ms" } as CSSProperties}
            >
              <div className="flex max-w-[75%] flex-col items-end gap-1">
                <div className="rounded-2xl rounded-br-md bg-[var(--foreground)]/70 px-3.5 py-2">
                  <span className="h-2 w-20 rounded-full bg-[var(--background)]/70" />
                </div>
              </div>
            </div>

            {/* assistant — with actions row shown open */}
            <div
              className="cta-msg flex items-start gap-2.5"
              style={{ "--d": "260ms" } as CSSProperties}
            >
              <span className="size-7 shrink-0 rounded-full bg-[var(--muted)]" />
              <div className="flex max-w-[75%] flex-col items-start gap-1">
                <div className="flex flex-col gap-1.5 rounded-2xl rounded-bl-md bg-[var(--muted)] px-3.5 py-2">
                  <span className="h-2 w-32 rounded-full bg-[var(--foreground)]/30" />
                </div>
                <div className="flex gap-0.5 px-1">
                  <span className="size-5 rounded-md bg-[var(--foreground)]/15" />
                  <span className="size-5 rounded-md bg-[var(--foreground)]/15" />
                  <span className="size-5 rounded-md bg-[var(--foreground)]/15" />
                </div>
              </div>
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
