"use client";

import { TiltCard } from "@godui/components";
import { Sparkles } from "lucide-react";

export function TiltCardDemo() {
  return (
    <TiltCard className="w-72 p-6">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        Designed in 3D
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Move your pointer across the card — it tilts toward you with parallax
        depth and a specular glare that tracks the cursor.
      </p>
      <div className="mt-5 inline-flex rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
        Hover me
      </div>
    </TiltCard>
  );
}
