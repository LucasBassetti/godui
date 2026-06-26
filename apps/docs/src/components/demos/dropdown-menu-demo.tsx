"use client";

import { DropdownMenu, type DropdownMenuItem } from "@godui/components";
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";

export function DropdownMenuDemo() {
  const [last, setLast] = useState<string | null>(null);

  const items: DropdownMenuItem[] = [
    { type: "label", label: "Signed in as ada@northwind.com" },
    {
      label: "Profile",
      icon: <User className="size-4" />,
      shortcut: "⌘P",
      onSelect: () => setLast("Profile"),
    },
    {
      label: "Billing",
      icon: <CreditCard className="size-4" />,
      onSelect: () => setLast("Billing"),
    },
    {
      label: "Settings",
      icon: <Settings className="size-4" />,
      shortcut: "⌘,",
      onSelect: () => setLast("Settings"),
    },
    {
      label: "Switch workspace",
      icon: <Users className="size-4" />,
      submenu: [
        { label: "Northwind", onSelect: () => setLast("Northwind") },
        { label: "Acme Inc.", onSelect: () => setLast("Acme Inc.") },
        { type: "separator" },
        {
          label: "New workspace",
          icon: <Plus className="size-4" />,
          onSelect: () => setLast("New workspace"),
        },
      ],
    },
    { type: "separator" },
    {
      label: "Upgrade to Pro",
      icon: <Sparkles className="size-4" />,
      onSelect: () => setLast("Upgrade"),
    },
    {
      label: "Log out",
      icon: <LogOut className="size-4" />,
      onSelect: () => setLast("Log out"),
    },
  ];

  return (
    <div className="flex h-80 w-full max-w-md flex-col items-center gap-4 pt-2">
      <DropdownMenu
        align="end"
        trigger={
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pr-3 pl-1 font-medium text-foreground text-sm shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
              AL
            </span>
            Ada Lovelace
            <ChevronDown className="size-4 text-muted-foreground" />
          </span>
        }
        items={items}
      />
      <p className="text-muted-foreground text-xs">
        {last ? (
          <>
            Selected: <span className="text-foreground">{last}</span>
          </>
        ) : (
          "Open the menu and pick an action"
        )}
      </p>
    </div>
  );
}
