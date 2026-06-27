"use client";

import { ParticleDissolve } from "@godui/components";

export function ParticleDissolveDemo() {
  return (
    <div className="grid w-full place-items-center py-6">
      <ParticleDissolve
        text="GodUI"
        mode="loop"
        trigger="in-view"
        width={620}
        height={220}
        className="max-w-full text-primary"
      />
    </div>
  );
}
