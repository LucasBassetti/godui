"use client";

import { StoreBadge, StoreBadgeGroup } from "@godui/components";

export function StoreBadgeQrDemo() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-end gap-3 pb-4">
      <p className="text-sm text-muted-foreground">Hover a badge ↓</p>
      <StoreBadgeGroup>
        <StoreBadge
          store="app-store"
          href="https://apps.apple.com/app/id6761287549"
          target="_blank"
          rel="noreferrer"
          qr
          qrLabel="Get Hivemind on iPhone"
        />
        <StoreBadge
          store="google-play"
          href="https://play.google.com/store/apps/details?id=lol.hivemind"
          target="_blank"
          rel="noreferrer"
          qr
          qrLabel="Get Hivemind on Android"
        />
      </StoreBadgeGroup>
    </div>
  );
}
