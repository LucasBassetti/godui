"use client";

import { Sk } from "./_kit";

export default function AuroraTextPreview() {
  return (
    <div className="flex items-center gap-2">
      <Sk className="h-4 w-12 rounded" />
      <div className="h-4 w-16 rounded bg-gradient-to-r from-primary to-primary/40 transition-all duration-500 group-hover:from-primary/40 group-hover:to-primary" />
      <Sk className="h-4 w-8 rounded" />
    </div>
  );
}
