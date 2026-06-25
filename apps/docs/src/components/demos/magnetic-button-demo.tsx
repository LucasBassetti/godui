"use client";

import { MagneticButton } from "@godui/components";
import { ArrowRight, Star } from "lucide-react";

export function MagneticButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <MagneticButton size="lg" range={36}>
          Get started
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </MagneticButton>
        <MagneticButton variant="outline" size="lg" range={36}>
          <Star className="size-4" strokeWidth={2.5} />
          Star on GitHub
        </MagneticButton>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <MagneticButton variant="secondary" size="lg" range={44} staticLabel>
          Label stays centered
        </MagneticButton>
        <span className="text-xs text-muted-foreground">
          <code className="font-mono">staticLabel</code> — label rides with the
          button, no parallax drift
        </span>
      </div>
    </div>
  );
}
