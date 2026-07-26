import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MCPInstall } from "@/components/mcp-install";
import { SectionHeading } from "./section-heading";

/**
 * The MCP story — GodUI's biggest differentiator vs. peer libraries. Server
 * wrapper; the interactive install panel (MCPInstall) is the only client leaf.
 */
export function McpSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-4 py-20 sm:py-28">
      <SectionHeading
        eyebrow="AI-native"
        title="Install components with your agent"
        description="GodUI ships an MCP server, so Cursor, Claude, Windsurf and friends can browse the library and drop components straight into your project — no copy-paste round trips."
      />
      <MCPInstall />
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Link
          href="/docs/mcp"
          className="group inline-flex items-center gap-1 font-medium text-fd-foreground transition-colors hover:text-fd-primary"
        >
          MCP docs
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
        <Link
          href="/docs/installation"
          className="group inline-flex items-center gap-1 font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          Manual install
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>
    </section>
  );
}
