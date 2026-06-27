"use client";

import { ImageAccordion } from "@godui/components";

const PANELS = [
  {
    image: "https://picsum.photos/id/1018/900/1200",
    title: "Mountains",
    description: "Alpine ridges at first light.",
  },
  {
    image: "https://picsum.photos/id/1015/900/1200",
    title: "Rivers",
    description: "Glacial water carving the valley.",
  },
  {
    image: "https://picsum.photos/id/1039/900/1200",
    title: "Waterfalls",
    description: "A 60-metre drop into the basin.",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    title: "Forests",
    description: "Old growth as far as you can see.",
  },
  {
    image: "https://picsum.photos/id/1056/900/1200",
    title: "Coastline",
    description: "Where the cliffs meet the sea.",
  },
];

export function ImageAccordionDemo() {
  return (
    <ImageAccordion
      panels={PANELS}
      className="w-full max-w-2xl"
      height="24rem"
    />
  );
}
