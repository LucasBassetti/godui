"use client";

import { Ac, Panel, Sk } from "../previews/_kit";

const glide =
  "transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Core card preview: GPU-only (translate), plays on card hover. The panel's
 * surface slides to an icon rail while the content beside it glides along.
 */
export default function SidebarPreview() {
  return (
    <Panel className="relative h-24 w-44 overflow-hidden">
      {/* Content beside the sidebar: glued to the panel's edge. */}
      <div
        className={`absolute inset-y-0 left-14 flex w-40 flex-col gap-1.5 p-2.5 ${glide} group-hover:-translate-x-9`}
      >
        <Sk className="h-1.5 w-10 rounded-full" />
        <div className="grid grid-cols-2 gap-1.5">
          <Sk className="h-6 rounded-md" />
          <Sk className="h-6 rounded-md" />
        </div>
        <Sk className="h-6 w-[7.25rem] rounded-md" />
      </div>
      {/* The surface slides its edge to the rail; the icons hold still. */}
      <div
        className={`absolute inset-y-0 left-0 w-14 border-border border-r bg-[var(--muted)] ${glide} group-hover:-translate-x-9`}
      />
      <div className="absolute inset-y-0 left-0 flex flex-col gap-2 p-2">
        <Ac className="size-1.5 rounded-full" />
        {["w-7", "w-5", "w-6"].map((width) => (
          <div key={width} className="flex items-center gap-1">
            <Sk className="size-1.5 rounded-sm" />
            <Sk
              className={`h-1.5 ${width} rounded-full transition-opacity duration-200 group-hover:opacity-0`}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}
