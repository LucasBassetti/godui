"use client";

import Link from "fumadocs-core/link";
import { SidebarTrigger } from "fumadocs-ui/components/sidebar/base";
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { Menu } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { GoduiLogo } from "./godui-logo";
import { ThemeToggle } from "./theme-toggle";

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground";

export function DocsHeader({
  className,
  showSidebarTrigger = true,
  ...props
}: ComponentProps<"header"> & { showSidebarTrigger?: boolean }) {
  return (
    <header
      id="nd-nav"
      {...props}
      className={cn(
        "[grid-area:header] sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-fd-background/80 px-4 backdrop-blur-lg sm:gap-4",
        className,
      )}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 font-semibold text-[0.9375rem] text-fd-foreground"
      >
        <GoduiLogo className="h-10 w-10" width={40} height={40} />
      </Link>
      <nav className="flex items-center">
        <Link
          href="/docs/components"
          className="font-medium text-fd-muted-foreground text-sm transition-colors hover:text-fd-foreground"
        >
          Components
        </Link>
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Desktop: full search bar */}
        <FullSearchTrigger
          hideIfDisabled
          className="ps-2.5 w-[220px] max-md:hidden rounded-full"
        />
        {/* Mobile: search icon only */}
        <SearchTrigger hideIfDisabled className={cn(iconButton, "md:hidden")} />
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
  );
}
