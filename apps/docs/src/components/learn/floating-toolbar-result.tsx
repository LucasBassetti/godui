"use client";

import { FloatingToolbar, type ToolbarAction } from "@godui/components";
import { AlignLeft, Bold, Italic, Link2 } from "lucide-react";
import { useState } from "react";

/**
 * The real, interactive `FloatingToolbar` — toggle it in and out to feel the
 * mount spring from "The motion," and hover/click the actions to feel the
 * per-action spring from "Per-action spring." `Align` starts active so
 * `aria-pressed` has something to show off immediately.
 */
export function FloatingToolbarResult() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("align");

  const actions: ToolbarAction[] = [
    {
      icon: <AlignLeft className="size-[18px]" />,
      label: "Align",
      active: active === "align",
      onClick: () => setActive("align"),
    },
    {
      icon: <Bold className="size-[18px]" />,
      label: "Bold",
      active: active === "bold",
      onClick: () => setActive("bold"),
    },
    {
      icon: <Italic className="size-[18px]" />,
      label: "Italic",
      active: active === "italic",
      onClick: () => setActive("italic"),
    },
    {
      icon: <Link2 className="size-[18px]" />,
      label: "Link",
      active: active === "link",
      onClick: () => setActive("link"),
    },
  ];

  return (
    <div className="not-prose my-8 rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          click an action, or toggle the toolbar off and on
        </span>
      </div>
      <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-6 p-10">
        <FloatingToolbar open={open} actions={actions} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
        >
          {open ? "Hide toolbar" : "Show toolbar"}
        </button>
      </div>
    </div>
  );
}
