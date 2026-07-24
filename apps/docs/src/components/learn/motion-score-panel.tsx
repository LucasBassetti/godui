"use client";

import {
  MOTION_TIER_META,
  type MotionGrade,
  propTier,
} from "@godui/components";
import type { ReactNode } from "react";
import { motionScore } from "@/lib/motion-score";
import {
  MOTION_SCORE_PANELS,
  type MotionScoreProperty,
} from "@/lib/motion-score-panels";

/**
 * Shared MotionScore panel for Learn articles. Audits every property a
 * component animates and rolls them up to the final grade (worst tier wins).
 * Property lists live in `MOTION_SCORE_PANELS`; the header grade comes from
 * `motionScore(name)` (same signal as the docs-page Motion badge).
 */

const METHODOLOGY = "https://score.motion.dev/methodology";

// Tier chip colors — the score's own color coding (the subject is the grade),
// so fixed hues are intentional here; the letter stays dark on every bright chip.
const TIER_CHIP: Record<MotionGrade, string> = {
  S: "bg-yellow-400 text-neutral-900",
  A: "bg-emerald-400 text-neutral-900",
  B: "bg-sky-400 text-neutral-900",
  C: "bg-violet-400 text-neutral-900",
  D: "bg-pink-400 text-neutral-900",
  F: "bg-red-400 text-neutral-900",
};

function rowTier(row: MotionScoreProperty): MotionGrade {
  return row.tier ?? propTier(row.prop);
}

function TierChip({ grade, size }: { grade: MotionGrade; size: "sm" | "md" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-md font-bold leading-none ${TIER_CHIP[grade]} ${
        size === "md" ? "size-8 text-sm" : "size-6 text-[11px]"
      }`}
    >
      {grade}
    </span>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="ml-3 shrink-0 self-center whitespace-nowrap rounded-full bg-violet-400/20 px-2 py-0.5 font-medium text-[10px] text-violet-700 uppercase tracking-wide dark:text-violet-300">
      {children}
    </span>
  );
}

export function MotionScorePanel({ name }: { name: string }) {
  const entry = MOTION_SCORE_PANELS[name];
  if (!entry) {
    throw new Error(
      `MotionScorePanel: no MOTION_SCORE_PANELS entry for "${name}"`,
    );
  }

  const final = motionScore(name);
  const meta = MOTION_TIER_META[final.grade];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center justify-between gap-3 border-fd-border border-b bg-[var(--muted)] px-4 py-3">
        <span className="font-medium text-foreground text-sm">
          {entry.title}
        </span>
        <span className="inline-flex items-center gap-2.5">
          <TierChip grade={final.grade} size="md" />
          <span className="font-semibold text-foreground text-sm">
            {final.grade} — {meta.name}
          </span>
        </span>
      </div>

      <div className="divide-y divide-fd-border">
        {entry.properties.map((a) => {
          const tier = rowTier(a);
          return (
            <div
              key={`${a.prop}-${a.label}`}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <TierChip grade={tier} size="sm" />
              <code className="w-[8.5rem] shrink-0 font-mono text-[13px] text-foreground sm:w-44">
                {a.label}
              </code>
              <span className="min-w-0 flex-1 text-[12.5px] text-fd-muted-foreground leading-snug">
                {a.note}
              </span>
              {tier === final.grade ? <Pill>Worst → grade</Pill> : null}
            </div>
          );
        })}
      </div>

      <div className="border-fd-border border-t bg-[var(--muted)] px-4 py-3 text-[12.5px] text-fd-muted-foreground leading-relaxed">
        Each property is graded by how the browser runs it, from{" "}
        <span className="font-medium text-foreground">S</span> (composited off
        the main thread) down to{" "}
        <span className="font-medium text-foreground">F</span> (layout
        thrashing); the component takes the worst.{" "}
        <a
          href={METHODOLOGY}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
        >
          MotionScore methodology →
        </a>
      </div>
    </div>
  );
}
