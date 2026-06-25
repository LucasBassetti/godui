"use client";

import { BentoCard, BentoGrid } from "@godui/components";
import {
  Activity,
  Globe2,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

function MiniBars() {
  const bars = [40, 64, 52, 78, 60, 92, 72];
  return (
    <div className="mt-5 flex h-24 items-end gap-1.5">
      {bars.map((h, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed static bar chart
          key={`${h}-${i}`}
          className="flex-1 rounded-sm bg-primary/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

const iconWrap =
  "inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl">
      <BentoCard
        colSpan={2}
        icon={
          <span className={iconWrap}>
            <Sparkles className="size-5" strokeWidth={2} />
          </span>
        }
        title="Interfaces that feel alive"
        description="Spring-driven motion, pointer-aware surfaces, and pixel-tuned details — the same craft a senior design engineer ships by hand, ready to drop in."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          {["60fps", "Reduced-motion safe", "Themed tokens", "Zero config"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </BentoCard>

      <BentoCard
        rowSpan={2}
        icon={
          <span className={iconWrap}>
            <Activity className="size-5" strokeWidth={2} />
          </span>
        }
        title="Realtime analytics"
        description="Every interaction streamed and charted as it happens."
      >
        <MiniBars />
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums text-foreground">
            1.2M
          </span>
          <span className="text-sm text-muted-foreground">events / day</span>
        </div>
      </BentoCard>

      <BentoCard
        icon={
          <span className={iconWrap}>
            <ShieldCheck className="size-5" strokeWidth={2} />
          </span>
        }
        title="Enterprise-grade"
        description="SOC 2 Type II, SSO, and audit logs out of the box."
      />

      <BentoCard
        icon={
          <span className={iconWrap}>
            <Globe2 className="size-5" strokeWidth={2} />
          </span>
        }
        title="120ms p95 globally"
        description="Served from 35 edge regions, close to every user."
      />

      <BentoCard
        colSpan={2}
        icon={
          <span className={iconWrap}>
            <Workflow className="size-5" strokeWidth={2} />
          </span>
        }
        title="Automate the busywork"
        description="Chain triggers, conditions, and actions into flows that run themselves — no glue code."
        cta={
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <Zap className="size-4" strokeWidth={2} />
            Explore automations
          </span>
        }
      />
    </BentoGrid>
  );
}
