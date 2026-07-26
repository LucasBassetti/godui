"use client";

import { ImageCompare } from "@godui/components";
import { DemoMedia } from "@/components/demos/_kit";

const SRC_A = "https://picsum.photos/id/1015/800/600";
const SRC_B = "https://picsum.photos/id/1025/800/600";

export function ImageCompareDemo() {
  return (
    <DemoMedia max="md" aspect="photo">
      <ImageCompare
        beforeLabel="Color"
        afterLabel="B&W"
        before={<img src={SRC_A} alt="Color" />}
        after={<img src={SRC_A} alt="Black and white" className="grayscale" />}
      />
    </DemoMedia>
  );
}

export function ImageCompareVerticalDemo() {
  return (
    <DemoMedia max="md" aspect="photo">
      <ImageCompare
        orientation="vertical"
        before={<img src={SRC_B} alt="Color" />}
        after={<img src={SRC_B} alt="Black and white" className="grayscale" />}
      />
    </DemoMedia>
  );
}
