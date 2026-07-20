"use client";

import { Drawer } from "@godui/components";
import { Link2, ShoppingBag } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive Drawer,
 * both sides. Open the cart (`side="right"`) and drag it right, or open
 * share (`side="bottom"`) and drag the handle down — past the threshold, or
 * with a flick, it dismisses; short of that, it springs back.
 */
export function DrawerResult() {
  const [cartOpen, setCartOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag to dismiss
        </span>
      </div>
      <div className="flex min-h-[280px] flex-wrap items-center justify-center gap-4 p-10">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ShoppingBag className="size-4" strokeWidth={2} />
          Open cart
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
        >
          <Link2 className="size-4" strokeWidth={2} />
          Share
        </button>
      </div>

      <Drawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        side="right"
        title="Your cart"
      >
        <ul className="space-y-3">
          <li className="flex justify-between text-sm">
            <span className="text-foreground">Aurora Watch</span>
            <span className="text-muted-foreground tabular-nums">$429</span>
          </li>
          <li className="flex justify-between text-sm">
            <span className="text-foreground">Studio Headphones</span>
            <span className="text-muted-foreground tabular-nums">$349</span>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setCartOpen(false)}
          className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Checkout · $778
        </button>
      </Drawer>

      <Drawer
        open={shareOpen}
        onOpenChange={setShareOpen}
        side="bottom"
        title="Share"
      >
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
            className="rounded-md bg-primary px-2.5 py-1.5 text-primary-foreground text-xs font-medium"
          >
            Copy
          </button>
        </div>
      </Drawer>
    </div>
  );
}
