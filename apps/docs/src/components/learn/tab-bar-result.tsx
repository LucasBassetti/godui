"use client";

import { TabBar, type TabBarTab } from "@godui/components";
import { Bell, Home, Search, User } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive Tab Bar.
 * Click between tabs and feel the blob spring to the new slot while its icon
 * pops; the alerts badge rides along on the icon.
 */
const TABS: TabBarTab[] = [
  { value: "home", label: "Home", icon: <Home className="size-5" /> },
  { value: "search", label: "Search", icon: <Search className="size-5" /> },
  {
    value: "alerts",
    label: "Alerts",
    icon: <Bell className="size-5" />,
    badge: 3,
  },
  { value: "profile", label: "Profile", icon: <User className="size-5" /> },
];

export function TabBarResult() {
  const [tab, setTab] = useState("home");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click between tabs
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 p-10">
        <TabBar tabs={TABS} value={tab} onChange={setTab} />
        <p className="text-muted-foreground text-xs">
          Active tab: <span className="text-foreground">{tab}</span>
        </p>
      </div>
    </div>
  );
}
