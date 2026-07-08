"use client";

import { AppShowcase } from "@godui/components";

const SCREENS = [
  "https://picsum.photos/seed/godui-a/600/1300",
  "https://picsum.photos/seed/godui-b/600/1300",
  "https://picsum.photos/seed/godui-c/600/1300",
];

export function AppShowcaseClusterDemo() {
  return (
    <div className="flex items-center justify-center py-6">
      <AppShowcase mode="cluster" width={160} screens={SCREENS} />
    </div>
  );
}
