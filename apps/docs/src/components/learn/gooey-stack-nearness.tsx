"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Slow nearness band-pass: cards approach → goo peaks mid-gap → native
 * returns at both rest ends. Stepped holds so "apart / necking / merged"
 * read as distinct phases instead of a blurry ping-pong.
 */
const DURATION = "9.5s";

const CSS = `
@keyframes gsn-upper {
  /* expanded rest */
  0%, 14%     { transform: translateY(0); }
  /* necking in */
  28%         { transform: translateY(22px); }
  /* fully overlapped — hold */
  36%, 58%    { transform: translateY(44px); }
  /* necking out */
  72%         { transform: translateY(22px); }
  /* expanded rest — hold */
  86%, 100%   { transform: translateY(0); }
}
/* Goo peaks only while necking — zero at both rest ends (band-pass). */
@keyframes gsn-goo {
  0%, 14%     { opacity: 0; }
  28%         { opacity: 1; }
  36%, 58%    { opacity: 0; }
  72%         { opacity: 1; }
  86%, 100%   { opacity: 0; }
}
@keyframes gsn-native {
  0%, 14%     { opacity: 1; }
  28%         { opacity: 0.12; }
  36%, 58%    { opacity: 1; }
  72%         { opacity: 0.12; }
  86%, 100%   { opacity: 1; }
}
@keyframes gsn-s1 {
  0%, 14%     { opacity: 1; transform: scale(1.02); }
  18%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsn-s2 {
  0%, 14%     { opacity: 0.28; transform: scale(1); }
  18%, 34%    { opacity: 1; transform: scale(1.02); }
  38%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsn-s3 {
  0%, 34%     { opacity: 0.28; transform: scale(1); }
  38%, 58%    { opacity: 1; transform: scale(1.02); }
  62%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsn-s4 {
  0%, 58%     { opacity: 0.28; transform: scale(1); }
  62%, 82%    { opacity: 1; transform: scale(1.02); }
  86%, 100%   { opacity: 0.28; transform: scale(1); }
}
.gsn-upper { animation: gsn-upper ${DURATION} cubic-bezier(0.45,0.05,0.55,0.95) infinite; }
.gsn-goo { animation: gsn-goo ${DURATION} cubic-bezier(0.45,0.05,0.55,0.95) infinite; }
.gsn-native { animation: gsn-native ${DURATION} cubic-bezier(0.45,0.05,0.55,0.95) infinite; }
.gsn-s1 { animation: gsn-s1 ${DURATION} linear infinite; }
.gsn-s2 { animation: gsn-s2 ${DURATION} linear infinite; }
.gsn-s3 { animation: gsn-s3 ${DURATION} linear infinite; }
.gsn-s4 { animation: gsn-s4 ${DURATION} linear infinite; }
.gsn-static .gsn-upper { animation: none; transform: none; }
.gsn-static .gsn-native { animation: none; opacity: 1; }
.gsn-static .gsn-goo { animation: none; opacity: 0; }
.gsn-static .gsn-s1 { animation: none; opacity: 1; transform: none; }
.gsn-static .gsn-s2,
.gsn-static .gsn-s3,
.gsn-static .gsn-s4 { animation: none; opacity: 0.28; transform: none; }
`;

const FILTER_ID = "gooey-stack-nearness-filter";

const STEPS: { cls: string; name: string; desc: string }[] = [
  { cls: "gsn-s1", name: "1 · Apart", desc: "nearness = 0, native only" },
  { cls: "gsn-s2", name: "2 · Necking", desc: "nearness peaks, goo on" },
  { cls: "gsn-s3", name: "3 · Merged", desc: "nearness = 0 again, native" },
  {
    cls: "gsn-s4",
    name: "4 · Necking out",
    desc: "goo flashes on the way back",
  },
];

export function GooeyStackNearness() {
  return (
    <ScrollScene
      label="The motion"
      note="slow band-pass — goo only while necking"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute size-0"
          >
            <defs>
              <filter id={FILTER_ID}>
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 -40"
                  result="goo"
                />
              </filter>
            </defs>
          </svg>

          <div
            key={cycle}
            className={`relative h-[132px] w-[132px] ${reduced ? "gsn-static" : ""}`}
          >
            {/* Goo layer — real filter, opacity gated by nearness band-pass. */}
            <div
              className="gsn-goo absolute inset-0"
              style={{ filter: `url(#${FILTER_ID})` }}
            >
              <div className="absolute inset-x-0 bottom-0 h-12 rounded-[14px] bg-[var(--foreground)]/55" />
              <div className="gsn-upper absolute inset-x-0 top-0">
                <div className="h-12 rounded-[14px] bg-[var(--foreground)]/55" />
              </div>
            </div>
            {/* Native crisp cards — opposite opacity curve. */}
            <div className="gsn-native absolute inset-x-0 bottom-0 h-12 rounded-[14px] border border-[var(--foreground)]/50 bg-[var(--card)]" />
            <div className="gsn-upper absolute inset-x-0 top-0">
              <div className="gsn-native h-12 rounded-[14px] border border-[var(--foreground)]/50 bg-[var(--card)]" />
            </div>
          </div>

          <ol className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.name}
                className={`${step.cls} flex flex-col gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-3 py-2.5`}
                style={{ transformOrigin: "center" } as CSSProperties}
              >
                <span className="font-medium text-[12px] text-fd-foreground">
                  {step.name}
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  {step.desc}
                </span>
              </li>
            ))}
          </ol>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            nearness peaks mid-gap — zero when fully apart or fully merged
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
