import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { CSSProperties } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { DocsHeader } from "./_components/docs-header";
import { NullNavTitle } from "./_components/null-nav-title";

const docsLayoutStyle = {
  "--fd-sidebar-width": "260px",
  // Offset sticky TOC (+ toc-popover) below the sticky header (h-14 / 3.5rem)
  // so the right "On this page" menu isn't hidden under the header on scroll.
  "--fd-docs-row-1": "3.5rem",
  gridTemplate: `"header header header header header"
"sidebar sidebar toc-popover toc toc"
"sidebar sidebar main toc toc" 1fr / 0 var(--fd-sidebar-col) 1fr var(--fd-toc-width) 0`,
} as CSSProperties;

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      containerProps={{ style: docsLayoutStyle }}
      sidebar={{ collapsible: false, className: "!items-start" }}
      slots={{
        header: DocsHeader,
        navTitle: NullNavTitle,
        searchTrigger: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}
