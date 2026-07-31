"use client";

import { PresenceFacepile } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * PresenceFacepile. Hover an avatar for the lift, click the +N chip for
 * the overflow popover.
 */
const USERS = [
  { id: "1", name: "Ana Reyes", status: "active" as const },
  { id: "2", name: "Marco Bell", status: "typing" as const },
  { id: "3", name: "Priya Nair", status: "idle" as const },
  { id: "4", name: "Jules Kim", status: "active" as const },
  { id: "5", name: "Sam Diaz", status: "active" as const },
  { id: "6", name: "Lee Cho", status: "idle" as const },
  { id: "7", name: "Noa Levi", status: "offline" as const },
];

export function PresenceFacepileResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <PresenceFacepile users={USERS} max={5} />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover an avatar, or open the +N chip
        </span>
      </div>
      <div className="flex min-h-[220px] items-center justify-center p-10">
        <PresenceFacepile users={USERS} max={5} />
      </div>
    </div>
  );
}
