"use client";

import { useFlipGroup } from "@godui/components";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ScrollScene } from "../scroll-scene";

/** Slow-motion FLIP so the inverse-then-play step is visible. */
const SLOW_MS = 900;
const STEP_MS = 1800;

function useTicker(reduced: boolean, count: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick((t) => (t + 1) % count), STEP_MS);
    return () => clearInterval(id);
  }, [reduced, count]);
  return tick;
}

/** Accordion: the real `useFlipGroup`, slowed down. Row 1's panel snaps open. */
function AccordionFlip({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const open = useTicker(reduced, 2) === 1;
  useFlipGroup(ref, open, { duration: SLOW_MS });
  return (
    <div ref={ref} className="flex w-64 flex-col">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          data-flip
          className="border-[var(--border)] border-b py-2.5"
        >
          <span className="block h-2.5 w-28 rounded-full bg-[var(--foreground)]/30" />
          {row === 0 && open ? (
            <div className="mt-3 flex flex-col gap-2 rounded-md bg-[var(--muted)] p-3">
              <span className="h-2 w-40 rounded-full bg-[var(--foreground)]/15" />
              <span className="h-2 w-32 rounded-full bg-[var(--foreground)]/15" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

type Box = { x: number; w: number };

/** Tabs: snap the indicator's box, then play translate + scale from the old box. */
function TabsFlip({ reduced }: { reduced: boolean }) {
  const labels = ["Account", "Password", "Notifications"];
  const active = useTicker(reduced, labels.length);
  const list = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const prev = useRef<Box | null>(null);
  const [ghost, setGhost] = useState<Box | null>(null);

  useLayoutEffect(() => {
    const el =
      list.current?.querySelectorAll<HTMLElement>("[data-tab]")[active];
    const ind = indicator.current;
    if (!el || !ind) return;
    const box = { x: el.offsetLeft, w: el.offsetWidth };
    ind.style.width = `${box.w}px`;
    ind.style.translate = `${box.x}px 0`;
    const from = prev.current;
    prev.current = box;
    if (!from || reduced || from.x === box.x) return;
    setGhost(from);
    ind.animate(
      [
        { translate: `${from.x}px 0`, scale: `${from.w / box.w} 1` },
        { translate: `${box.x}px 0`, scale: "1 1" },
      ],
      { duration: SLOW_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }, [active, reduced]);

  return (
    <div
      ref={list}
      className="relative inline-flex rounded-lg bg-[var(--muted)] p-1"
    >
      <span
        ref={indicator}
        className="absolute top-1 bottom-1 left-0 origin-left rounded-md bg-[var(--background)] shadow-sm"
      />
      {ghost ? (
        <span
          key={`${ghost.x}`}
          className="absolute top-1 bottom-1 left-0 animate-godui-fade-out rounded-md border border-[var(--foreground)]/40 border-dashed"
          style={{
            width: ghost.w,
            translate: `${ghost.x}px 0`,
            animationDuration: `${SLOW_MS}ms`,
          }}
        />
      ) : null}
      {labels.map((label, i) => (
        <span
          key={label}
          data-tab
          className="relative flex items-center px-4 py-2.5"
        >
          <span
            className={cn(
              "block h-2 rounded-full",
              ["w-10", "w-14", "w-12"][i],
              i === active
                ? "bg-[var(--foreground)]/60"
                : "bg-[var(--foreground)]/25",
            )}
          />
        </span>
      ))}
    </div>
  );
}

export function FlipScene({
  label,
  note,
  variant,
}: {
  label: string;
  note?: string;
  variant: "accordion" | "tabs";
}) {
  return (
    <ScrollScene label={label} note={note ?? "slowed to 900ms"}>
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className="flex min-h-48 w-full items-center justify-center"
        >
          {variant === "accordion" ? (
            <AccordionFlip reduced={reduced} />
          ) : (
            <TabsFlip reduced={reduced} />
          )}
        </div>
      )}
    </ScrollScene>
  );
}
