"use client";

import { Drawer } from "@godui/components";
import { Check, Copy, Link2, Mail, MessageSquare, Send } from "lucide-react";
import { type ComponentType, useState } from "react";

const TARGETS: {
  label: string;
  tile: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { label: "Email", tile: "bg-sky-500/15 text-sky-500", Icon: Mail },
  {
    label: "Messages",
    tile: "bg-emerald-500/15 text-emerald-500",
    Icon: MessageSquare,
  },
  { label: "Send", tile: "bg-violet-500/15 text-violet-500", Icon: Send },
  { label: "Copy link", tile: "bg-indigo-500/15 text-indigo-500", Icon: Link2 },
];

export function DrawerBottomDemo() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
      <div className="text-center">
        <div className="text-sm font-semibold text-foreground">
          Aurora Design System
        </div>
        <div className="text-xs text-muted-foreground">
          Invite collaborators to this project
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Share project
      </button>

      <Drawer open={open} onOpenChange={setOpen} side="bottom" title="Share">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-1.5 pl-3">
          <Link2
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={2}
          />
          <span className="flex-1 truncate text-sm text-muted-foreground">
            godui.design/p/aurora-x82k
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground"
          >
            {copied ? (
              <Check className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {TARGETS.map(({ label, tile, Icon }) => (
            <button
              key={label}
              type="button"
              className="flex flex-col items-center gap-2 rounded-lg p-2 [transition:background_200ms_ease] hover:bg-accent"
            >
              <span
                className={`flex size-12 items-center justify-center rounded-full ${tile}`}
              >
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
