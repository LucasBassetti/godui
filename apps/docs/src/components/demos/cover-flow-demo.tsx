"use client";

import { CoverFlow } from "@godui/components";

const COVERS = [
  { title: "Nightfall", artist: "Aurora Grey", img: "1043" },
  { title: "Golden Hour", artist: "Marlowe", img: "1025" },
  { title: "Deep Field", artist: "Vesper", img: "1039" },
  { title: "Slow Tide", artist: "Costa", img: "1015" },
  { title: "Paper Moons", artist: "Halden", img: "1050" },
];

function Cover({ title, artist, img }: (typeof COVERS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/500/500`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/70">{artist}</p>
      </div>
    </div>
  );
}

export function CoverFlowDemo() {
  return (
    <CoverFlow defaultIndex={2} itemWidth={220} itemHeight={220}>
      {COVERS.map((c) => (
        <Cover key={c.title} {...c} />
      ))}
    </CoverFlow>
  );
}
