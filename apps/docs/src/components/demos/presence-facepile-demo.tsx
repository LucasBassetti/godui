"use client";

import { PresenceFacepile } from "@godui/components";

const users = [
  { id: "1", name: "Ana Reyes", status: "active" as const },
  { id: "2", name: "Marco Bell", status: "typing" as const },
  { id: "3", name: "Priya Nair", status: "idle" as const },
  { id: "4", name: "Jules Kim", status: "active" as const },
  { id: "5", name: "Sam Diaz", status: "active" as const },
  { id: "6", name: "Lee Cho", status: "idle" as const },
  { id: "7", name: "Noa Levi", status: "active" as const },
];

export function PresenceFacepileDemo() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            Q3 product roadmap
          </h3>
          <p className="text-xs text-muted-foreground">7 people viewing</p>
        </div>
        <PresenceFacepile users={users} max={5} />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}
