"use client";

import type { ComponentProps } from "react";
import { DocsHeader } from "./docs-header";

/**
 * DocsHeader preset for the landing page (full-bleed, transparent border, no
 * scroll border). A dedicated client component so it can be passed as the
 * DocsLayout `header` slot — plain server functions can't cross the client
 * boundary DocsLayout sits behind.
 */
export function HomeHeader(props: ComponentProps<typeof DocsHeader>) {
  return (
    <DocsHeader
      {...props}
      className="mx-auto w-full max-w-[90rem] border-transparent"
      showScrollBorder={false}
    />
  );
}
