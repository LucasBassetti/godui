"use client";

import { Breadcrumbs } from "@godui/components";
import { Folder, FolderOpen, Home, Layers } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * Breadcrumbs. Hover a crumb to feel the shared pill spring under it; the
 * collapsed trail below shows `maxItems` folding the middle into a popover.
 */
export function BreadcrumbsResult() {
  const [path, setPath] = useState("billing");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover a crumb, or open the ellipsis below
        </span>
      </div>
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-8 p-10">
        <div className="flex w-full max-w-md flex-col items-center gap-2">
          <Breadcrumbs
            items={[
              {
                label: "Home",
                href: "home",
                icon: <Home className="size-3.5" />,
              },
              {
                label: "Workspace",
                href: "workspace",
                icon: <Layers className="size-3.5" />,
              },
              {
                label: "Settings",
                href: "settings",
                icon: <Folder className="size-3.5" />,
              },
              { label: "Billing", icon: <FolderOpen className="size-3.5" /> },
            ]}
            onNavigate={setPath}
          />
          <p className="text-muted-foreground text-xs">
            Viewing <span className="text-foreground">/{path}</span>
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-2 border-fd-border border-t pt-8">
          <Breadcrumbs
            maxItems={3}
            items={[
              { label: "Home", href: "#" },
              { label: "Engineering", href: "#" },
              { label: "Platform", href: "#" },
              { label: "Services", href: "#" },
              { label: "Auth", href: "#" },
              { label: "Tokens" },
            ]}
          />
          <p className="font-mono text-muted-foreground text-xs">
            maxItems={"{3}"}
          </p>
        </div>
      </div>
    </div>
  );
}
