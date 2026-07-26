"use client";

import { HolographicCard } from "@godui/components";
import { Sparkles } from "lucide-react";
import { DemoCenter } from "@/components/demos/_kit";

export function HolographicCardDemo() {
  return (
    <DemoCenter>
      <HolographicCard variant="rainbow" className="h-96 w-72 p-6">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white/60 text-xs uppercase tracking-widest">
            Founding Member
          </span>
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="size-4" />
          </span>
        </div>
        <div className="mt-32">
          <h3 className="font-semibold text-2xl text-white tracking-tight">
            GodUI
          </h3>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Move your pointer across the card — the foil, glare, and glitter
            catch the light as it tilts.
          </p>
        </div>
        <div className="mt-6 font-mono text-white/50 text-xs tracking-widest">
          NO. 001 / 500
        </div>
      </HolographicCard>
    </DemoCenter>
  );
}
