"use client";

import { Sidebar, type SidebarItem } from "@godui/components";
import {
  BarChart3,
  CreditCard,
  FolderKanban,
  Home,
  Inbox,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

const items: SidebarItem[] = [
  { id: "home", label: "Home", href: "#", icon: <Home className="size-5" /> },
  {
    id: "inbox",
    label: "Inbox",
    href: "#",
    icon: <Inbox className="size-5" />,
    badge: "12",
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "#",
    icon: <BarChart3 className="size-5" />,
  },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderKanban className="size-5" />,
    children: [
      { id: "godui", label: "GodUI", href: "#" },
      { id: "northwind", label: "Northwind", href: "#" },
      { id: "acme", label: "Acme Inc.", href: "#" },
    ],
  },
  { id: "team", label: "Team", href: "#", icon: <Users className="size-5" /> },
  {
    id: "billing",
    label: "Billing",
    href: "#",
    icon: <CreditCard className="size-5" />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "#",
    icon: <Settings className="size-5" />,
  },
];

const titles: Record<string, string> = {
  home: "Home",
  inbox: "Inbox",
  analytics: "Analytics",
  godui: "GodUI",
  northwind: "Northwind",
  acme: "Acme Inc.",
  team: "Team",
  billing: "Billing",
  settings: "Settings",
};

export function SidebarDemo() {
  const [active, setActive] = useState("analytics");

  return (
    <div className="flex h-[420px] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Sidebar
        items={items}
        activeId={active}
        onNavigate={(id) => setActive(id)}
        header={
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-[13px] text-primary-foreground">
              N
            </span>
            <span className="truncate">Northwind</span>
          </span>
        }
        footer={
          <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs">
              AL
            </span>
            <span className="min-w-0 truncate text-muted-foreground text-xs">
              ada@northwind.com
            </span>
          </div>
        }
      />
      <div className="flex-1 bg-muted/20 p-6">
        <div className="text-muted-foreground text-xs">Workspace</div>
        <h3 className="mt-1 font-semibold text-foreground text-xl tracking-tight">
          {titles[active] ?? active}
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="h-2 w-1/2 rounded-full bg-muted" />
              <div className="mt-3 h-6 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-muted-foreground text-xs">
          Hover the rail to expand · click items to navigate
        </p>
      </div>
    </div>
  );
}
