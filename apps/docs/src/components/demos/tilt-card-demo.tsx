"use client";

import { TiltCard } from "@godui/components";
import { Sparkles } from "lucide-react";
import { DemoCenter } from "@/components/demos/_kit";

export function TiltCardDemo() {
  return (
    <DemoCenter>
      <TiltCard className="w-72 p-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="size-5" />
        </div>
        <h3 className="mt-4 font-semibold text-foreground text-lg">
          Designed in 3D
        </h3>
        <p className="mt-2 text-muted-foreground text-sm">
          Move your pointer across the card — it tilts toward you with parallax
          depth and a specular glare that tracks the cursor.
        </p>
        <div className="mt-5 inline-flex rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-foreground text-xs">
          Hover me
        </div>
      </TiltCard>
    </DemoCenter>
  );
}
