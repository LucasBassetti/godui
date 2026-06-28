"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

export type CitationSource = {
  title: string;
  url: string;
  snippet?: string;
  /** Favicon / thumbnail node. Falls back to the URL hostname initial. */
  favicon?: React.ReactNode;
};

export type SourceCitationProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "title"
> & {
  /** The number rendered inside the pill. */
  index: number;
  source: CitationSource;
};

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const SourceCitation = React.forwardRef<HTMLSpanElement, SourceCitationProps>(
  ({ index, source, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    const show = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(true), 80);
    };
    const hide = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOpen(false), 120);
    };

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: hover affordance wrapping an anchor
      <span
        ref={ref}
        data-slot="source-citation"
        className={`relative inline-block align-baseline ${className ?? ""}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        {...props}
      >
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Source ${index}: ${source.title}`}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-[5px] bg-muted px-1 align-text-top text-[10px] font-semibold leading-none text-muted-foreground tabular-nums no-underline transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {index}
        </a>
        <AnimatePresence>
          {open ? (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.9,
              }}
              onMouseEnter={show}
              onMouseLeave={hide}
              className="absolute bottom-full left-1/2 z-popover mb-2 block w-72 max-w-[80vw] origin-bottom -translate-x-1/2 rounded-xl border border-border bg-popover p-3 text-left shadow-xl"
            >
              <span className="flex items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded bg-muted text-[10px] font-semibold text-muted-foreground">
                  {source.favicon ?? hostname(source.url)[0]?.toUpperCase()}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {hostname(source.url)}
                </span>
              </span>
              <span className="mt-1.5 block text-sm font-medium leading-snug text-foreground">
                {source.title}
              </span>
              {source.snippet ? (
                <span className="mt-1 line-clamp-3 block text-xs leading-5 text-muted-foreground">
                  {source.snippet}
                </span>
              ) : null}
              <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-border bg-popover" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    );
  },
);
SourceCitation.displayName = "SourceCitation";

export type SourceListProps = React.HTMLAttributes<HTMLDivElement> & {
  sources: CitationSource[];
  /** Show all immediately, or collapse behind a toggle. */
  collapsible?: boolean;
  /** How many to show before "+N more" when collapsible. */
  previewCount?: number;
};

const SourceList = React.forwardRef<HTMLDivElement, SourceListProps>(
  (
    { sources, collapsible = true, previewCount = 3, className, ...props },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState(!collapsible);
    const visible =
      expanded || !collapsible ? sources : sources.slice(0, previewCount);
    const hidden = sources.length - previewCount;

    return (
      <div
        ref={ref}
        data-slot="source-list"
        className={`flex flex-col gap-1.5 ${className ?? ""}`}
        {...props}
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <BookIcon className="size-3.5" />
          Sources
        </div>
        <div className="flex flex-col gap-1">
          {visible.map((source, i) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-accent"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {source.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {hostname(source.url)}
                </span>
              </span>
              <ExternalIcon className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
        {collapsible && hidden > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="self-start rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
          >
            {expanded ? "Show less" : `+${hidden} more`}
          </button>
        ) : null}
      </div>
    );
  },
);
SourceList.displayName = "SourceList";

type IconProps = { className?: string };
function BookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function ExternalIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export { SourceCitation, SourceList };
