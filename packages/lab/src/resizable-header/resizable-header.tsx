"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import * as React from "react";

export type HeaderLink = {
  label: string;
  href: string;
};

export type ResizableHeaderProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> & {
  /** Brand mark shown on the left. */
  logo?: React.ReactNode;
  /** Primary navigation links. */
  links?: HeaderLink[];
  /** Value matching a link `href` to mark active. */
  activeHref?: string;
  /** Call-to-action node shown on the right. */
  cta?: React.ReactNode;
  /** Scroll distance (px) before the bar morphs into a floating pill. */
  scrollThreshold?: number;
  /** Stick the header to the top of the viewport. */
  sticky?: boolean;
  /** Scroll container to track. Defaults to the window. */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** Called when a link is clicked, with its href. */
  onNavigate?: (href: string) => void;
};

let headerSeed = 0;

const ResizableHeader = React.forwardRef<HTMLElement, ResizableHeaderProps>(
  (
    {
      logo,
      links = [],
      activeHref,
      cta,
      scrollThreshold = 24,
      sticky = true,
      scrollRef,
      onNavigate,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const ids = React.useMemo(() => {
      const n = headerSeed++;
      return { pill: `header-pill-${n}` };
    }, []);
    const { scrollY } = useScroll(
      scrollRef ? { container: scrollRef } : undefined,
    );
    const [shrunk, setShrunk] = React.useState(false);
    const [hovered, setHovered] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
      setShrunk(latest > scrollThreshold);
    });

    const spring = reduceMotion
      ? { duration: 0 }
      : ({ type: "spring", stiffness: 320, damping: 32, mass: 0.9 } as const);

    const select = (href: string) => {
      onNavigate?.(href);
      setOpen(false);
    };

    return (
      <header
        ref={ref}
        className={`${sticky ? "sticky top-0" : "relative"} z-sticky flex w-full max-w-full justify-center overflow-x-clip px-4 ${className ?? ""}`}
        {...props}
      >
        <motion.nav
          layout
          transition={spring}
          aria-label="Main"
          className={`mt-3 flex min-w-0 max-w-full items-center justify-between gap-4 border border-border bg-background/70 backdrop-blur-xl ${
            shrunk
              ? "w-full max-w-2xl rounded-full px-3 py-2 shadow-lg"
              : "w-full max-w-5xl rounded-2xl px-4 py-3 shadow-sm"
          }`}
        >
          <div className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
            {logo ?? "GodUI"}
          </div>

          <ul
            className="hidden items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => {
              const isActive = link.href === activeHref;
              return (
                <li key={link.href} className="relative">
                  <a
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        select(link.href);
                      }
                    }}
                    className={`relative block rounded-full px-3 py-1.5 font-medium text-sm [transition:color_150ms_ease] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {hovered === link.href && (
                      <motion.span
                        layoutId={`${ids.pill}-hover`}
                        transition={spring}
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId={ids.pill}
                        transition={spring}
                        className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-foreground"
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            {cta && <div className="hidden md:block">{cta}</div>}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground [transition:background-color_150ms_ease] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <motion.span
                animate={open ? "open" : "closed"}
                className="relative block h-4 w-5"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: -4 },
                    open: { rotate: 45, y: 0 },
                  }}
                  transition={spring}
                  className="absolute inset-x-0 top-1/2 block h-0.5 rounded-full bg-current"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 4 },
                    open: { rotate: -45, y: 0 },
                  }}
                  transition={spring}
                  className="absolute inset-x-0 top-1/2 block h-0.5 rounded-full bg-current"
                />
              </motion.span>
            </button>
          </div>
        </motion.nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: "easeOut" }
              }
              className="absolute inset-x-4 top-full mt-2 origin-top rounded-2xl border border-border bg-background p-2 shadow-xl md:hidden"
            >
              <ul className="flex flex-col">
                {links.map((link) => {
                  const isActive = link.href === activeHref;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(e) => {
                          if (onNavigate) {
                            e.preventDefault();
                            select(link.href);
                          } else {
                            setOpen(false);
                          }
                        }}
                        className={`block rounded-xl px-3 py-2.5 font-medium text-sm [transition:background-color_150ms_ease] hover:bg-accent ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {cta && <div className="mt-2 px-1">{cta}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  },
);
ResizableHeader.displayName = "ResizableHeader";

export { ResizableHeader };
