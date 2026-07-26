"use client";

import { MagneticButton } from "@godui/components";
import { ArrowRight, Star } from "lucide-react";

/** Default stage — one primary + one secondary product CTA. */
export function MagneticButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <MagneticButton size="lg" range={36}>
        Get started
        <ArrowRight className="size-4" strokeWidth={2.5} />
      </MagneticButton>
      <MagneticButton
        variant="outline"
        size="lg"
        range={36}
        onClick={() =>
          window.open(
            "https://github.com/LucasBassetti/godui",
            "_blank",
            "noopener,noreferrer",
          )
        }
      >
        <Star className="size-4" strokeWidth={2.5} />
        Star on GitHub
      </MagneticButton>
    </div>
  );
}
