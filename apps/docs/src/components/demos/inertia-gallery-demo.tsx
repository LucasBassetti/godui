"use client";

import { InertiaGallery } from "@godui/components";

const SHOTS = [
  { label: "Dune", img: "1018" },
  { label: "Harbor", img: "1024" },
  { label: "Ridge", img: "1036" },
  { label: "Bloom", img: "1062" },
  { label: "Quartz", img: "1074" },
  { label: "Meadow", img: "1080" },
];

function Shot({ label, img }: (typeof SHOTS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/400/533`}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export function InertiaGalleryDemo() {
  return (
    <div className="flex w-full flex-1 flex-col justify-center">
      <InertiaGallery snap defaultIndex={2} itemWidth={200} gap={24}>
        {SHOTS.map((s) => (
          <Shot key={s.label} {...s} />
        ))}
      </InertiaGallery>
    </div>
  );
}
