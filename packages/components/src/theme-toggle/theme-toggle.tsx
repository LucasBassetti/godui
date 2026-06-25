"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ThemeToggleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  /** Duration of the circular reveal in milliseconds. */
  duration?: number;
  /** Called with the next theme after a toggle. */
  onThemeChange?: (theme: "light" | "dark") => void;
};

const ROOT_BASE =
  "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground [transition:background_200ms_ease,color_200ms_ease] hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const SunIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
    aria-hidden="true"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ duration = 500, onThemeChange, className, onClick, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = !isDark;
      const apply = () => {
        document.documentElement.classList.toggle("dark", next);
        setIsDark(next);
        onThemeChange?.(next ? "dark" : "light");
      };

      // Progressive enhancement: a circular wipe from the click origin where
      // View Transitions are supported, an instant swap everywhere else.
      const startViewTransition = (
        document as Document & {
          startViewTransition?: (cb: () => void) => {
            ready: Promise<void>;
          };
        }
      ).startViewTransition;

      if (reduceMotion || typeof startViewTransition !== "function") {
        apply();
      } else {
        const x = e.clientX;
        const y = e.clientY;
        const r = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );
        const transition = startViewTransition.call(document, apply);
        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${r}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        });
      }

      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="theme-toggle"
        aria-label="Toggle theme"
        aria-pressed={isDark}
        onClick={handleClick}
        className={`${ROOT_BASE} ${className ?? ""}`}
        {...props}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={
              reduceMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }
            }
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={
              reduceMotion ? undefined : { rotate: 90, opacity: 0, scale: 0.6 }
            }
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="inline-flex"
          >
            {isDark ? MoonIcon : SunIcon}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
