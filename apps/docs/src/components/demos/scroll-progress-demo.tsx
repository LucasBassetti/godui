"use client";

import { ScrollProgress } from "@godui/components";
import * as React from "react";
import { DemoScrollPort } from "@/components/demos/_kit";

const filler = Array.from({ length: 14 });

function ScrollBox({ variant }: { variant: "bar" | "circle" }) {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <DemoScrollPort
      ref={ref}
      variant="framed"
      height="18rem"
      max="md"
      className="rounded-xl bg-card"
    >
      {variant === "bar" && <ScrollProgress container={ref} />}
      <div className="space-y-4 p-6">
        <p className="font-medium text-foreground text-sm">Scroll this panel</p>
        {filler.map((_, i) => (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: static filler copy
            key={i}
            className="text-muted-foreground text-sm leading-relaxed"
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
    </DemoScrollPort>
  );
}

export function ScrollProgressDemo() {
  return <ScrollBox variant="bar" />;
}

export function ScrollProgressCircleDemo() {
  return <ScrollBox variant="circle" />;
}
