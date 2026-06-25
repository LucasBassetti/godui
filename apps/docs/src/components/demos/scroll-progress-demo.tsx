"use client";

import { ScrollProgress } from "@godui/components";
import * as React from "react";

const filler = Array.from({ length: 14 });

function ScrollBox({ variant }: { variant: "bar" | "circle" }) {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-scroll-container
      className="relative h-72 w-full max-w-md overflow-y-auto rounded-xl border border-border bg-card"
    >
      {variant === "bar" && <ScrollProgress container={ref} />}
      <div className="space-y-4 p-6">
        <p className="text-sm font-medium text-foreground">Scroll this panel</p>
        {filler.map((_, i) => (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: static filler copy
            key={i}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            The progress indicator tracks this scroll container. Keep scrolling
            to watch it fill — paragraph {i + 1} of {filler.length}.
          </p>
        ))}
      </div>
      {variant === "circle" && (
        <ScrollProgress
          variant="circle"
          container={ref}
          showAfter={0.05}
          position="bottom-left"
        />
      )}
    </div>
  );
}

export function ScrollProgressDemo() {
  return <ScrollBox variant="bar" />;
}

export function ScrollProgressCircleDemo() {
  return <ScrollBox variant="circle" />;
}
