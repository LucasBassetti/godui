"use client";

import { StackBadge } from "@godui/lab";

export function StackBadgeDemo() {
  return (
    <div className="flex items-center justify-center px-6 py-12">
      <StackBadge
        items={["react", "typescript", "tailwind", "nextjs", "node", "figma"]}
      />
    </div>
  );
}
