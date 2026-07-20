"use client";

import { ContextMenu, type ContextMenuItem } from "@godui/components";
import { Copy, Download, FileText, Pencil, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive Context
 * Menu. Right-click the surface to feel the spring open from the cursor point;
 * try it near an edge to trigger the viewport flip; arrow-key through the items
 * and hit Escape to dismiss.
 */
export function ContextMenuResult() {
  const [last, setLast] = useState<string | null>(null);

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
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — right-click the surface
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 p-10">
        <ContextMenu items={items}>
          <div className="flex w-full max-w-md select-none flex-col items-center gap-4 rounded-xl border border-border border-dashed bg-card px-6 py-10 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-7" />
            </div>
            <div>
              <div className="font-medium text-foreground text-sm">
                quarterly-report.pdf
              </div>
              <div className="mt-0.5 text-muted-foreground text-xs">
                Right-click for actions{last ? ` · ${last}` : ""}
              </div>
            </div>
          </div>
        </ContextMenu>
      </div>
    </div>
  );
}
