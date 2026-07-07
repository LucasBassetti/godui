"use client";

import { Ac, Panel, Sk } from "./_kit";

export default function ContainerScrollPreview() {
  return (
    <div className="flex h-24 w-40 items-center justify-center [perspective:400px]">
      <Panel className="w-36 p-2 [transform:rotateX(32deg)] transition-transform duration-500 ease-out group-hover:[transform:rotateX(0deg)]">
        <Ac className="h-2.5 w-1/2 rounded" />
        <Sk className="mt-2 h-12 w-full rounded-md" />
      </Panel>
    </div>
  );
}
