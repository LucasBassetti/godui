import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { CSSProperties } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

const docsLayoutStyle = {
  "--fd-layout-width": "90rem",
  "--fd-sidebar-width": "220px",
  gridTemplate: `"sidebar sidebar header toc toc"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar main toc toc" 1fr / 0 var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width, 90rem) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) 0`,
} as CSSProperties;

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      containerProps={{ style: docsLayoutStyle }}
      sidebar={{ className: "!items-start" }}
    >
      {children}
    </DocsLayout>
  );
}
