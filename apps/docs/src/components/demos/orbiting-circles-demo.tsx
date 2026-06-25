"use client";

import { OrbitingCircles } from "@godui/components";
import { Box, Cloud, Cpu, Hexagon, Layers, Zap } from "lucide-react";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-full items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm">
      {children}
    </div>
  );
}

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[360px] w-full items-center justify-center">
      <span className="pointer-events-none z-raised rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md">
        GodUI
      </span>

      <OrbitingCircles
        className="absolute"
        radius={70}
        duration={18}
        iconSize={36}
      >
        <Chip>
          <Box className="size-4" />
        </Chip>
        <Chip>
          <Cloud className="size-4" />
        </Chip>
        <Chip>
          <Cpu className="size-4" />
        </Chip>
      </OrbitingCircles>

      <OrbitingCircles
        className="absolute"
        radius={130}
        duration={28}
        iconSize={40}
        reverse
      >
        <Chip>
          <Hexagon className="size-5" />
        </Chip>
        <Chip>
          <Layers className="size-5" />
        </Chip>
        <Chip>
          <Zap className="size-5" />
        </Chip>
        <Chip>
          <Box className="size-5" />
        </Chip>
      </OrbitingCircles>
    </div>
  );
}
