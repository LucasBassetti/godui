"use client";

import { ImageTrail } from "@godui/components";

const IMAGES = [
  "https://picsum.photos/id/1015/400/400",
  "https://picsum.photos/id/1025/400/400",
  "https://picsum.photos/id/1039/400/400",
  "https://picsum.photos/id/1043/400/400",
  "https://picsum.photos/id/1056/400/400",
  "https://picsum.photos/id/1062/400/400",
];

export function ImageTrailDemo() {
  return (
    <ImageTrail
      images={IMAGES}
      size={150}
      className="grid h-[26rem] w-full place-items-center rounded-xl border border-border bg-background"
    >
      <div className="pointer-events-none text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Move your cursor
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Images trail the pointer and drift away.
        </p>
      </div>
    </ImageTrail>
  );
}
