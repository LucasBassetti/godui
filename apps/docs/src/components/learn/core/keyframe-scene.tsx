"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ScrollScene } from "../scroll-scene";

/**
 * Loops a mock surface through the real `godui-motion` enter/exit keyframes —
 * the same `animate-godui-*` classes the core components use — so the scene
 * shows exactly what ships. Class strings are static (Tailwind must see them).
 */
const MOTION = {
  "fade-scale": ["animate-godui-fade-scale-in", "animate-godui-fade-scale-out"],
  "popover-bottom": [
    "origin-top [--godui-enter-y:-0.25rem] animate-godui-popover-in",
    "origin-top [--godui-enter-y:-0.25rem] animate-godui-popover-out",
  ],
  "slide-right": [
    "[--godui-enter-distance:100%] animate-godui-slide-in-from-right",
    "[--godui-enter-distance:100%] animate-godui-slide-out-to-right",
  ],
  "pop-half": [
    "[--godui-enter-scale:0.5] animate-godui-fade-scale-in",
    "animate-godui-fade-out",
  ],
  "pop-dot": [
    "[--godui-enter-scale:0.3] animate-godui-fade-scale-in",
    "animate-godui-fade-out",
  ],
  "slide-bottom": [
    "animate-godui-slide-in-from-bottom",
    "animate-godui-slide-out-to-bottom",
  ],
  fade: ["animate-godui-fade-in", "animate-godui-fade-out"],
} as const;

export type KeyframeMotion = keyof typeof MOTION;
export type KeyframeSubject =
  | "dialog"
  | "sheet"
  | "menu"
  | "tooltip"
  | "drawer"
  | "toast"
  | "check"
  | "radio";
export type KeyframeTrack = { property: string; from: string; to: string };

const OPEN_MS = 1400;
const CLOSED_MS = 900;

function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      {widths.map((w) => (
        <span
          key={w}
          className={cn("h-2 rounded-full bg-[var(--foreground)]/20", w)}
        />
      ))}
    </div>
  );
}

function Surface({
  subject,
  motionClass,
}: {
  subject: KeyframeSubject;
  motionClass: string;
}) {
  const card =
    "rounded-xl border border-[var(--border)] bg-[var(--popover)] shadow-lg";
  switch (subject) {
    case "dialog":
      return (
        <div className={cn(card, "flex w-60 flex-col gap-4 p-5", motionClass)}>
          <Lines widths={["w-28", "w-44", "w-36"]} />
          <div className="flex justify-end gap-2">
            <span className="h-6 w-14 rounded-md border border-[var(--border)]" />
            <span className="h-6 w-14 rounded-md bg-[var(--foreground)]" />
          </div>
        </div>
      );
    case "sheet":
      return (
        <div className="relative h-48 w-64 overflow-hidden rounded-xl border border-dashed border-[var(--border)]">
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex w-36 flex-col gap-3 border-l border-[var(--border)] bg-[var(--popover)] p-4",
              motionClass,
            )}
          >
            <Lines widths={["w-20", "w-24", "w-16"]} />
          </div>
        </div>
      );
    case "menu":
      return (
        <div className="flex h-44 flex-col items-center gap-2">
          <span className="h-8 w-24 rounded-md border border-[var(--border)] bg-[var(--background)]" />
          <div
            className={cn(card, "flex w-40 flex-col gap-1 p-1.5", motionClass)}
          >
            {["w-20", "w-24", "w-16", "w-20"].map((w) => (
              <span key={w} className="flex h-7 items-center rounded-md px-2">
                <span
                  className={cn(
                    "h-2 rounded-full bg-[var(--foreground)]/25",
                    w,
                  )}
                />
              </span>
            ))}
          </div>
        </div>
      );
    case "tooltip":
      return (
        <div className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "origin-bottom rounded-md bg-[var(--foreground)] px-3 py-1.5 [--godui-enter-y:0.25rem]",
              motionClass,
            )}
          >
            <span className="block h-2 w-16 rounded-full bg-[var(--background)]/70" />
          </span>
          <span className="size-9 rounded-md border border-[var(--border)] bg-[var(--background)]" />
        </div>
      );
    case "drawer":
      return (
        <div className="relative h-48 w-64 overflow-hidden rounded-xl border border-dashed border-[var(--border)]">
          <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center gap-3 rounded-t-xl border-t border-[var(--border)] bg-[var(--popover)] p-3">
            <span className="h-1.5 w-12 rounded-full bg-[var(--muted)]" />
            <div className={cn("w-full", motionClass)}>
              <Lines widths={["w-24", "w-40", "w-32"]} />
            </div>
          </div>
        </div>
      );
    case "check":
      return (
        <span className="flex size-16 items-center justify-center rounded-xl bg-[var(--foreground)]">
          {/* The keyframe sits on a wrapper: Chrome won't composite `scale` on an <svg>. */}
          <span className={cn("flex", motionClass)}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-9 text-[var(--background)]"
            >
              <title>Check</title>
              <path
                d="M20 6 9 17l-5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      );
    case "radio":
      return (
        <span className="flex size-16 items-center justify-center rounded-full border-2 border-[var(--foreground)]">
          <span
            className={cn(
              "size-7 rounded-full bg-[var(--foreground)]",
              motionClass,
            )}
          />
        </span>
      );
    case "toast":
      return (
        <div className="relative h-36 w-64">
          {[2, 1].map((n) => (
            <div
              key={n}
              className={cn(
                card,
                "absolute inset-x-0 bottom-0 h-14",
                n === 2 ? "-translate-y-4 scale-90" : "-translate-y-2 scale-95",
              )}
            />
          ))}
          <div
            className={cn(
              card,
              "absolute inset-x-0 bottom-0 flex h-14 items-center p-4",
              motionClass,
            )}
          >
            <Lines widths={["w-32"]} />
          </div>
        </div>
      );
  }
}

function Loop({
  motion,
  subject,
  reduced,
}: {
  motion: KeyframeMotion;
  subject: KeyframeSubject;
  reduced: boolean;
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setOpen((o) => !o), open ? OPEN_MS : CLOSED_MS);
    return () => clearTimeout(id);
  }, [open, reduced]);
  const [enter, exit] = MOTION[motion];
  return (
    <Surface
      subject={subject}
      motionClass={reduced ? "" : open ? enter : exit}
    />
  );
}

export function KeyframeScene({
  label,
  note,
  motion,
  subject,
  tracks,
}: {
  label: string;
  note?: string;
  motion: KeyframeMotion;
  subject: KeyframeSubject;
  tracks: KeyframeTrack[];
}) {
  return (
    <ScrollScene label={label} note={note}>
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-8">
          <div className="flex min-h-48 items-center justify-center">
            <Loop
              key={cycle}
              motion={motion}
              subject={subject}
              reduced={reduced}
            />
          </div>
          <dl className="grid w-full grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] gap-4 border-fd-border border-t pt-5">
            {tracks.map((t) => (
              <div key={t.property} className="flex flex-col gap-1">
                <dt className="font-mono text-[12px] text-fd-foreground">
                  {t.property}
                </dt>
                <dd className="font-mono text-[12px] text-fd-muted-foreground">
                  {t.from} → {t.to}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
