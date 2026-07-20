"use client";

import { ResizableHeader } from "@godui/components";
import { useRef, useState } from "react";

const LINKS = [
  { label: "Product", href: "product" },
  { label: "Solutions", href: "solutions" },
  { label: "Customers", href: "customers" },
  { label: "Pricing", href: "pricing" },
];

export function ResizableHeaderDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("product");

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-border border-b px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 truncate text-muted-foreground text-xs">
          northwind.com
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-80 overflow-x-hidden overflow-y-auto bg-muted/20"
      >
        <ResizableHeader
          scrollRef={scrollRef}
          activeHref={active}
          onNavigate={setActive}
          logo={
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary font-bold text-[13px] text-primary-foreground">
                N
              </span>
              Northwind
            </span>
          }
          links={LINKS}
          cta={
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm"
            >
              Start free
            </button>
          }
        />

        <div className="space-y-6 px-6 pt-10 pb-16">
          <div className="space-y-3">
            <h2 className="font-semibold text-2xl text-foreground tracking-tight">
              Ship faster with Northwind
            </h2>
            <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
              Scroll this panel — the navigation springs into a compact, blurred
              pill and the active link indicator follows along.
            </p>
          </div>
          {["Analytics", "Automations", "Integrations", "Security"].map((t) => (
            <div
              key={t}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="font-medium text-foreground text-sm">{t}</div>
              <div className="mt-1.5 h-2 w-2/3 rounded-full bg-muted" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
