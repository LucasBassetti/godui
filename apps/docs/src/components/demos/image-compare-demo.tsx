"use client";

import { ImageCompare } from "@godui/components";

const SRC_A = "https://picsum.photos/id/1015/800/600";
const SRC_B = "https://picsum.photos/id/1025/800/600";

export function ImageCompareDemo() {
  return (
    <div className="aspect-[4/3] w-full max-w-md">
      <ImageCompare
        beforeLabel="Color"
        afterLabel="B&W"
        before={<img src={SRC_A} alt="Color" />}
        after={<img src={SRC_A} alt="Black and white" className="grayscale" />}
      />
    </div>
  );
}

export function ImageCompareVerticalDemo() {
  return (
    <div className="aspect-[4/3] w-full max-w-md">
      <ImageCompare
        orientation="vertical"
        before={<img src={SRC_B} alt="Color" />}
        after={<img src={SRC_B} alt="Black and white" className="grayscale" />}
      />
    </div>
  );
}
