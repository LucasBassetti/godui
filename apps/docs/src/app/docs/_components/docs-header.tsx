"use client";

import { FullSearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import Link from "fumadocs-core/link";
import type { ComponentProps } from "react";
import { GoduiLogo } from "./godui-logo";

export function DocsHeader(props: ComponentProps<"header">) {
  return (
    <header
      id="nd-nav"
      {...props}
      className="[grid-area:header] sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-fd-background/80 backdrop-blur-lg px-4"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 font-semibold text-[0.9375rem] text-fd-foreground"
      >
        <GoduiLogo className="h-10 w-10" width={40} height={40} />
      </Link>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <FullSearchTrigger
          hideIfDisabled
          className="rounded-full ps-2.5 w-[220px]"
        />
        <ThemeSwitch mode="light-dark-system" />
      </div>
    </header>
  );
}
