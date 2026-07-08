"use client";

import { AppShowcase } from "@godui/components";

const SRC = "https://picsum.photos/seed/godui-app/600/1300";

export function AppShowcaseFramesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-8">
      <AppShowcase mode="loop" width={150} frameColor="black" src={SRC} />
      <AppShowcase mode="loop" width={150} frameColor="silver" src={SRC} />
      <AppShowcase mode="loop" width={150} frameColor="gold" src={SRC} />
    </div>
  );
}
