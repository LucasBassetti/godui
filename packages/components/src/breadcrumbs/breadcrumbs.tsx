"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
};

export type BreadcrumbsProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  items: BreadcrumbItem[];
  /** Collapse the middle when there are more than this many items (0 = never). */
  maxItems?: number;
  /** Separator node between crumbs. */
  separator?: React.ReactNode;
  /** Allow the collapsed middle to expand into a popover. */
  collapsible?: boolean;
  /** Called when a crumb is clicked, with its href. */
  onNavigate?: (href: string) => void;
};

const DefaultSeparator = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5 text-muted-foreground/50"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

type Entry =
  | { kind: "crumb"; item: BreadcrumbItem; index: number; isLast: boolean }
  | { kind: "ellipsis"; hidden: BreadcrumbItem[] };

let crumbSeed = 0;

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      maxItems = 0,
      separator = DefaultSeparator,
      collapsible = true,
      onNavigate,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const hoverId = React.useMemo(() => `crumb-hover-${crumbSeed++}`, []);
    const [expanded, setExpanded] = React.useState(false);
    const [hovered, setHovered] = React.useState<string | null>(null);
    const popRef = React.useRef<HTMLLIElement>(null);

    React.useEffect(() => {
      if (!expanded) return;
      const onDown = (e: MouseEvent) => {
        if (popRef.current && !popRef.current.contains(e.target as Node)) {
          setExpanded(false);
        }
      };
      document.addEventListener("mousedown", onDown);
      return () => document.removeEventListener("mousedown", onDown);
    }, [expanded]);

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 500, damping: 34 } as const);

    const collapse =
      maxItems >= 2 && items.length > maxItems && collapsible && !expanded;

    const entries: Entry[] = React.useMemo(() => {
      const last = items.length - 1;
      const toEntry = (item: BreadcrumbItem, index: number): Entry => ({
        kind: "crumb",
        item,
        index,
        isLast: index === last,
      });
      if (!collapse) return items.map(toEntry);
      const tailCount = maxItems - 1;
      const head = items.slice(0, 1).map(toEntry);
      const hidden = items.slice(1, items.length - tailCount);
      const tail = items
        .slice(items.length - tailCount)
        .map((item, i) => toEntry(item, items.length - tailCount + i));
      return [...head, { kind: "ellipsis", hidden }, ...tail];
    }, [items, collapse, maxItems]);

    const pillClass =
      "relative inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

    const HoverPill = ({ active }: { active: boolean }) =>
      active ? (
        <motion.span
          layoutId={hoverId}
          transition={spring}
          className="absolute inset-0 rounded-lg bg-accent"
        />
      ) : null;

    const renderCrumb = (
      item: BreadcrumbItem,
      isLast: boolean,
      key: string,
    ) => {
      const inner = (
        <>
          <HoverPill active={hovered === key} />
          {item.icon && (
            <span className="relative shrink-0 [transition:transform_200ms_ease] group-hover:scale-110">
              {item.icon}
            </span>
          )}
          <span className="relative truncate">{item.label}</span>
        </>
      );
      if (isLast || !item.href) {
        return (
          <span
            aria-current={isLast ? "page" : undefined}
            className={`group ${pillClass} ${isLast ? "bg-muted text-foreground" : "text-muted-foreground"}`}
          >
            {inner}
          </span>
        );
      }
      return (
        <a
          href={item.href}
          onMouseEnter={() => setHovered(key)}
          onClick={(e) => {
            if (onNavigate && item.href) {
              e.preventDefault();
              onNavigate(item.href);
            }
          }}
          className={`group ${pillClass} text-muted-foreground [transition:color_150ms_ease] hover:text-foreground`}
        >
          {inner}
        </a>
      );
    };

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={className}
        onMouseLeave={() => setHovered(null)}
        {...props}
      >
        <motion.ol layout className="flex flex-wrap items-center gap-0.5">
          <AnimatePresence initial={false}>
            {entries.map((entry, i) => {
              const key =
                entry.kind === "ellipsis" ? "ellipsis" : `crumb-${entry.index}`;
              return (
                <React.Fragment key={key}>
                  {i > 0 && (
                    <li aria-hidden="true" className="flex items-center px-0.5">
                      {separator}
                    </li>
                  )}
                  {entry.kind === "crumb" ? (
                    <motion.li
                      layout
                      initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }
                      }
                      transition={spring}
                      className="flex min-w-0 items-center"
                    >
                      {renderCrumb(entry.item, entry.isLast, key)}
                    </motion.li>
                  ) : (
                    <motion.li
                      layout
                      ref={popRef}
                      className="relative flex items-center"
                    >
                      <button
                        type="button"
                        aria-label={`Show ${entry.hidden.length} hidden crumbs`}
                        aria-expanded={expanded}
                        onMouseEnter={() => setHovered("ellipsis")}
                        onClick={() => setExpanded(true)}
                        className={`group ${pillClass} text-muted-foreground hover:text-foreground`}
                      >
                        <HoverPill active={hovered === "ellipsis"} />
                        <span className="relative flex items-center gap-0.5">
                          <span className="h-1 w-1 rounded-full bg-current" />
                          <span className="h-1 w-1 rounded-full bg-current" />
                          <span className="h-1 w-1 rounded-full bg-current" />
                        </span>
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.92, y: -4 }
                            }
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.92, y: -4 }
                            }
                            transition={spring}
                            className="absolute top-full left-0 z-popover mt-1.5 min-w-48 origin-top-left rounded-xl border border-border bg-background p-1 shadow-xl"
                          >
                            <ul className="flex flex-col">
                              {entry.hidden.map((item, hi) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: collapsed crumbs are positional
                                <li key={`hidden-${hi}-${item.href ?? hi}`}>
                                  <a
                                    href={item.href}
                                    onClick={(e) => {
                                      if (onNavigate && item.href) {
                                        e.preventDefault();
                                        onNavigate(item.href);
                                      }
                                      setExpanded(false);
                                    }}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground text-sm [transition:background-color_150ms_ease,color_150ms_ease] hover:bg-accent hover:text-foreground"
                                  >
                                    {item.icon && (
                                      <span className="shrink-0">
                                        {item.icon}
                                      </span>
                                    )}
                                    {item.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </motion.ol>
      </nav>
    );
  },
);
Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
