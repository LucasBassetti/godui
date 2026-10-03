"use client";

import { Ac, Sk } from "../previews/_kit";

/** Core card preview: GPU-only (scale / opacity), plays on card hover. */
export default function InputGroupPreview() {
  return (
    <div className="relative flex h-9 w-48 items-center gap-2 rounded-md border border-[var(--muted-foreground)]/25 pr-1.5 pl-3 group-hover:border-ring">
      <div className="pointer-events-none absolute -inset-px scale-[0.99] rounded-md opacity-0 ring-[3px] ring-ring/50 transition-[opacity,scale] duration-(--godui-duration-fast) ease-out-expo group-hover:scale-100 group-hover:opacity-100" />
      <Sk className="size-3.5 rounded-full" />
      <Sk className="h-2 w-20 rounded-full" />
      <Ac className="ml-auto h-6 w-10 rounded-[5px]" />
    </div>
  );
}
