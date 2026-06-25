"use client";

import { Lamp } from "@godui/components";

export function LampDemo() {
  return (
    <Lamp className="w-full">
      <h2 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
        Build something
        <br />
        the world remembers
      </h2>
    </Lamp>
  );
}
