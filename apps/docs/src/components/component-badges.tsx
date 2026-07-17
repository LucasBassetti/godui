"use client";

import * as React from "react";
import type { DependencyNote } from "@/lib/dependency-notes";
import type { MotionNote } from "@/lib/motion-notes";

/**
 * The badge row shown below a component page's description. Every component
 * carries a Motion Performance badge — green when it's GPU-only (animates only
 * transform / opacity / filter), amber when it animates a layout/paint/compute
 * property by design. Components that pull in a third-party dependency also get
 * a violet badge. Each badge reveals a tooltip on hover or keyboard focus.
 */

type Tone = "emerald" | "amber" | "violet";

const TONE: Record<Tone, { pill: string; dot: string }> = {
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
  children,
}: {
  tone: Tone;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
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
      <span
        role="tooltip"
        id={id}
        className="pointer-events-none absolute top-full left-0 z-50 mt-2 w-72 max-w-[min(18rem,80vw)] rounded-lg border border-border bg-popover px-3 py-2.5 text-left font-normal text-[13px] text-popover-foreground normal-case leading-relaxed tracking-normal opacity-0 shadow-lg transition-opacity duration-150 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100"
      >
        <span className="mb-0.5 block font-semibold text-foreground">
          {title}
        </span>
        {children}
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
  perf,
  dep,
  isStatic,
}: {
  /** Present when the component isn't 100% GPU-composited; absent means GPU-only. */
  perf?: MotionNote;
  /** Present when the component depends on a third-party package. */
  dep?: DependencyNote;
  /** True when the component renders statically with no animation at all. */
  isStatic?: boolean;
}) {
  return (
    <div className="not-prose mt-5 mb-0 flex flex-wrap items-center gap-2">
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
