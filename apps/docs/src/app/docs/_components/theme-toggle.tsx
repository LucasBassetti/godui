"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Single-icon theme toggle: shows the active theme's icon and flips
 * light <-> dark on click. Which glyph is visible is driven by the `.dark`
 * class (CSS), so there's no hydration flash. The morph on click is a JS
 * (framer-motion) spin + scale + fade — CSS transitions can't be used here
 * because fumadocs runs next-themes with `disableTransitionOnChange`, which
 * suppresses CSS transitions during the exact frame the theme class swaps.
 */
export function ThemeToggle({ className, ...props }: ComponentProps<"button">) {
  const { resolvedTheme, setTheme } = useTheme();
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    if (reduceMotion) return;
    // Sun morphs into moon (and back): the new glyph spins + scales + fades in
    // while the swap itself happens instantly under the cover of the animation.
    controls.set({ rotate: -120, scale: 0.4, opacity: 0 });
    void controls.start({
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    });
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
        className,
      )}
      {...props}
    >
      <motion.span
        animate={controls}
        className="inline-flex size-4.5 items-center justify-center"
      >
        <Sun className="size-4.5 dark:hidden" />
        <Moon className="hidden size-4.5 dark:block" />
      </motion.span>
    </button>
  );
}
