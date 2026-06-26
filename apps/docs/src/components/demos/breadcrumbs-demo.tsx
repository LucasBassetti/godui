"use client";

import { Breadcrumbs } from "@godui/components";
import { Folder, FolderOpen, Home, Layers } from "lucide-react";
import { useState } from "react";

export function BreadcrumbsDemo() {
  const [path, setPath] = useState("billing");
  const items = [
    { label: "Home", href: "home", icon: <Home className="size-3.5" /> },
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
    {
      label: "Billing",
      icon: <FolderOpen className="size-3.5" />,
    },
  ];

  return (
    <div className="w-full max-w-xl rounded-xl border border-border bg-card p-4 shadow-sm">
      <Breadcrumbs items={items} onNavigate={(href) => setPath(href)} />
      <div className="mt-4 rounded-lg border border-border border-dashed bg-muted/30 px-4 py-6 text-center text-muted-foreground text-sm">
        Viewing <span className="font-medium text-foreground">/{path}</span>
      </div>
    </div>
  );
}

export function BreadcrumbsCollapsedDemo() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-border bg-card p-4 shadow-sm">
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
    </div>
  );
}
