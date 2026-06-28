"use client";

import Link from "fumadocs-core/link";
import { SidebarTrigger } from "fumadocs-ui/components/sidebar/base";
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { ArrowUpRight, Menu } from "lucide-react";
import { type ComponentProps, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { GitHubStars } from "./github-stars";
import { GoduiLogo } from "./godui-logo";
import { ThemeToggle } from "./theme-toggle";

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground";

export const ANIMATED_ICONS_URL = "https://svg-animated-icons.vercel.app/";

export function DocsHeader({
  className,
  showSidebarTrigger = true,
  showScrollBorder = true,
  ...props
}: ComponentProps<"header"> & {
  showSidebarTrigger?: boolean;
  showScrollBorder?: boolean;
}) {
  // Reveal the header's full-bleed bottom border only once the page is scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Full-viewport-width bottom border. Kept as a sibling (not the header's
          own border) because the header's backdrop-blur makes it a containing
          block for fixed positioning, which would clamp the line to the header's
          centered max-width. Fades in only once scrolled. */}
      {showScrollBorder ? (
        <div
          aria-hidden
          style={{ background: "var(--color-fd-border)" }}
          className={cn(
            "pointer-events-none fixed inset-x-0 top-14 z-40 h-px transition-opacity duration-200",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}
      <header
        id="nd-nav"
        {...props}
        className={cn(
          "[grid-area:header] sticky top-0 z-40 flex h-14 items-center gap-2 bg-fd-background/80 px-4 backdrop-blur-lg sm:gap-4",
          className,
        )}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-[0.9375rem] text-fd-foreground"
        >
          <GoduiLogo className="h-7 w-7" width={28} height={28} />
          GodUI
        </Link>
        {/* Desktop nav links. On mobile these live in the sidebar drawer's
          "Menu" section instead (see MobileMenu). */}
        <nav className="flex items-center gap-4 max-md:hidden">
          <Link
            href="/docs/components"
            className="font-medium text-fd-muted-foreground text-sm transition-colors hover:text-fd-foreground"
          >
            Components
          </Link>
          <a
            href={ANIMATED_ICONS_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 font-medium text-fd-muted-foreground text-sm transition-colors hover:text-fd-foreground"
          >
            Animated Icons
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </a>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop: full search bar */}
          <FullSearchTrigger
            hideIfDisabled
            className="ps-2.5 w-[220px] max-md:hidden rounded-[11px]"
          />
          {/* Mobile: search icon only */}
          <SearchTrigger
            hideIfDisabled
            className={cn(iconButton, "md:hidden")}
          />
          <GitHubStars />
          <ThemeToggle />
          {/* Mobile: open the sidenav drawer (only when inside DocsLayout, which
            provides SidebarContext — the home page has no sidebar) */}
          {showSidebarTrigger ? (
            <SidebarTrigger
              aria-label="Open menu"
              className={cn(iconButton, "md:hidden")}
            >
              <Menu className="size-5" />
            </SidebarTrigger>
          ) : null}
        </div>
      </header>
    </>
  );
}
