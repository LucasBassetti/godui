"use client";

import { AppShowcase } from "@godui/components";

export function AppShowcaseDemo() {
  return (
    <div className="flex items-center justify-center py-8">
      <AppShowcase
        device="iphone"
        mode="loop"
        width={260}
        src="https://picsum.photos/seed/godui-app/600/1300"
        alt="App home screen"
      />
    </div>
  );
}
