"use client";

import { StoreBadge, StoreBadgeGroup } from "@godui/components";

export function StoreBadgeDemo() {
  return (
    <div className="flex items-center justify-center py-10">
      <StoreBadgeGroup>
        <StoreBadge
          store="app-store"
          href="https://apps.apple.com/app/id6761287549"
          target="_blank"
          rel="noreferrer"
        />
        <StoreBadge
          store="google-play"
          href="https://play.google.com/store/apps/details?id=lol.hivemind"
          target="_blank"
          rel="noreferrer"
        />
      </StoreBadgeGroup>
    </div>
  );
}
