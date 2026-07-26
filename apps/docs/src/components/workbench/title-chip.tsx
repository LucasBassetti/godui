"use client";

import { useId, useState } from "react";
import { Breadcrumbs } from "@/app/docs/_components/breadcrumbs";
import {
  type BadgeItem,
  type BadgeTone,
  useWorkbenchMeta,
} from "@/components/workbench/workbench-context";

const DOT: Record<BadgeTone, string> = {
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
};

/**
 * Slim floating identity chip over the stage (top-left): breadcrumb + component
 * name + a clean meta row (small colored dot + label) with a hover/focus tooltip
 * explaining each badge. Full description + prose live in the Docs drawer.
 */
export function TitleChip() {
  const { title, badges, breadcrumbs } = useWorkbenchMeta();

  return (
    <div className="pointer-events-none flex max-w-[42vw] flex-col gap-1.5 sm:max-w-md">
      {/* Breadcrumb is desktop-only — on mobile just the component title shows. */}
      <div className="pointer-events-auto hidden sm:block">
        <Breadcrumbs crumbs={breadcrumbs} />
      </div>
      <h1 className="pointer-events-auto font-semibold text-fd-foreground text-lg leading-tight tracking-tight sm:text-xl">
        {title}
      </h1>
      {badges && badges.length > 0 ? (
        <div className="pointer-events-auto flex flex-wrap items-center gap-x-3.5 gap-y-1 max-sm:hidden">
          {badges.map((b) => (
            <BadgeChip key={b.label} badge={b} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BadgeChip({ badge }: { badge: BadgeItem }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const hasTip = Boolean(badge.title || badge.detail);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus only reveals a tooltip; the interactive control is the inner <button>.
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      // Keep open while focus stays inside the wrapper (e.g. Tab into the link).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-describedby={open && hasTip ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
      >
        <span className={`size-1.5 rounded-full ${DOT[badge.tone]}`} />
        <span className="font-medium text-[11px] text-fd-muted-foreground uppercase tracking-[0.08em]">
          {badge.label}
        </span>
      </button>
      {open && hasTip ? (
        // `pt-2` is a transparent, hoverable bridge across the visual gap so the
        // pointer can travel from the badge into the tooltip (to click the link)
        // without crossing dead space that would close it.
        <span
          role="tooltip"
          id={id}
          className="absolute top-full left-0 z-30 block pt-2"
        >
          <span className="block w-64 max-w-[70vw] rounded-xl border border-fd-border bg-fd-popover p-3 text-left shadow-lg">
            {badge.title ? (
              <span className="block font-medium text-[13px] text-fd-foreground">
                {badge.title}
              </span>
            ) : null}
            {badge.detail ? (
              <span className="mt-1 block text-[12px] text-fd-muted-foreground leading-snug">
                {badge.detail}
              </span>
            ) : null}
            {badge.href ? (
              <a
                href={badge.href}
                className="mt-2 inline-flex items-center gap-1 font-medium text-[12px] text-fd-primary hover:underline"
              >
                {badge.hrefLabel ?? "Learn more"}
                <span aria-hidden>→</span>
              </a>
            ) : null}
          </span>
        </span>
      ) : null}
    </span>
  );
}
