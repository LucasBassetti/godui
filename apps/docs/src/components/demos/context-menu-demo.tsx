"use client";

import { ContextMenu, type ContextMenuItem } from "@godui/components";
import {
  Copy,
  Download,
  FileText,
  Pencil,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function ContextMenuDemo() {
  const [last, setLast] = useState<string | null>(null);
  const [starred, setStarred] = useState(false);

  const items: ContextMenuItem[] = [
    { type: "label", label: "quarterly-report.pdf" },
    {
      label: "Open",
      icon: <FileText className="size-4" />,
      shortcut: "↵",
      onSelect: () => setLast("Open"),
    },
    {
      label: "Rename",
      icon: <Pencil className="size-4" />,
      shortcut: "⌘R",
      onSelect: () => setLast("Rename"),
    },
    {
      label: starred ? "Unstar" : "Star",
      icon: <Star className="size-4" />,
      onSelect: () => {
        setStarred((s) => !s);
        setLast(starred ? "Unstar" : "Star");
      },
    },
    { type: "separator" },
    {
      label: "Copy link",
      icon: <Copy className="size-4" />,
      shortcut: "⌘C",
      onSelect: () => setLast("Copy link"),
    },
    {
      label: "Share",
      icon: <Share2 className="size-4" />,
      onSelect: () => setLast("Share"),
    },
    {
      label: "Download",
      icon: <Download className="size-4" />,
      onSelect: () => setLast("Download"),
    },
    { type: "separator" },
    {
      label: "Delete",
      icon: <Trash2 className="size-4" />,
      destructive: true,
      shortcut: "⌫",
      onSelect: () => setLast("Delete"),
    },
  ];

  return (
    <ContextMenu items={items}>
      <div className="flex w-full max-w-md select-none flex-col items-center gap-4 rounded-xl border border-border border-dashed bg-card px-6 py-10 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-7" />
          {starred && (
            <Star className="-mt-6 ml-9 size-4 fill-amber-400 text-amber-400" />
          )}
        </div>
        <div>
          <div className="font-medium text-foreground text-sm">
            quarterly-report.pdf
          </div>
          <div className="mt-0.5 text-muted-foreground text-xs">
            Right-click for actions
            {last ? ` · ${last}` : ""}
          </div>
        </div>
      </div>
    </ContextMenu>
  );
}
