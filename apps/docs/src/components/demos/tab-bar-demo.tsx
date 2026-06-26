"use client";

import { TabBar, type TabBarTab } from "@godui/components";
import { Bell, Home, Search, User } from "lucide-react";
import { useState } from "react";

const tabs: TabBarTab[] = [
  { value: "home", label: "Home", icon: <Home className="size-5" /> },
  { value: "search", label: "Search", icon: <Search className="size-5" /> },
  {
    value: "alerts",
    label: "Alerts",
    icon: <Bell className="size-5" />,
    badge: 5,
  },
  { value: "profile", label: "Profile", icon: <User className="size-5" /> },
];

const screens: Record<string, { title: string; sub: string }> = {
  home: { title: "Home", sub: "Your daily overview" },
  search: { title: "Search", sub: "Find anything" },
  alerts: { title: "Alerts", sub: "5 new notifications" },
  profile: { title: "Profile", sub: "Ada Lovelace" },
};

export function TabBarDemo() {
  const [tab, setTab] = useState("home");
  const screen = screens[tab];

  return (
    <div className="flex flex-col items-center gap-4">
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      <p className="text-muted-foreground text-xs">
        <span className="text-foreground">{screen.title}</span> · {screen.sub}
      </p>
    </div>
  );
}
