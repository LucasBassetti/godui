"use client";

import { LiquidImage } from "@godui/components";

const IMAGES = [
  { src: "https://picsum.photos/id/1018/640/640", alt: "Mountain landscape" },
  { src: "https://picsum.photos/id/1015/640/640", alt: "River valley" },
  { src: "https://picsum.photos/id/1039/640/640", alt: "Waterfall" },
];

export function LiquidImageDemo() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
      {IMAGES.map((img) => (
        <LiquidImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          className="aspect-square w-full shadow-lg"
        />
      ))}
    </div>
  );
}
