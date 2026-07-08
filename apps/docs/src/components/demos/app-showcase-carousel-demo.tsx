"use client";

import { AppShowcase } from "@godui/components";

const SCREENS = [
  "https://picsum.photos/seed/godui-a/600/1300",
  "https://picsum.photos/seed/godui-b/600/1300",
  "https://picsum.photos/seed/godui-c/600/1300",
];

export function AppShowcaseCarouselDemo() {
  return (
    <div className="flex items-center justify-center py-8">
      <AppShowcase mode="carousel" width={240} screens={SCREENS} />
    </div>
  );
}
