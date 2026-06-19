"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Single-icon theme toggle: shows the active theme's icon and flips
 * light <-> dark on click. Works at every breakpoint. The icon swap is
 * driven by the `.dark` class (CSS), so there's no hydration flash.
 */
export function ThemeToggle({ className, ...props }: ComponentProps<"button">) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
        className,
      )}
      {...props}
    >
      <Sun className="size-4.5 dark:hidden" />
      <Moon className="hidden size-4.5 dark:block" />
    </button>
  );
}
