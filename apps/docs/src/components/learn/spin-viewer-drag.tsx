"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `onPointerMove` only ever computes one thing: how many `sensitivity`-px
 * ticks the pointer has crossed since `onPointerDown`, rounded to a whole
 * step. There's no velocity, no momentum, no Framer Motion — a drag that
 * doesn't cross a full tick doesn't move the frame at all, which is why the
 * frame dial jumps in discrete steps under the pointer's smooth sweep.
 *
 * Track geometry is locked so the pointer's center sits on each tick:
 * 13 ticks (0…12), 12 steps, tick pitch = 16px.
 */
const TICKS_N = 13;
const STEPS = TICKS_N - 1; // 12
const PITCH = 16;
const TRAVEL = STEPS * PITCH; // 192
const TRACK_W = STEPS * PITCH; // first→last tick centers
const KNOB = 24; // size-6

const CSS = `
@keyframes svd-pointer {
  0%, 6%    { transform: translateX(0); }
  50%       { transform: translateX(${TRAVEL}px); }
  94%, 100% { transform: translateX(0); }
}
@keyframes svd-frame {
  0%, 6%    { transform: rotate(0deg); }
  50%       { transform: rotate(180deg); }
  94%, 100% { transform: rotate(0deg); }
}
.svd-pointer { animation: svd-pointer 4.4s cubic-bezier(0.4,0,0.2,1) infinite; }
.svd-frame   { animation: svd-frame 4.4s steps(${STEPS}) infinite; }
.svd-static .svd-pointer { animation: none; transform: translateX(${TRAVEL / 2}px); }
.svd-static .svd-frame   { animation: none; transform: rotate(90deg); }
`;

const TICKS = Array.from({ length: TICKS_N }, (_, i) => i);

export function SpinViewerDrag() {
  return (
    <ScrollScene label="The drag" note="dx ÷ sensitivity, rounded — that's it">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-7 ${reduced ? "svd-static" : ""}`}
          >
            <div className="grid size-24 place-items-center rounded-xl border border-fd-border bg-[var(--card)]">
              <div className="relative size-14">
                <div className="absolute inset-0 rounded-full border border-[var(--foreground)]/15" />
                <div className="svd-frame absolute inset-x-0 top-1/2 mx-auto h-6 w-1 origin-bottom -translate-y-full rounded-full bg-[var(--foreground)]/70" />
                <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/50" />
              </div>
            </div>

            <div
              className="relative"
              style={
                {
                  width: TRACK_W,
                  height: KNOB + 20,
                } as CSSProperties
              }
            >
              {/* Tick marks — centers at 0, 16, 32, … */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between">
                {TICKS.map((i) => (
                  <span
                    key={i}
                    className="h-2.5 w-px shrink-0 bg-[var(--foreground)]/25"
                  />
                ))}
              </div>
              {/* Knob centered on tick 0; translateX steps across tick centers. */}
              <div
                className="svd-pointer absolute top-0"
                style={
                  {
                    left: 0,
                    width: KNOB,
                    marginLeft: -KNOB / 2,
                  } as CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full border border-fd-border bg-[var(--foreground)]"
                >
                  <span className="size-2 rounded-full bg-[var(--background)]" />
                </span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              stepped = round(dx / sensitivity)
            </p>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Pointer
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                {"dx tracked from onPointerDown's clientX"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Frame
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                index += stepped, wrapped mod frame count
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
