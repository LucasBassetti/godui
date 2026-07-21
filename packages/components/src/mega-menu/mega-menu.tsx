"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type MegaMenuLink = {
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
};

export type MegaMenuSection = {
  heading?: string;
  links: MegaMenuLink[];
};

export type MegaMenuItem = {
  label: string;
  /** Link rendered for a simple top-level item (no panel). */
  href?: string;
  /** Panel content. When present, hovering opens the mega panel. */
  sections?: MegaMenuSection[];
};

export type MegaMenuProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  items: MegaMenuItem[];
  /** Delay (ms) before opening on hover. */
  openDelay?: number;
  /** Delay (ms) before closing after leaving. */
  closeDelay?: number;
  /** Called when a link is clicked, with its href. */
  onNavigate?: (href: string) => void;
};

let megaSeed = 0;

const MegaMenu = React.forwardRef<HTMLElement, MegaMenuProps>(
  (
    {
      items,
      openDelay = 80,
      closeDelay = 140,
      onNavigate,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const highlightId = React.useMemo(() => `mega-hl-${megaSeed++}`, []);
    const [active, setActive] = React.useState<number | null>(null);
    const [hovered, setHovered] = React.useState<number | null>(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [mobileExpanded, setMobileExpanded] = React.useState<number | null>(
      null,
    );
    const openTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );
    const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined,
    );

    React.useEffect(
      () => () => {
        clearTimeout(openTimer.current);
        clearTimeout(closeTimer.current);
      },
      [],
    );

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const);

    const scheduleOpen = (index: number) => {
      clearTimeout(closeTimer.current);
      setHovered(index);
      if (!items[index]?.sections) {
        setActive(null);
        return;
      }
      openTimer.current = setTimeout(() => setActive(index), openDelay);
    };

    const scheduleClose = () => {
      clearTimeout(openTimer.current);
      setHovered(null);
      closeTimer.current = setTimeout(() => setActive(null), closeDelay);
    };

    const select = (href: string) => {
      onNavigate?.(href);
      setActive(null);
      setHovered(null);
    };

    const activeItem = active !== null ? items[active] : null;

    // Measure the active panel content so the container can morph its
    // width/height between triggers without ever transform-scaling the text.
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = React.useState<{
      width: number;
      height: number;
    } | null>(null);

    const useIsoLayoutEffect =
      typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

    useIsoLayoutEffect(() => {
      if (active === null) return;
      const el = contentRef.current;
      if (el) {
        setBounds({ width: el.offsetWidth, height: el.offsetHeight });
      }
    }, [active]);

    const sizeTransition = reduceMotion
      ? { duration: 0 }
      : ({ duration: 0.3, ease: [0.22, 1, 0.36, 1] } as const);

    return (
      <nav
        ref={ref}
        aria-label="Mega menu"
        className={`relative inline-flex flex-col ${className ?? ""}`}
        onMouseLeave={scheduleClose}
        {...props}
      >
        {/* Mobile: hamburger toggle + accordion drawer (hover panels don't work on touch). */}
        <div className="md:hidden">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 font-medium text-foreground text-sm [transition:background-color_150ms_ease] hover:bg-accent"
          >
            <MenuIcon open={mobileOpen} />
            Menu
          </button>
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                }
                className="absolute top-full left-1/2 z-popover mt-2 max-h-[70vh] w-72 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-border bg-background shadow-lg"
              >
                <ul className="flex flex-col p-1">
                  {items.map((item, index) => {
                    const expanded = mobileExpanded === index;
                    return (
                      <li key={item.label}>
                        {item.sections ? (
                          <>
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() =>
                                setMobileExpanded(expanded ? null : index)
                              }
                              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-medium text-foreground text-sm [transition:background-color_150ms_ease] hover:bg-accent"
                            >
                              {item.label}
                              <ChevronIcon
                                className={`size-4 text-muted-foreground [transition:transform_200ms_ease] ${expanded ? "rotate-180" : ""}`}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {expanded && (
                                <motion.div
                                  initial={
                                    reduceMotion
                                      ? false
                                      : { opacity: 0, height: 0 }
                                  }
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={
                                    reduceMotion
                                      ? { opacity: 0 }
                                      : { opacity: 0, height: 0 }
                                  }
                                  transition={
                                    reduceMotion
                                      ? { duration: 0 }
                                      : {
                                          duration: 0.2,
                                          ease: [0.22, 1, 0.36, 1],
                                        }
                                  }
                                  className="overflow-hidden"
                                >
                                  <div className="px-2 pb-2">
                                    {item.sections.map((section) => (
                                      <div
                                        key={
                                          section.heading ??
                                          section.links[0]?.label
                                        }
                                      >
                                        {section.heading && (
                                          <p className="px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                                            {section.heading}
                                          </p>
                                        )}
                                        {section.links.map((link) => (
                                          <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={(e) => {
                                              if (onNavigate) {
                                                e.preventDefault();
                                              }
                                              select(link.href);
                                              setMobileOpen(false);
                                            }}
                                            className="flex items-start gap-3 rounded-xl p-2.5 [transition:background-color_150ms_ease] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                          >
                                            {link.icon && (
                                              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                                                {link.icon}
                                              </span>
                                            )}
                                            <span className="flex flex-col">
                                              <span className="font-medium text-foreground text-sm">
                                                {link.label}
                                              </span>
                                              {link.description && (
                                                <span className="text-muted-foreground text-xs">
                                                  {link.description}
                                                </span>
                                              )}
                                            </span>
                                          </a>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <a
                            href={item.href}
                            onClick={(e) => {
                              if (onNavigate && item.href) {
                                e.preventDefault();
                                select(item.href);
                              }
                              setMobileOpen(false);
                            }}
                            className="block rounded-xl px-3 py-2.5 font-medium text-foreground text-sm [transition:background-color_150ms_ease] hover:bg-accent"
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ul className="relative hidden items-center gap-1 md:flex">
          {items.map((item, index) => {
            const hasPanel = !!item.sections;
            // Single highlighted item so the layoutId pill slides between
            // triggers (like a segmented control) instead of unmounting.
            const highlight = hovered ?? active;
            const isHot = highlight === index;
            return (
              <li key={item.label} className="relative">
                {hasPanel ? (
                  <button
                    type="button"
                    aria-expanded={active === index}
                    aria-haspopup="true"
                    onMouseEnter={() => scheduleOpen(index)}
                    onFocus={() => scheduleOpen(index)}
                    className={`relative block rounded-lg px-3 py-2 font-medium text-sm [transition:color_150ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isHot
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isHot && (
                      <motion.span
                        layoutId={highlightId}
                        transition={spring}
                        className="absolute inset-0 rounded-lg bg-accent"
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    onMouseEnter={() => scheduleOpen(index)}
                    onClick={(e) => {
                      if (onNavigate && item.href) {
                        e.preventDefault();
                        select(item.href);
                      }
                    }}
                    className={`relative block rounded-lg px-3 py-2 font-medium text-sm [transition:color_150ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isHot
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isHot && (
                      <motion.span
                        layoutId={highlightId}
                        transition={spring}
                        className="absolute inset-0 rounded-lg bg-accent"
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <AnimatePresence>
          {activeItem?.sections && (
            <motion.div
              key="panel"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
              }
              onMouseEnter={() => clearTimeout(closeTimer.current)}
              className="absolute top-full left-0 z-popover mt-2 origin-top-left rounded-2xl border border-border bg-background shadow-lg"
            >
              <motion.div
                animate={{
                  width: bounds?.width ?? "auto",
                  height: bounds?.height ?? "auto",
                }}
                transition={sizeTransition}
                className="relative overflow-hidden"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    ref={contentRef}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.15 }
                    }
                    className="flex w-max gap-2 p-2"
                  >
                    {activeItem.sections.map((section) => (
                      <div
                        key={section.heading ?? section.links[0]?.label}
                        className="w-56"
                      >
                        {section.heading && (
                          <p className="px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                            {section.heading}
                          </p>
                        )}
                        <ul className="flex flex-col">
                          {section.links.map((link) => (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                onClick={(e) => {
                                  if (onNavigate) {
                                    e.preventDefault();
                                    select(link.href);
                                  }
                                }}
                                className="group flex items-start gap-3 rounded-xl p-3 [transition:background-color_150ms_ease] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {link.icon && (
                                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [transition:transform_200ms_ease] group-hover:scale-105">
                                    {link.icon}
                                  </span>
                                )}
                                <span className="flex flex-col">
                                  <span className="font-medium text-foreground text-sm">
                                    {link.label}
                                  </span>
                                  {link.description && (
                                    <span className="text-muted-foreground text-xs">
                                      {link.description}
                                    </span>
                                  )}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  },
);
MegaMenu.displayName = "MegaMenu";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 12h16" />
          <path d="M4 6h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export { MegaMenu };
