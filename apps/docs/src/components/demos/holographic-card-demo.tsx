"use client";

import { HolographicCard } from "@godui/components";
import { Sparkles } from "lucide-react";

export function HolographicCardDemo() {
  return (
    <HolographicCard variant="rainbow" className="h-96 w-72 p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-white/60">
          Founding Member
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
          <Sparkles className="size-4" />
        </span>
      </div>
      <div className="mt-32">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          GodUI
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Move your pointer across the card — the foil, glare, and glitter catch
          the light as it tilts.
        </p>
      </div>
      <div className="mt-6 font-mono text-xs tracking-widest text-white/50">
        NO. 001 / 500
      </div>
    </HolographicCard>
  );
}
