"use client";

import { LiquidImage } from "@godui/components";
import { DemoMedia } from "@/components/demos/_kit";

const IMAGES = [
  { src: "https://picsum.photos/id/1018/640/640", alt: "Mountain landscape" },
  { src: "https://picsum.photos/id/1015/640/640", alt: "River valley" },
  { src: "https://picsum.photos/id/1039/640/640", alt: "Waterfall" },
];

export function LiquidImageDemo() {
  return (
    <DemoMedia max="3xl">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        {IMAGES.map((img) => (
          <LiquidImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="aspect-square w-full shadow-lg"
          />
        ))}
      </div>
    </DemoMedia>
  );
}
