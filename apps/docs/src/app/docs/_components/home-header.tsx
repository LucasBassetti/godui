"use client";

import type { ComponentProps } from "react";
import { DocsHeader } from "./docs-header";

/**
 * DocsHeader preset for the landing page (transparent border, no scroll
 * border). No width of its own: like the docs header, it spans the layout's
 * --layout-max (globals.css), so both headers line up. A dedicated client component so it can be passed as the
 * DocsLayout `header` slot — plain server functions can't cross the client
 * boundary DocsLayout sits behind.
 */
export function HomeHeader(props: ComponentProps<typeof DocsHeader>) {
  return (
    <DocsHeader
      {...props}
      className="border-transparent"
      showScrollBorder={false}
    />
  );
}
