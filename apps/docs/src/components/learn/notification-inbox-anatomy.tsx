"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The inbox is a card shell: a header (title, unread badge, mark-all-read),
 * then rows grouped by a sticky bucket label (`groupNotifications` buckets
 * by `group`, defaulting to "Earlier"). Each row is an avatar plus two lines
 * of text plus a time; unread rows additionally carry a small primary dot.
 * Drawn here with two buckets — a "today" bucket with an unread row, an
 * "earlier" bucket with a read one — so the sticky label and the dot both
 * have something to attach to.
 */
const ROWS = [
  { bucket: 0, unread: true },
  { bucket: 0, unread: false },
  { bucket: 1, unread: false },
] as const;

const CSS = `
@keyframes nia-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.nia-part { opacity: 0; animation: nia-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.nia-static .nia-part { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "header" | "group" | "row" | "dot";
}[] = [
  {
    name: "Header",
    desc: "title + unread badge + mark-all-read",
    kind: "header",
  },
  {
    name: "Group label",
    desc: "sticky top-0, one per group() bucket",
    kind: "group",
  },
  {
    name: "Row",
    desc: "avatar + two text lines + time",
    kind: "row",
  },
  {
    name: "Unread dot",
    desc: "primary, only while notification.read is falsy",
    kind: "dot",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "header") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "group") {
    return (
      <span className="h-2 w-8 rounded-sm bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "row") {
    return (
      <span className="size-3 rounded-full bg-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-2 rounded-full bg-primary ring-1 ring-fd-border ring-inset" />
  );
}

export function NotificationInboxAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="header · sticky groups · rows">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-8 ${
            reduced ? "nia-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-lg"
          >
            <div
              className="nia-part flex items-center justify-between gap-2 border-b border-fd-border px-4 py-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/40" />
                <span className="flex size-5 items-center justify-center rounded-full bg-primary" />
              </div>
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/20" />
            </div>

            {[0, 1].map((bucket) => (
              <div key={bucket}>
                <div
                  className="nia-part sticky top-0 bg-[var(--muted)] px-4 py-1.5"
                  style={{ "--d": `${80 + bucket * 260}ms` } as CSSProperties}
                >
                  <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/30" />
                </div>
                <ul>
                  {ROWS.filter((r) => r.bucket === bucket).map((row, i) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed row list
                      key={i}
                      className="nia-part flex items-start gap-3 px-4 py-3"
                      style={
                        {
                          "--d": `${160 + bucket * 260 + i * 90}ms`,
                        } as CSSProperties
                      }
                    >
                      <span className="size-8 shrink-0 rounded-full bg-[var(--foreground)]/15" />
                      <span className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
                        <span className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/30" />
                        <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/15" />
                      </span>
                      {row.unread ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      ) : (
                        <span className="mt-1.5 size-2 shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
