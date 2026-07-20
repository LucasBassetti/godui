"use client";

import { ResizableHeader } from "@godui/components";
import { useRef, useState } from "react";

const LINKS = [
  { label: "Product", href: "product" },
  { label: "Solutions", href: "solutions" },
  { label: "Customers", href: "customers" },
  { label: "Pricing", href: "pricing" },
];

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * Resizable Header. `scrollRef` points it at this panel's own scroll
 * container instead of the window, so scrolling here — not the page — is
 * what drives the morph and the active-link underline.
 *
 * The browser chrome is sized to fit logo + links + CTA (viewport `md:`
 * still shows the desktop nav even inside this panel). `overflow-x-hidden`
 * keeps Framer `layout` morphs from creating a horizontal scroll that
 * clips the left edge of the trail.
 */
export function ResizableHeaderResult() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("product");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll the panel below
        </span>
      </div>
      <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-1.5 border-border border-b bg-[var(--card)] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            <span className="ml-3 truncate text-muted-foreground text-xs">
              northwind.com
            </span>
          </div>

          <div
            ref={scrollRef}
            className="h-96 overflow-x-hidden overflow-y-auto bg-muted/20"
          >
            <ResizableHeader
              scrollRef={scrollRef}
              activeHref={active}
              onNavigate={setActive}
              logo={
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-[13px] text-primary-foreground">
                    N
                  </span>
                  <span className="truncate">Northwind</span>
                </span>
              }
              links={LINKS}
              cta={
                <button
                  type="button"
                  className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm whitespace-nowrap"
                >
                  Start free
                </button>
              }
            />

            <div className="space-y-6 px-6 pt-10 pb-16">
              <div className="space-y-3">
                <h3 className="font-semibold text-2xl text-foreground tracking-tight">
                  Ship faster with Northwind
                </h3>
                <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                  Scroll this panel — the nav springs into a compact, blurred
                  pill and the active-link indicator rides along.
                </p>
              </div>
              {["Analytics", "Automations", "Integrations", "Security"].map(
                (t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="font-medium text-foreground text-sm">
                      {t}
                    </div>
                    <div className="mt-1.5 h-2 w-2/3 rounded-full bg-muted" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
