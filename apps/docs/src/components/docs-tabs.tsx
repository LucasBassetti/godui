"use client";

import type { ReactNode } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useRovingTabIndex } from "@/lib/use-roving-tabindex";

/**
 * What the control *means*, which is not always "tabs".
 *
 * `Segmented` is reused for genuinely different widgets: switching the stage
 * between desktop and mobile is a radio group, picking an example is a tablist,
 * and picking a package manager is a radio group. Announcing all of them as tabs
 * would be a regression, so semantics are opt-in per call site and the default
 * stays the plain buttons this shipped with.
 */
export type SegmentedSemantics = "none" | "tabs" | "radiogroup";

type DocsTabsProps = {
  tabs: Array<{ value: string; label: string; icon?: ReactNode }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Segmented only: render the icon alone, label becomes the accessible name. */
  iconOnly?: boolean;
  /** Defaults to "none" — today's markup, no behaviour change. */
  semantics?: SegmentedSemantics;
  /** Accessible name for the group when semantics are set. */
  label?: string;
  /** `tabs` only: id of the element each tab controls. */
  controls?: string;
};

export function DocsTabs({ tabs, value, onChange, className }: DocsTabsProps) {
  return (
    <div className={cn("flex gap-6 border-b border-fd-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
            value === tab.value
              ? "border-fd-foreground text-fd-foreground"
              : "border-transparent text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

type PillTabsProps = {
  tabs: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function PillTabs({ tabs, value, onChange, className }: PillTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Measure the active pill so the floating thumb can slide to it. Pills are
  // variable-width (pnpm/npm/yarn/bun), so the thumb is positioned from the
  // live layout rather than an equal-column grid like <Segmented>.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const active = container?.querySelector<HTMLButtonElement>(
      `[data-value="${CSS.escape(value)}"]`,
    );
    if (!active) return;
    setThumb({
      left: active.offsetLeft,
      top: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight,
    });
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-wrap gap-1", className)}
    >
      {thumb ? (
        <span
          aria-hidden="true"
          className="absolute rounded-md border border-fd-border bg-[var(--muted)] shadow-sm transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{
            width: thumb.width,
            height: thumb.height,
            transform: `translate(${thumb.left}px, ${thumb.top}px)`,
            top: 0,
            left: 0,
          }}
        />
      ) : null}
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          data-value={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative z-[1] rounded-md px-2.5 py-1 text-sm transition-colors",
            value === tab.value
              ? "text-fd-foreground"
              : "text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Pill-style segmented control (e.g. Preview / Code). Unlike DocsTabs (underline
 * tabs) this renders an enclosed track with a raised active segment.
 */
export function Segmented({
  tabs,
  value,
  onChange,
  className,
  iconOnly,
  semantics = "none",
  label,
  controls,
}: DocsTabsProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );

  const { containerProps, optionProps } = useRovingTabIndex({
    values: tabs.map((tab) => tab.value),
    value,
    onChange,
  });
  const composite = semantics !== "none";

  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: `role` is set by the same `semantics` ternary that gates `aria-label`, so the label only ever renders on a tablist/radiogroup — the rule just can't follow a non-literal role.
    <div
      {...(composite ? containerProps : null)}
      role={
        semantics === "tabs"
          ? "tablist"
          : semantics === "radiogroup"
            ? "radiogroup"
            : undefined
      }
      aria-label={composite ? label : undefined}
      className={cn(
        // NB: --color-fd-muted is aliased to muted-foreground in the GodUI
        // theme, so bg-fd-muted renders light in dark mode. Use the real
        // --muted/--card tokens directly for a correct, contrasting track.
        // Grid (not inline-flex) so every segment is an equal-width column —
        // a shrink-to-fit flex track sizes buttons to their content, which
        // makes the half-width thumb misalign with the wider tab.
        "relative inline-grid h-8 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px]",
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Floating thumb that slides under the active segment. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] rounded-[7px] bg-[var(--card)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          // Match the flex-1 button width exactly: track inner width is
          // (100% - 2*3px padding), split n ways. translateX(100%) then steps
          // by one button so the thumb stays centered under each segment.
          width: `calc((100% - 6px) / ${tabs.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((tab) => (
        // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-selected/aria-checked are gated by the same `semantics` value that sets role="tab"/"radio"; the rule can't follow a non-literal role.
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          aria-label={iconOnly ? tab.label : undefined}
          title={iconOnly ? tab.label : undefined}
          {...(composite ? optionProps(tab.value) : null)}
          role={
            semantics === "tabs"
              ? "tab"
              : semantics === "radiogroup"
                ? "radio"
                : undefined
          }
          aria-selected={semantics === "tabs" ? value === tab.value : undefined}
          aria-checked={
            semantics === "radiogroup" ? value === tab.value : undefined
          }
          aria-controls={semantics === "tabs" ? controls : undefined}
          className={cn(
            // h-8 track (border-box) leaves a 24px inner area; symmetric
            // py-[3px] + leading-[18px] centers the label vertically without
            // depending on grid row-stretch behavior.
            "relative z-[1] inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] py-[3px] text-[13px] leading-[18px] font-medium transition-colors",
            iconOnly ? "px-2.5" : "px-3",
            value === tab.value
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {tab.icon}
          {iconOnly ? <span className="sr-only">{tab.label}</span> : tab.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Horizontally-scrollable segmented control for when there are too many segments
 * to fit an equal-width <Segmented> track (e.g. combobox with 8+ examples). Pills
 * are content-width (so labels never collide/wrap), the track scrolls sideways,
 * the active pill auto-centers, and a measured thumb slides beneath it. Edge
 * fades hint that there's more off-screen.
 */
export function ScrollableSegmented({
  tabs,
  value,
  onChange,
  className,
  semantics = "none",
  label,
  controls,
}: DocsTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const { containerProps } = useRovingTabIndex({
    values: tabs.map((tab) => tab.value),
    value,
    onChange,
  });
  const composite = semantics !== "none";

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  }, []);

  // Measure the active pill (relative to the scrolling track), slide the thumb
  // to it, and scroll it to center so the current variant is always in view.
  useLayoutEffect(() => {
    const track = trackRef.current;
    const scroller = scrollRef.current;
    const active = track?.querySelector<HTMLButtonElement>(
      `[data-value="${CSS.escape(value)}"]`,
    );
    if (!track || !scroller || !active) return;
    setThumb({
      left: active.offsetLeft,
      top: active.offsetTop,
      width: active.offsetWidth,
      height: active.offsetHeight,
    });
    scroller.scrollTo({
      left: active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2,
      behavior: "smooth",
    });
    // Let the smooth scroll settle before reading edge state.
    const t = window.setTimeout(syncEdges, 320);
    return () => window.clearTimeout(t);
  }, [value, syncEdges]);

  return (
    <div className={cn("relative max-w-full", className)}>
      {/* Edge fades — masked overlays that appear when content is clipped. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-[2] w-8 rounded-l-[10px] bg-gradient-to-r from-[var(--muted)] to-transparent transition-opacity",
          edges.left ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-[2] w-8 rounded-r-[10px] bg-gradient-to-l from-[var(--muted)] to-transparent transition-opacity",
          edges.right ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={scrollRef}
        onScroll={syncEdges}
        className="no-scrollbar overflow-x-auto rounded-[10px] border border-fd-border bg-[var(--muted)] shadow-lg"
      >
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: `role` is set by the same `semantics` ternary that gates `aria-label`, so the label only ever renders on a tablist/radiogroup — the rule just can't follow a non-literal role. */}
        <div
          ref={trackRef}
          {...(composite ? containerProps : null)}
          role={
            semantics === "tabs"
              ? "tablist"
              : semantics === "radiogroup"
                ? "radiogroup"
                : undefined
          }
          aria-label={composite ? label : undefined}
          className="relative flex w-max gap-1 p-[3px]"
        >
          {thumb ? (
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 rounded-[7px] bg-[var(--card)] shadow-sm transition-[transform,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{
                width: thumb.width,
                height: thumb.height,
                transform: `translate(${thumb.left}px, ${thumb.top}px)`,
              }}
            />
          ) : null}
          {tabs.map((tab) => (
            // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-selected/aria-checked are gated by the same `semantics` value that sets role="tab"/"radio"; the rule can't follow a non-literal role.
            <button
              key={tab.value}
              type="button"
              data-value={tab.value}
              onClick={() => onChange(tab.value)}
              tabIndex={composite && tab.value !== value ? -1 : undefined}
              role={
                semantics === "tabs"
                  ? "tab"
                  : semantics === "radiogroup"
                    ? "radio"
                    : undefined
              }
              aria-selected={
                semantics === "tabs" ? value === tab.value : undefined
              }
              aria-checked={
                semantics === "radiogroup" ? value === tab.value : undefined
              }
              aria-controls={semantics === "tabs" ? controls : undefined}
              className={cn(
                "relative z-[1] inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 py-[3px] text-[13px] leading-[18px] font-medium transition-colors",
                value === tab.value
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DocsPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("not-prose", className)}>{children}</div>;
}
