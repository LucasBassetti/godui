"use client";

import { BorderBeam } from "@godui/components";

export function BorderBeamDemo() {
  return (
    <div className="relative flex min-h-[200px] w-[350px] flex-col justify-center overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="font-semibold leading-none">Border Beam</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        A beam of light circles the card border.
      </p>
      <BorderBeam duration={8} size={70} />
    </div>
  );
}
