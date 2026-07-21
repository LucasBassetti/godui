"use client";

import { BentoCard, BentoGrid } from "@godui/components";
import { Activity, Globe2, ShieldCheck, Sparkles } from "lucide-react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `BentoGrid`. Scroll it into view to see the stagger, then hover a card for
 * the lift + spotlight.
 */
const iconWrap =
  "inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary";

export function BentoGridResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover a card
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-8">
        <BentoGrid className="max-w-3xl">
          <BentoCard
            colSpan={2}
            icon={
              <span className={iconWrap}>
                <Sparkles className="size-5" />
              </span>
            }
            title="Interfaces that feel alive"
            description="Spring-driven motion and pixel-tuned details, ready to drop in."
          />
          <BentoCard
            rowSpan={2}
            icon={
              <span className={iconWrap}>
                <Activity className="size-5" />
              </span>
            }
            title="Realtime analytics"
            description="Every interaction streamed and charted as it happens."
          />
          <BentoCard
            icon={
              <span className={iconWrap}>
                <ShieldCheck className="size-5" />
              </span>
            }
            title="Enterprise-grade"
            description="SOC 2 Type II, SSO, and audit logs out of the box."
          />
          <BentoCard
            icon={
              <span className={iconWrap}>
                <Globe2 className="size-5" />
              </span>
            }
            title="120ms p95 globally"
            description="Served from 35 edge regions, close to every user."
          />
        </BentoGrid>
      </div>
    </div>
  );
}
