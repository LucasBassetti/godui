"use client";

import { OptimisticToggleButton } from "@godui/components";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function OptimisticToggleButtonDemo() {
  return <OptimisticToggleButton onToggle={() => wait(600)} />;
}
