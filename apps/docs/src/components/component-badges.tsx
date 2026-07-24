"use client";

import { MOTION_TIER_META, type MotionGrade } from "@godui/components";
import * as React from "react";
import type { DependencyNote } from "@/lib/dependency-notes";
import type { MotionNote } from "@/lib/motion-notes";

/**
 * The badge row shown below a component page's description. Every component
 * leads with a sky MotionScore badge (its static S→F render-cost grade), then a
 * Motion Performance badge — green when it's GPU-only (animates only transform /
 * opacity / filter), amber when it animates a layout/paint/compute property by
 * design. Components that pull in a third-party dependency also get a violet
 * badge. Each badge reveals a tooltip on hover or keyboard focus.
 */

type Tone = "emerald" | "amber" | "violet" | "sky";

const TONE: Record<Tone, { pill: string; dot: string }> = {
  sky: {
    pill: "bg-sky-400/15 text-sky-700 ring-sky-500/30 hover:bg-sky-400/25 focus-visible:ring-sky-500/50 dark:bg-sky-400/10 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  emerald: {
    pill: "bg-emerald-400/15 text-emerald-700 ring-emerald-500/30 hover:bg-emerald-400/25 focus-visible:ring-emerald-500/50 dark:bg-emerald-400/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  amber: {
    pill: "bg-amber-400/15 text-amber-700 ring-amber-500/30 hover:bg-amber-400/25 focus-visible:ring-amber-500/50 dark:bg-amber-400/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  violet: {
    pill: "bg-violet-400/15 text-violet-700 ring-violet-500/30 hover:bg-violet-400/25 focus-visible:ring-violet-500/50 dark:bg-violet-400/10 dark:text-violet-300",
    dot: "bg-violet-500",
  },
};

function Badge({
  tone,
  label,
  title,
  href,
  hrefLabel,
  children,
}: {
  tone: Tone;
  label: string;
  title: string;
  /** When set, the tooltip becomes hoverable and ends with a "learn more" link. */
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  const external = href?.startsWith("http");
  return (
    <span className="group/badge relative inline-flex align-middle">
      <button
        type="button"
        aria-describedby={id}
        className={`inline-flex cursor-help items-center gap-1.5 rounded-full px-2 py-0.5 font-medium text-[11px] uppercase leading-none tracking-wide ring-1 transition-colors focus:outline-none focus-visible:ring-2 ${TONE[tone].pill}`}
      >
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${TONE[tone].dot}`}
        />
        {label}
      </button>
      {/* pt-2 (not mt-2) bridges the gap to the pill so an interactive tooltip
          stays open while the pointer travels down to the link. */}
      <span
        role="tooltip"
        id={id}
        className={`absolute top-full left-0 z-50 w-72 max-w-[min(18rem,80vw)] pt-2 text-left opacity-0 transition-opacity duration-150 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100 ${href ? "" : "pointer-events-none"}`}
      >
        <span className="block rounded-lg border border-border bg-popover px-3 py-2.5 font-normal text-[13px] text-popover-foreground normal-case leading-relaxed tracking-normal shadow-lg">
          <span className="mb-0.5 block font-semibold text-foreground">
            {title}
          </span>
          {children}
          {href ? (
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noreferrer" }
                : undefined)}
              className="mt-2 inline-flex items-center gap-1 font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
            >
              {hrefLabel ?? "Learn more"}
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </span>
      </span>
    </span>
  );
}

const PERF_LABEL: Record<MotionNote["kind"], string> = {
  layout: "Layout",
  paint: "Paint",
  compute: "Compute",
};

export function ComponentBadges({
  score,
  scoreHref,
  perf,
  dep,
  isStatic,
  placeholder,
}: {
  /** Static MotionScore (S→F) for the component's animation render cost. */
  score?: { grade: MotionGrade; reason: string };
  /**
   * Learn-page URL for the Motion Score table (with `#motion-score` anchor).
   * When set, the Motion badge tooltip links there.
   */
  scoreHref?: string;
  /** Present when the component isn't 100% GPU-composited; absent means GPU-only. */
  perf?: MotionNote;
  /** Present when the component depends on a third-party package. */
  dep?: DependencyNote;
  /** True when the component renders statically with no animation at all. */
  isStatic?: boolean;
  /**
   * Reserve the badge-row height without showing any badge. Used on the Learn
   * tab (which has no badges) so its title lands at the same vertical position
   * as the Docs tab's title.
   */
  placeholder?: boolean;
}) {
  if (placeholder) {
    return (
      <div
        aria-hidden="true"
        className="not-prose invisible mt-5 mb-0 flex flex-wrap items-center gap-2"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] leading-none ring-1">
          <span className="size-1.5 rounded-full" />
          placeholder
        </span>
      </div>
    );
  }
  return (
    <div className="not-prose mt-5 mb-0 flex flex-wrap items-center gap-2">
      {score ? (
        <Badge
          tone="sky"
          label={`Motion ${score.grade}`}
          title={`${score.grade} — ${MOTION_TIER_META[score.grade].name}`}
          href={scoreHref}
          hrefLabel="Motion Score table"
        >
          <span className="block">{MOTION_TIER_META[score.grade].summary}</span>
          <span className="mt-1.5 block text-muted-foreground">
            {score.reason}
          </span>
        </Badge>
      ) : null}
      {perf ? (
        <Badge
          tone="amber"
          label={PERF_LABEL[perf.kind]}
          title="Not fully GPU-composited"
        >
          {perf.reason}
        </Badge>
      ) : isStatic ? (
        <Badge tone="emerald" label="Static" title="No animation">
          Renders with plain CSS and never animates — nothing for the browser to
          keep composing or repainting.
        </Badge>
      ) : (
        <Badge
          tone="emerald"
          label="GPU-only"
          title="Runs on the GPU compositor"
        >
          Animates only transform, opacity and filter — no main-thread layout or
          paint, so it stays smooth even under load.
        </Badge>
      )}
      {dep ? (
        <Badge
          tone="violet"
          label="Dependency"
          title="Beyond React, Tailwind & Motion"
        >
          Uses <span className="font-medium text-foreground">{dep.pkg}</span> to{" "}
          {dep.reason}.
        </Badge>
      ) : null}
    </div>
  );
}
