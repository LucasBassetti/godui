"use client";

import { Ac, Panel, Sk } from "./_kit";

function Row({ accent }: { accent?: boolean }) {
  return (
    <Panel className="flex w-44 items-center gap-2.5 p-2.5 shadow-md">
      {accent ? (
        <Ac className="size-5 shrink-0 rounded-full" />
      ) : (
        <Sk className="size-5 shrink-0 rounded-full" />
      )}
      <div className="flex-1 space-y-1.5">
        <Sk className="h-1.5 w-1/2 rounded-full" />
        <Sk className="h-1.5 w-3/4 rounded-full" />
      </div>
    </Panel>
  );
}

export default function ToastPreview() {
  return (
    <div className="flex flex-col gap-2">
      <div className="-translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Row accent />
      </div>
      <Row />
    </div>
  );
}
