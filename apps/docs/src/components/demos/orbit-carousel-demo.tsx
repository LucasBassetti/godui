"use client";

import { OrbitCarousel } from "@godui/components";

const CARDS = [
  { title: "Aurora", img: "1041" },
  { title: "Basalt", img: "1047" },
  { title: "Cirrus", img: "1052" },
  { title: "Drift", img: "1059" },
  { title: "Ember", img: "1069" },
];

function OrbitCard({ title, img }: (typeof CARDS)[number]) {
  return (
    <div className="relative size-full select-none">
      <img
        src={`https://picsum.photos/id/${img}/320/400`}
        alt={title}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
}

export function OrbitCarouselDemo() {
  return (
    <OrbitCarousel defaultIndex={2} radius={230} angleStep={26}>
      {CARDS.map((c) => (
        <OrbitCard key={c.title} {...c} />
      ))}
    </OrbitCarousel>
  );
}
