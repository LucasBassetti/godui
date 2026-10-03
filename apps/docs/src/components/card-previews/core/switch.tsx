"use client";

import { Ac } from "../previews/_kit";

/** Core card preview: GPU-only (translate / scale / opacity), plays on card hover. */
export default function SwitchPreview() {
  return (
    <div className="relative h-6 w-11 rounded-full bg-[var(--muted-foreground)]/20">
      <Ac className="absolute inset-0 rounded-full opacity-0 transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100" />
      <div className="absolute top-0.5 left-0.5 size-5 rounded-full bg-card shadow-sm transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-5" />
    </div>
  );
}
